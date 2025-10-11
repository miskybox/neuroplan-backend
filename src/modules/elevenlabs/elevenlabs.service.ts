import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TextToSpeechDto, PeiAudioRequest } from './dto/elevenlabs.dto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ElevenLabsService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';
  private readonly defaultVoiceId: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get<string>('ELEVENLABS_API_KEY');
    this.defaultVoiceId = this.configService.get<string>('ELEVENLABS_VOICE_ID', '21m00Tcm4TlvDq8ikWAM');
    
    if (!this.apiKey || this.apiKey.startsWith('tu_')) {
      console.warn('⚠️  ElevenLabs API key no configurada. Usando modo mock para hackathon.');
    }
  }

  /**
   * Convierte texto a audio usando ElevenLabs
   */
  async textToSpeech(dto: TextToSpeechDto): Promise<Buffer> {
    const voiceId = dto.voiceId || this.defaultVoiceId;
    
    // Modo mock para hackathon si no hay API key
    if (!this.apiKey || this.apiKey.startsWith('tu_')) {
      return this.generateMockAudio(dto.text);
    }

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${voiceId}`,
        {
          text: dto.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.2,
            use_speaker_boost: true,
          },
        },
        {
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': this.apiKey,
          },
          responseType: 'arraybuffer',
        },
      );

      return Buffer.from(response.data);
    } catch (error: any) {
      console.error('Error en ElevenLabs TTS:', error.response?.data || error.message);
      throw new InternalServerErrorException('Error generando audio con ElevenLabs');
    }
  }

  /**
   * Genera audio para un PEI específico
   */
  async generatePeiAudio(peiId: string, request: PeiAudioRequest): Promise<any> {
    // Obtener PEI con datos completos
    const pei = await this.prisma.pEI.findUnique({
      where: { id: peiId },
      include: {
        student: true,
      },
    });

    if (!pei) {
      throw new BadRequestException('PEI no encontrado');
    }

    // Generar texto según el tipo solicitado
    let textToConvert = '';
    
    switch (request.type) {
      case 'SUMMARY':
        textToConvert = this.generateSummaryText(pei);
        break;
      case 'OBJECTIVES':
        textToConvert = this.generateObjectivesText(pei);
        break;
      case 'FULL':
        textToConvert = this.generateFullPeiText(pei);
        break;
      case 'CUSTOM':
        textToConvert = request.customText || pei.summary;
        break;
      default:
        throw new BadRequestException('Tipo de audio no válido');
    }

    // Generar audio
    const audioBuffer = await this.textToSpeech({
      text: textToConvert,
      language: 'es',
    });

    // Guardar archivo de audio
    const audioFile = await this.saveAudioFile(peiId, audioBuffer, request.type);

    // Log de actividad
    await this.prisma.activityLog.create({
      data: {
        action: 'generate_audio',
        entity: 'audio',
        entityId: audioFile.id,
        details: JSON.stringify({
          peiId,
          type: request.type,
          duration: this.estimateAudioDuration(textToConvert),
        }),
      },
    });

    return audioFile;
  }

  /**
   * Obtiene audio de resumen de PEI
   */
  async getPeiSummaryAudio(peiId: string): Promise<Buffer | null> {
    // Buscar audio existente
    const existingAudio = await this.prisma.audioFile.findFirst({
      where: {
        peiId,
        type: 'SUMMARY',
      },
      orderBy: { createdAt: 'desc' },
    });

    if (existingAudio && fs.existsSync(existingAudio.path)) {
      return fs.readFileSync(existingAudio.path);
    }

    // Si no existe, generar nuevo
    const audioFile = await this.generatePeiAudio(peiId, { type: 'SUMMARY' });
    return fs.readFileSync(audioFile.path);
  }

  /**
   * Lista todos los audios de un PEI
   */
  async getPeiAudios(peiId: string) {
    return this.prisma.audioFile.findMany({
      where: { peiId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Genera texto de resumen para audio
   */
  private generateSummaryText(pei: any): string {
    const student = pei.student;
    
    return `
Plan Educativo Individualizado para ${student.name} ${student.lastName}.

${pei.summary}

Este plan ha sido generado automáticamente por NeuroPlan usando inteligencia artificial, 
y está diseñado específicamente para las necesidades educativas de ${student.name}.

Para más información, consulte el documento completo o contacte con el equipo educativo.
    `.trim();
  }

  /**
   * Genera texto de objetivos para audio
   */
  private generateObjectivesText(pei: any): string {
    const objectives = JSON.parse(pei.objectives);
    
    let text = `Objetivos del Plan Educativo para ${pei.student.name}:\n\n`;
    
    objectives.forEach((obj: any, index: number) => {
      text += `Objetivo ${index + 1}: ${obj.title}. ${obj.description}\n`;
    });

    return text;
  }

  /**
   * Genera texto completo del PEI para audio
   */
  private generateFullPeiText(pei: any): string {
    return `
${this.generateSummaryText(pei)}

Diagnóstico:
${pei.diagnosis}

${this.generateObjectivesText(pei)}

Este plan será revisado periódicamente para asegurar su efectividad.
    `.trim();
  }

  /**
   * Guarda archivo de audio en disco y base de datos
   */
  private async saveAudioFile(peiId: string, audioBuffer: Buffer, type: string) {
    // Crear directorio si no existe
    const audioDir = path.join(process.cwd(), 'uploads', 'audio');
    if (!fs.existsSync(audioDir)) {
      fs.mkdirSync(audioDir, { recursive: true });
    }

    // Generar nombre único
    const timestamp = Date.now();
    const filename = `pei_${peiId}_${type.toLowerCase()}_${timestamp}.mp3`;
    const filePath = path.join(audioDir, filename);

    // Guardar archivo
    fs.writeFileSync(filePath, audioBuffer);

    // Crear registro en base de datos
    return this.prisma.audioFile.create({
      data: {
        filename,
        path: filePath,
        type,
        size: audioBuffer.length,
        duration: this.estimateAudioDuration(''), // Estimación simple
        voiceId: this.defaultVoiceId,
        language: 'es',
        peiId,
      },
    });
  }

  /**
   * Estima duración del audio (aproximadamente 150 palabras por minuto)
   */
  private estimateAudioDuration(text: string): number {
    const words = text.split(/\s+/).length;
    const minutes = words / 150;
    return Math.ceil(minutes * 60); // Segundos
  }

  /**
   * Genera audio mock para desarrollo sin API key
   */
  private generateMockAudio(text: string): Buffer {
    // Generar un archivo de audio simple (mock)
    const duration = this.estimateAudioDuration(text);
    const mockData = Buffer.alloc(duration * 1000); // 1KB por segundo aprox
    
    // Llenar con datos simulados
    for (let i = 0; i < mockData.length; i++) {
      mockData[i] = Math.floor(Math.random() * 256);
    }

    return mockData;
  }

  /**
   * Obtiene información de voces disponibles
   */
  async getAvailableVoices() {
    if (!this.apiKey || this.apiKey.startsWith('tu_')) {
      return [
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel (Mock)',
          category: 'premade',
          labels: { gender: 'female', age: 'young' },
        },
        {
          voice_id: 'AZnzlk1XvdvUeBnXmlld',
          name: 'Domi (Mock)',
          category: 'premade', 
          labels: { gender: 'female', age: 'young' },
        },
      ];
    }

    try {
      const response = await axios.get(`${this.baseUrl}/voices`, {
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.data.voices;
    } catch (error: any) {
      console.error('Error obteniendo voces:', error.response?.data || error.message);
      return [];
    }
  }
}