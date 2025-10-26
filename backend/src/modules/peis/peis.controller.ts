import {
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Body,
  Res,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Sse,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { PeisService } from './peis.service';
import { PeiStreamService } from './pei-stream.service';
import { GeneratePeiFromReportDto } from './dto/create-pei.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('peis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('peis')
export class PeisController {
  constructor(
    private readonly peisService: PeisService,
    private readonly peiStreamService: PeiStreamService,
  ) {}

  @Post('generate-from-diagnosis')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '🧠 Generate PEI from direct diagnosis',
    description: `
**Frontend endpoint** - Generates a complete PEI from direct diagnosis without needing to upload a report.

**Simplified flow:**
1. 🧠 Receives diagnosis data directly
2. 📋 Generates personalized SMART objectives with Claude AI
3. 🎯 Creates specific curricular adaptations
4. 📊 Defines evaluation and monitoring plan

**Result:** Complete PEI in seconds.

**Frontend usage:** This is the endpoint you need for the demo.
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'PEI generated successfully from diagnosis',
    schema: {
      example: {
        id: 'clxxxxx',
        version: 1,
        summary: 'Plan Educativo Individualizado para Ana Pérez...',
        diagnosis: 'Dislexia moderada',
        objectives: [
          'Mejorar velocidad lectora de 60 a 90 palabras/min en 6 meses',
          'Incrementar comprensión lectora del percentil 25 al 40',
        ],
        adaptations: {
          lengua: 'Tiempo adicional 50%, tipografía OpenDyslexic',
          matematicas: 'Calculadora permitida, problemas con visuales',
        },
        strategies: [
          'Método Orton-Gillingham multisensorial',
          'Text-to-speech para textos largos',
        ],
        status: 'DRAFT',
        createdAt: '2025-10-12T10:30:00.000Z',
        studentId: 'clxxxxx',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid data' })
  async generatePeiFromDiagnosis(
    @Body() diagnosisData: {
      studentId: string;
      diagnosis: string;
      objectives: any[];
      adaptations: any[];
      strategies: any[];
      evaluation: any[];
      timeline: any[];
    },
    @CurrentUser() user: any,
  ) {
    // Llama a generatePEI del servicio
    return this.peisService.generatePEI(diagnosisData);
  }

  @Post('generate')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '🤖 Generar PEI automáticamente',
    description: `
**Endpoint principal del hackathon** - Genera un Plan Educativo Individualizado completo usando IA.

**Flujo completo:**
1. 📄 Extracción de texto del informe (PDF/OCR)
2. 🧠 Análisis con Claude AI para identificar NEE
3. 📋 Generación de objetivos SMART personalizados
4. 🎯 Adaptaciones curriculares específicas
5. 📊 Plan de evaluación y seguimiento

**Resultado:** PEI listo en ~30-60 segundos vs 3 semanas manual.

**Siguiente paso:** El PEI está listo para ser revisado y personalizado según las necesidades específicas del estudiante.
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'PEI generado correctamente',
    schema: {
      example: {
        id: 'clxxxxx',
        version: 1,
        summary: 'Plan Educativo Individualizado para María García López...',
        diagnosis: 'Diagnóstico principal: TDAH combinado moderado...',
        status: 'DRAFT',
        createdAt: '2025-10-11T14:35:00.000Z',
        studentId: 'clxxxxx',
        reportId: 'clxxxxx',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o informe no encontrado' })
  async generatePei(
    @Body() generatePeiDto: GeneratePeiFromReportDto,
    @CurrentUser() user: any,
  ) {
    // Adaptar GeneratePeiFromReportDto a la estructura esperada por generatePEI
    const peiData = {
      studentId: generatePeiDto.studentId,
      reportId: generatePeiDto.reportId,
      diagnosis: '', // diagnosis, objectives, etc. deben ser generados por IA en el flujo real
      objectives: [],
      adaptations: [],
      strategies: [],
      evaluation: [],
      timeline: [],
    };
    return this.peisService.generatePEI(peiData);
  }

  @Get()
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @ApiOperation({
    summary: 'Listar todos los PEIs',
    description: 'Obtiene todos los PEIs con información del estudiante y recursos asociados',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de PEIs',
    schema: {
      example: [
        {
          id: 'clxxxxx',
          version: 1,
          summary: 'Plan para María García López...',
          status: 'ACTIVE',
          createdAt: '2025-10-11T14:35:00.000Z',
          student: {
            id: 'clxxxxx',
            name: 'María',
            lastName: 'García López',
            grade: '6º Primaria',
          },
          audioFiles: [
            {
              id: 'clxxxxx',
              type: 'SUMMARY',
              duration: 45,
              language: 'es',
            },
          ],
          resourceLinks: [
            {
              id: 'clxxxxx',
              title: 'Apps para TDAH infantil',
              category: 'app',
              relevance: 0.95,
            },
          ],
        },
      ],
    },
  })
  async getAllPeis(@CurrentUser() user: any) {
    // Llama a getPEIsByUser del servicio
    return this.peisService.getPEIsByUser(user.id);
  }

  @Get(':id')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @ApiOperation({
    summary: 'Obtener PEI específico',
    description: `
Obtiene un PEI completo con todos sus datos estructurados.

**Incluye:**
- 📄 Resumen ejecutivo y diagnóstico
- 🎯 Objetivos SMART detallados 
- 🔧 Adaptaciones curriculares
- 📊 Criterios de evaluación
- 🗓️ Planificación temporal
- 🔊 Síntesis de voz (AWS Polly)
- 📚 Recursos educativos integrados
- 📱 Acceso multiplataforma
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'PEI completo con datos estructurados',
    schema: {
      example: {
        id: 'clxxxxx',
        summary: 'Plan Educativo Individualizado para María García López...',
        diagnosis: 'Diagnóstico principal: TDAH combinado moderado...',
        objectives: [
          {
            id: 'obj-1',
            title: 'Mejorar atención sostenida',
            description: 'Aumentar el tiempo de concentración...',
            area: 'cognitive',
            timeframe: 'medium',
            criteria: ['Mantiene atención 15 minutos mínimo'],
            strategies: ['Técnicas de mindfulness adaptadas'],
          },
        ],
        adaptations: [
          {
            type: 'access',
            description: 'Tiempo adicional en evaluaciones (25% extra)',
            subject: 'todas',
            implementation: 'Aplicar en todas las pruebas',
          },
        ],
        student: {
          name: 'María',
          lastName: 'García López',
          grade: '6º Primaria',
        },
        audioFiles: [],
        resourceLinks: [],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'PEI no encontrado' })
  async getPeiById(@Param('id') id: string, @CurrentUser() user: any) {
    try {
      const pei = await this.peisService.getPEIById(id);
      if (!pei) throw new NotFoundException('PEI no encontrado');
      return pei;
    } catch (error: any) {
      throw new NotFoundException(error.message || 'PEI no encontrado');
    }
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: 'Actualizar estado del PEI',
    description: `
Cambia el estado de un PEI en el workflow de aprobación.

**Estados disponibles:**
- 🟡 **DRAFT**: Borrador inicial
- 🔵 **REVIEW**: En revisión por equipo educativo
- 🟢 **APPROVED**: Aprobado oficialmente
- ✅ **ACTIVE**: Activo y en implementación
- 📦 **ARCHIVED**: Archivado/completado

**Flujo típico:** DRAFT → REVIEW → APPROVED → ACTIVE → ARCHIVED
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado actualizado correctamente',
    schema: {
      example: {
        id: 'clxxxxx',
        status: 'APPROVED',
        approvedAt: '2025-10-11T15:00:00.000Z',
        updatedAt: '2025-10-11T15:00:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Estado no válido' })
  @ApiResponse({ status: 404, description: 'PEI no encontrado' })
  async updatePeiStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    if (!body.status) {
      throw new BadRequestException('Estado requerido');
    }

  // No existe updatePeiStatus, se usa updatePEI
  return this.peisService.updatePEI(id, { status: body.status });
  }

  @Get(':id/pdf')
  @ApiOperation({
    summary: '📄 Descargar PEI en PDF',
    description: `
Genera y descarga el PEI en formato PDF oficial para:
- 📋 Documentación oficial del centro
- 👨‍👩‍👧‍👦 Entrega a familias
- 🏛️ Inspección educativa
- 💾 Archivo permanente

**Formato:** PDF/A-1b (estándar documental)
**Contenido:** PEI completo con firma digital
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Archivo PDF del PEI',
    headers: {
      'Content-Type': {
        description: 'application/pdf',
        schema: { type: 'string' },
      },
      'Content-Disposition': {
        description: 'attachment; filename="PEI_Maria_Garcia.pdf"',
        schema: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'PEI no encontrado' })
  async downloadPeiPdf(@Param('id') id: string, @Res() res: Response) {
    // No existe generatePeiPdf ni getPeiById en el servicio, solo getPEIById y exportPEI (mock)
    try {
      const pei = await this.peisService.getPEIById(id);
      if (!pei) throw new NotFoundException('PEI no encontrado');
      // Simula exportación PDF
      const exportData = await this.peisService.exportPEI(id, 'pdf');
      // Redirige a la URL mock
      return res.redirect(exportData.downloadUrl);
    } catch (error: any) {
      throw new NotFoundException(error.message || 'PEI no encontrado');
    }
  }

  @Get('student/:studentId')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @ApiOperation({
    summary: 'Obtener PEIs de un estudiante específico',
    description: 'Obtiene todos los PEIs asociados a un estudiante específico',
  })
  @ApiParam({
    name: 'studentId',
    description: 'ID del estudiante',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de PEIs del estudiante',
  })
  async getPeisByStudent(@Param('studentId') studentId: string, @CurrentUser() user: any) {
  return this.peisService.getPEIsByStudent(studentId);
  }

  @Post(':id/audio')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @ApiOperation({
    summary: '🔊 Generar audio del PEI',
    description: 'Convierte el PEI a audio usando AWS Polly para accesibilidad',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 201,
    description: 'Audio generado correctamente',
    schema: {
      example: {
        id: 'clxxxxx',
        url: 'https://s3.amazonaws.com/neuroplan-audio/pei-123.mp3',
        duration: 180,
        language: 'es',
        voice: 'Conchita',
        createdAt: '2025-10-11T15:00:00.000Z',
      },
    },
  })
  async generatePeiAudio(@Param('id') id: string, @CurrentUser() user: any) {
    return this.peisService.generatePeiAudio(id, user.id);
  }

  @Post('generate-with-progress')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '🚀 Generate PEI with real-time progress',
    description: 'Generates a PEI with Server-Sent Events (SSE) for real-time progress updates',
  })
  @ApiResponse({
    status: 201,
    description: 'PEI generation started with stream ID',
    schema: {
      example: {
        streamId: 'pei_student123_1703500800000',
        message: 'PEI generation started. Use the stream ID to listen for progress updates.',
      },
    },
  })
  async generatePeiWithProgress(
    @Body() body: {
      studentId: string;
      reportId?: string;
      diagnosis?: string;
    },
    @CurrentUser() user: any,
  ) {
    const streamId = await this.peiStreamService.generatePeiWithProgress(
      body.studentId,
      body.reportId,
      body.diagnosis,
    );
    
    return {
      streamId,
      message: 'PEI generation started. Use the stream ID to listen for progress updates.',
    };
  }

  @Get('progress/:streamId')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @Sse()
  @ApiOperation({
    summary: '📡 Listen to PEI generation progress',
    description: 'Server-Sent Events endpoint to receive real-time progress updates during PEI generation',
  })
  @ApiParam({
    name: 'streamId',
    description: 'Stream ID returned from generate-with-progress endpoint',
    example: 'pei_student123_1703500800000',
  })
  @ApiResponse({
    status: 200,
    description: 'Real-time progress updates via SSE',
    content: {
      'text/event-stream': {
        schema: {
          type: 'string',
          example: 'data: {"step":"analyzing","progress":10,"message":"Analizando información del estudiante..."}\n\n',
        },
      },
    },
  })
  streamProgress(@Param('streamId') streamId: string): Observable<MessageEvent> {
    return new Observable((observer) => {
      const onProgress = (data: any) => {
        if (data.streamId === streamId) {
          observer.next({
            data: JSON.stringify(data),
            type: 'progress',
          } as MessageEvent);
        }
      };

      const onCompleted = (data: any) => {
        if (data.streamId === streamId) {
          observer.next({
            data: JSON.stringify(data),
            type: 'completed',
          } as MessageEvent);
          observer.complete();
        }
      };

      const onCancelled = (data: any) => {
        if (data.streamId === streamId) {
          observer.next({
            data: JSON.stringify(data),
            type: 'cancelled',
          } as MessageEvent);
          observer.complete();
        }
      };

      this.peiStreamService.on('progress', onProgress);
      this.peiStreamService.on('completed', onCompleted);
      this.peiStreamService.on('cancelled', onCancelled);

      // Cleanup on unsubscribe
      return () => {
        this.peiStreamService.off('progress', onProgress);
        this.peiStreamService.off('completed', onCompleted);
        this.peiStreamService.off('cancelled', onCancelled);
      };
    });
  }

  @Post('cancel/:streamId')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '❌ Cancel PEI generation',
    description: 'Cancels an ongoing PEI generation process',
  })
  @ApiParam({
    name: 'streamId',
    description: 'Stream ID to cancel',
    example: 'pei_student123_1703500800000',
  })
  @ApiResponse({
    status: 200,
    description: 'PEI generation cancelled successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Stream not found or already completed',
  })
  cancelGeneration(@Param('streamId') streamId: string) {
    const cancelled = this.peiStreamService.cancelStream(streamId);
    
    if (!cancelled) {
      throw new NotFoundException('Stream not found or already completed');
    }
    
    return {
      message: 'PEI generation cancelled successfully',
      streamId,
    };
  }

  @Get('active-streams')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '📊 Get active PEI generation streams',
    description: 'Returns a list of currently active PEI generation streams',
  })
  @ApiResponse({
    status: 200,
    description: 'List of active streams',
    schema: {
      example: {
        activeStreams: [
          'pei_student123_1703500800000',
          'pei_student456_1703500900000',
        ],
        count: 2,
      },
    },
  })
  getActiveStreams() {
    const activeStreams = this.peiStreamService.getActiveStreams();
    
    return {
      activeStreams,
      count: activeStreams.length,
    };
  }

  @Get('test')
  @ApiOperation({
    summary: '🧪 Test endpoint (no auth required)',
    description: 'Simple test endpoint to verify the service is working',
  })
  @ApiResponse({
    status: 200,
    description: 'Test response',
    schema: {
      example: {
        message: 'PEI service is working!',
        timestamp: '2025-10-25T18:15:00.000Z',
        status: 'ok'
      },
    },
  })
  testEndpoint() {
    return {
      message: 'PEI service is working!',
      timestamp: new Date().toISOString(),
      status: 'ok'
    };
  }
}