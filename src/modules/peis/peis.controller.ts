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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Response } from 'express';
import { PeisService } from './peis.service';
import { GeneratePeiFromReportDto } from './dto/create-pei.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('peis')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/peis')
export class PeisController {
  constructor(private readonly peisService: PeisService) {}

  @Post('generate-from-diagnosis')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '🧠 Generar PEI desde diagnóstico directo',
    description: `
**Endpoint para el frontend** - Genera un PEI completo desde un diagnóstico directo sin necesidad de subir informe.

**Flujo simplificado:**
1. 🧠 Recibe datos del diagnóstico directamente
2. 📋 Genera objetivos SMART personalizados con Claude AI
3. 🎯 Crea adaptaciones curriculares específicas
4. 📊 Define plan de evaluación y seguimiento

**Resultado:** PEI completo en segundos.

**Uso desde frontend:** Este es el endpoint que necesitas para la demo.
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'PEI generado correctamente desde diagnóstico',
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
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async generatePeiFromDiagnosis(
    @Body() diagnosisData: {
      studentId: string;
      diagnosis: string[];
      symptoms?: string[];
      strengths?: string[];
      additionalNotes?: string;
    },
    @CurrentUser() user: any,
  ) {
    return this.peisService.generatePeiFromDiagnosis(diagnosisData, user.id);
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
    return this.peisService.generatePeiFromReport(generatePeiDto, user.id);
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
    return this.peisService.getAllPeis(user.id, user.rol);
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
      return await this.peisService.getPeiById(id, user.id, user.rol);
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

    return this.peisService.updatePeiStatus(id, body.status);
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
    try {
      const pei = await this.peisService.getPeiById(id);
      const pdfBuffer = await this.peisService.generatePeiPdf(id);

      const filename = `PEI_${pei.student?.nombre || 'estudiante'}_${pei.student?.apellidos || ''}_v${pei.version}.pdf`
        .replaceAll(/\s+/g, '_')
        .replaceAll(/[^a-zA-Z0-9._-]/g, '');

      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      });

      res.send(pdfBuffer);
    } catch (error: any) {
      throw new NotFoundException(error.message || 'PEI no encontrado');
    }
  }
}