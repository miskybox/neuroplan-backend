import { Injectable } from '@nestjs/common';

/**
 * ElevenLabs Service
 * Integración con ElevenLabs para text-to-speech de alta calidad
 */
@Injectable()
export class AwsElevenlabsService {
  private readonly mockMode: boolean;
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor() {
    this.mockMode = !process.env.ELEVENLABS_API_KEY;
    this.apiKey = process.env.ELEVENLABS_API_KEY || 'mock-key';
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  /**
   * Convertir texto a audio usando ElevenLabs
   */
  async textToSpeech(
    text: string,
    voiceId: string = 'pNInz6obpgDQGcFmaJgB', // Adam voice
    options: {
      stability?: number;
      similarityBoost?: number;
      style?: number;
      useSpeakerBoost?: boolean;
    } = {}
  ): Promise<{
    audioUrl: string;
    duration: number;
    voiceId: string;
    language: string;
  }> {
    if (this.mockMode) {
      return this.mockTextToSpeech(text, voiceId);
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: options.stability || 0.5,
            similarity_boost: options.similarityBoost || 0.5,
            style: options.style || 0.0,
            use_speaker_boost: options.useSpeakerBoost || true,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioUrl = await this.uploadAudioToS3(audioBuffer, voiceId);
      const duration = this.estimateDuration(text);

      return {
        audioUrl,
        duration,
        voiceId,
        language: 'es',
      };
    } catch (error) {
      console.error('Error in ElevenLabs text-to-speech:', error);
      return this.mockTextToSpeech(text, voiceId);
    }
  }

  /**
   * Generar audio del PEI completo
   */
  async generatePeiAudio(peiId: string, peiContent: string): Promise<{
    audioUrl: string;
    duration: number;
    sections: Array<{
      title: string;
      audioUrl: string;
      duration: number;
    }>;
  }> {
    if (this.mockMode) {
      return this.mockGeneratePeiAudio(peiId, peiContent);
    }

    try {
      // Dividir el PEI en secciones para mejor navegación
      const sections = this.splitPeiIntoSections(peiContent);
      const sectionAudios = [];

      for (const section of sections) {
        const audio = await this.textToSpeech(section.content, 'pNInz6obpgDQGcFmaJgB');
        sectionAudios.push({
          title: section.title,
          audioUrl: audio.audioUrl,
          duration: audio.duration,
        });
      }

      // Generar audio completo
      const fullAudio = await this.textToSpeech(peiContent, 'pNInz6obpgDQGcFmaJgB');

      return {
        audioUrl: fullAudio.audioUrl,
        duration: fullAudio.duration,
        sections: sectionAudios,
      };
    } catch (error) {
      console.error('Error generating PEI audio:', error);
      return this.mockGeneratePeiAudio(peiId, peiContent);
    }
  }

  /**
   * Obtener voces disponibles
   */
  async getAvailableVoices(): Promise<Array<{
    voiceId: string;
    name: string;
    language: string;
    gender: string;
    description: string;
  }>> {
    if (this.mockMode) {
      return this.mockGetAvailableVoices();
    }

    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices.map((voice: any) => ({
        voiceId: voice.voice_id,
        name: voice.name,
        language: voice.labels?.language || 'es',
        gender: voice.labels?.gender || 'neutral',
        description: voice.labels?.description || voice.name,
      }));
    } catch (error) {
      console.error('Error getting available voices:', error);
      return this.mockGetAvailableVoices();
    }
  }

  // Métodos mock para desarrollo
  private mockTextToSpeech(text: string, voiceId: string) {
    const duration = this.estimateDuration(text);
    return {
      audioUrl: `https://mock-elevenlabs.s3.amazonaws.com/audio-${Date.now()}.mp3`,
      duration,
      voiceId,
      language: 'es',
    };
  }

  private mockGeneratePeiAudio(peiId: string, peiContent: string) {
    const duration = this.estimateDuration(peiContent);
    return {
      audioUrl: `https://mock-elevenlabs.s3.amazonaws.com/pei-${peiId}.mp3`,
      duration,
      sections: [
        {
          title: 'Resumen Ejecutivo',
          audioUrl: `https://mock-elevenlabs.s3.amazonaws.com/pei-${peiId}-section-1.mp3`,
          duration: Math.floor(duration * 0.3),
        },
        {
          title: 'Objetivos',
          audioUrl: `https://mock-elevenlabs.s3.amazonaws.com/pei-${peiId}-section-2.mp3`,
          duration: Math.floor(duration * 0.4),
        },
        {
          title: 'Adaptaciones',
          audioUrl: `https://mock-elevenlabs.s3.amazonaws.com/pei-${peiId}-section-3.mp3`,
          duration: Math.floor(duration * 0.3),
        },
      ],
    };
  }

  private mockGetAvailableVoices() {
    return [
      {
        voiceId: 'pNInz6obpgDQGcFmaJgB',
        name: 'Adam',
        language: 'es',
        gender: 'male',
        description: 'Voz masculina profesional',
      },
      {
        voiceId: 'EXAVITQu4vr4xnSDxMaL',
        name: 'Bella',
        language: 'es',
        gender: 'female',
        description: 'Voz femenina cálida',
      },
    ];
  }

  private async uploadAudioToS3(audioBuffer: ArrayBuffer, voiceId: string): Promise<string> {
    // Implementar upload a S3
    const key = `audio/elevenlabs-${Date.now()}-${voiceId}.mp3`;
    return `https://neuroplan-audio.s3.amazonaws.com/${key}`;
  }

  private estimateDuration(text: string): number {
    // Estimación: ~150 palabras por minuto
    const words = text.split(' ').length;
    return Math.ceil((words / 150) * 60);
  }

  private splitPeiIntoSections(content: string): Array<{ title: string; content: string }> {
    // Dividir el PEI en secciones lógicas
    const sections = [];
    const lines = content.split('\n');
    let currentSection = { title: 'Resumen', content: '' };

    for (const line of lines) {
      if (line.includes('OBJETIVOS') || line.includes('ADAPTACIONES') || line.includes('EVALUACIÓN')) {
        if (currentSection.content.trim()) {
          sections.push(currentSection);
        }
        currentSection = { title: line.trim(), content: line + '\n' };
      } else {
        currentSection.content += line + '\n';
      }
    }

    if (currentSection.content.trim()) {
      sections.push(currentSection);
    }

    return sections;
  }
}
