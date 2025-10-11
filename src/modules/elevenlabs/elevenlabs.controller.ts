import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Res,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Response } from 'express';
import { ElevenLabsService } from './elevenlabs.service';
import { TextToSpeechDto, PeiAudioRequest } from './dto/elevenlabs.dto';

@ApiTags('elevenlabs')
@Controller('api/elevenlabs')
export class ElevenLabsController {
  constructor(private readonly elevenLabsService: ElevenLabsService) {}

  @Post('text-to-speech')
  @ApiOperation({
    summary: '🔊 Convertir texto a audio',
    description: `
**Premio ElevenLabs ($2000)** - Convierte cualquier texto a audio natural en español.

**Características:**
- 🎭 Múltiples voces disponibles
- 🌍 Soporte multiidioma (ES, EN, CA)
- 🎛️ Control de calidad y estilo
- ⚡ Respuesta en tiempo real

**Casos de uso:**
- Resúmenes de PEIs para familias
- Instrucciones accesibles para estudiantes
- Contenido educativo inclusivo
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'Audio generado correctamente',
    headers: {
      'Content-Type': {
        description: 'audio/mpeg',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Texto inválido o demasiado largo' })
  async textToSpeech(@Body() dto: TextToSpeechDto, @Res() res: Response) {
    if (!dto.text || dto.text.trim().length === 0) {
      throw new BadRequestException('Texto requerido');
    }

    if (dto.text.length > 5000) {
      throw new BadRequestException('Texto demasiado largo (máximo 5000 caracteres)');
    }

    try {
      const audioBuffer = await this.elevenLabsService.textToSpeech(dto);

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      });

      res.send(audioBuffer);
    } catch (error: any) {
      throw new BadRequestException(error.message || 'Error generando audio');
    }
  }

  @Post('pei/:id/audio')
  @ApiOperation({
    summary: '🧠 Generar audio de PEI',
    description: `
**Funcionalidad estrella** - Convierte PEIs completos a audio accesible.

**Tipos disponibles:**
- 📄 **SUMMARY**: Resumen ejecutivo del PEI (2-3 minutos)
- 🎯 **OBJECTIVES**: Solo objetivos específicos (1-2 minutos)
- 📚 **FULL**: PEI completo narrado (5-10 minutos)
- ✏️ **CUSTOM**: Texto personalizado

**Beneficios:**
- ♿ Accesibilidad total para familias
- 🚗 Escucha durante desplazamientos
- 👂 Mejor comprensión auditiva
- 🎧 Experiencia multimedia completa
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 201,
    description: 'Audio del PEI generado correctamente',
    schema: {
      example: {
        id: 'clxxxxx',
        filename: 'pei_clxxxxx_summary_1697028123456.mp3',
        type: 'SUMMARY',
        duration: 125,
        size: 2048576,
        language: 'es',
        voiceId: '21m00Tcm4TlvDq8ikWAM',
        createdAt: '2025-10-11T14:45:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'PEI no encontrado' })
  async generatePeiAudio(
    @Param('id') peiId: string,
    @Body() request: PeiAudioRequest,
  ) {
    return this.elevenLabsService.generatePeiAudio(peiId, request);
  }

  @Get('pei/:id/summary-audio')
  @ApiOperation({
    summary: '🎧 Obtener audio resumen de PEI',
    description: `
**Endpoint para frontend** - Obtiene directamente el audio del resumen del PEI.

Genera automáticamente si no existe, o devuelve el existente.
Perfecto para el botón "🔊 Escuchar Resumen" en la interfaz.

**Duración típica:** 2-3 minutos
**Formato:** MP3, 128kbps
**Idioma:** Español natural
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Audio del resumen del PEI',
    headers: {
      'Content-Type': {
        description: 'audio/mpeg',
        schema: { type: 'string' },
      },
      'Content-Disposition': {
        description: 'inline; filename="resumen_pei.mp3"',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'PEI no encontrado' })
  async getPeiSummaryAudio(@Param('id') peiId: string, @Res() res: Response) {
    try {
      const audioBuffer = await this.elevenLabsService.getPeiSummaryAudio(peiId);
      
      if (!audioBuffer) {
        throw new NotFoundException('Audio no disponible');
      }

      res.set({
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'inline; filename="resumen_pei.mp3"',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600',
      });

      res.send(audioBuffer);
    } catch (error: any) {
      throw new NotFoundException(error.message || 'Audio no encontrado');
    }
  }

  @Get('pei/:id/audios')
  @ApiOperation({
    summary: '📂 Listar audios de PEI',
    description: `
Obtiene todos los archivos de audio generados para un PEI específico.

**Información incluida:**
- Tipo de audio (SUMMARY, OBJECTIVES, FULL, CUSTOM)
- Duración en segundos
- Tamaño del archivo
- Fecha de creación
- ID de voz utilizada
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de audios del PEI',
    schema: {
      example: [
        {
          id: 'clxxxxx',
          filename: 'pei_clxxxxx_summary_1697028123456.mp3',
          type: 'SUMMARY',
          duration: 125,
          size: 2048576,
          language: 'es',
          voiceId: '21m00Tcm4TlvDq8ikWAM',
          createdAt: '2025-10-11T14:45:00.000Z',
        },
        {
          id: 'clyyyyy',
          filename: 'pei_clxxxxx_objectives_1697028456789.mp3',
          type: 'OBJECTIVES',
          duration: 85,
          size: 1365432,
          language: 'es',
          voiceId: '21m00Tcm4TlvDq8ikWAM',
          createdAt: '2025-10-11T14:50:00.000Z',
        },
      ],
    },
  })
  async getPeiAudios(@Param('id') peiId: string) {
    return this.elevenLabsService.getPeiAudios(peiId);
  }

  @Get('voices')
  @ApiOperation({
    summary: '🎭 Listar voces disponibles',
    description: `
Obtiene todas las voces disponibles en ElevenLabs para este proyecto.

**Incluye:**
- ID único de cada voz
- Nombre y descripción
- Idiomas soportados
- Características (género, edad, estilo)
- Calidad (premium/standard)
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de voces disponibles',
    schema: {
      example: [
        {
          voice_id: '21m00Tcm4TlvDq8ikWAM',
          name: 'Rachel',
          category: 'premade',
          labels: {
            gender: 'female',
            age: 'young',
            accent: 'american',
          },
          preview_url: 'https://...',
        },
        {
          voice_id: 'AZnzlk1XvdvUeBnXmlld',
          name: 'Domi',
          category: 'premade',
          labels: {
            gender: 'female',
            age: 'young',
            accent: 'american',
          },
          preview_url: 'https://...',
        },
      ],
    },
  })
  async getAvailableVoices() {
    return this.elevenLabsService.getAvailableVoices();
  }
}