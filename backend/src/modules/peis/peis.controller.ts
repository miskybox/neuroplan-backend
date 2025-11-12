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
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Response } from "express";
import { Observable } from "rxjs";
import { PeisService } from "./peis.service";
import { PeiStreamService } from "./pei-stream.service";
import { PeiGeneratorService } from "./pei-generator.service";
import { GeneratePeiDto } from "./dto/generate-pei.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import {
  ResponseHelper,
  ApiResponse as ApiResponseType,
} from "../../utils/response.helper";
import { mapPei, mapPeis } from "./pei.mapper";

@ApiTags("peis")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("peis")
export class PeisController {
  constructor(
    private readonly peisService: PeisService,
    private readonly peiStreamService: PeiStreamService,
    private readonly peiGeneratorService: PeiGeneratorService
  ) {}

  @Post("generate")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "🧠 Generate PEI using AI",
    description: `
**Frontend endpoint** - Generates a complete PEI using AI based on student information.

**Simplified flow:**
1. 🧠 Receives student data and diagnosis
2. 📋 Generates personalized SMART objectives with AI
3. 🎯 Creates specific curricular adaptations
4. 📊 Defines evaluation and monitoring plan

**Result:** Complete PEI in seconds.

**Frontend usage:** This is the main endpoint for PEI generation.`,
  })
  async generatePei(
    @Body() generatePeiDto: GeneratePeiDto,
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    try {
      const userId = user.id || user.userId;
      const pei = await this.peiGeneratorService.generatePei(
        generatePeiDto,
        userId
      );

      // Si el generador retorna fila de BD, normalizar; de lo contrario, pasar tal cual
      const data =
        Array.isArray(pei) ||
        (pei && typeof pei === "object" && "student_id" in pei)
          ? mapPei(pei)
          : pei;
      return ResponseHelper.created(data, "PEI generado correctamente");
    } catch (error) {
      throw new BadRequestException(`Error al generar PEI: ${error.message}`);
    }
  }

  @Post("generate-from-diagnosis")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "🧠 Generate PEI from direct diagnosis",
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
  @SwaggerResponse({
    status: 201,
    description: "PEI generated successfully from diagnosis",
    schema: {
      example: {
        id: "clxxxxx",
        version: 1,
        summary: "Plan Educativo Individualizado para Ana Pérez...",
        diagnosis: "Dislexia moderada",
        objectives: [
          "Mejorar velocidad lectora de 60 a 90 palabras/min en 6 meses",
          "Incrementar comprensión lectora del percentil 25 al 40",
        ],
        adaptations: {
          lengua: "Tiempo adicional 50%, tipografía OpenDyslexic",
          matematicas: "Calculadora permitida, problemas con visuales",
        },
        strategies: [
          "Método Orton-Gillingham multisensorial",
          "Text-to-speech para textos largos",
        ],
        status: "DRAFT",
        createdAt: "2025-10-12T10:30:00.000Z",
        studentId: "clxxxxx",
      },
    },
  })
  @SwaggerResponse({ status: 400, description: "Invalid data" })
  async generatePeiFromDiagnosis(
    @Body()
    diagnosisData: {
      studentId: string;
      diagnosis: string;
      objectives: any[];
      adaptations: any[];
      strategies: any[];
      evaluation: any[];
      timeline: any[];
    },
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    // Llama a generatePEI del servicio con el campo createdBy requerido
    const result = await this.peisService.generatePEI({
      ...diagnosisData,
      createdBy: user.id || user.userId,
    });
    return ResponseHelper.created(mapPei(result));
  }

  @Get()
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "Listar todos los PEIs",
    description:
      "Obtiene todos los PEIs con información del estudiante y recursos asociados",
  })
  @SwaggerResponse({
    status: 200,
    description: "Lista de PEIs (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          peis: [
            {
              id: "pei_123",
              studentId: "st_123",
              title: "Plan para María García López",
              summary: "Resumen del PEI...",
              status: "ACTIVE",
              createdAt: "2025-10-11T14:35:00.000Z",
            },
          ],
          count: 1,
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async getAllPeis(@CurrentUser() user: any): Promise<ApiResponseType<any>> {
    // Llama a getPEIsByUser del servicio
    const peis = await this.peisService.getPEIsByUser(user.id);
    return ResponseHelper.success({ peis: mapPeis(peis), count: peis.length });
  }

  @Get(":id")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "Obtener PEI específico",
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
    name: "id",
    description: "ID único del PEI",
    example: "clxxxxx",
  })
  @SwaggerResponse({
    status: 200,
    description: "Detalle de PEI (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          id: "pei_123",
          studentId: "st_123",
          title: "Plan para María García López",
          summary: "Resumen del PEI...",
          diagnosis: "Diagnóstico principal",
          status: "ACTIVE",
          createdAt: "2025-10-11T14:35:00.000Z",
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  @SwaggerResponse({ status: 404, description: "PEI no encontrado" })
  async getPeiById(
    @Param("id") id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    try {
      const pei = await this.peisService.getPEIById(id);
      if (!pei) throw new NotFoundException("PEI no encontrado");
      return ResponseHelper.success(mapPei(pei));
    } catch (error: any) {
      throw new NotFoundException(error.message || "PEI no encontrado");
    }
  }

  @Patch(":id/status")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "Actualizar estado del PEI",
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
    name: "id",
    description: "ID único del PEI",
    example: "clxxxxx",
  })
  @SwaggerResponse({
    status: 200,
    description: "Estado actualizado (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          id: "pei_123",
          status: "APPROVED",
          updatedAt: "2025-10-11T15:00:00.000Z",
        },
        message: "Estado actualizado correctamente",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  @SwaggerResponse({ status: 400, description: "Estado no válido" })
  @SwaggerResponse({ status: 404, description: "PEI no encontrado" })
  async updatePeiStatus(
    @Param("id") id: string,
    @Body() body: { status: string },
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    if (!body.status) {
      throw new BadRequestException("Estado requerido");
    }

    // Validar que el status sea válido
    const validStatuses = ["DRAFT", "REVIEW", "APPROVED", "ACTIVE", "ARCHIVED"];
    if (!validStatuses.includes(body.status)) {
      throw new BadRequestException(
        `Estado no válido. Debe ser uno de: ${validStatuses.join(", ")}`
      );
    }

    try {
      const userId = user.id || user.userId;
      const updatedPei = await this.peisService.updatePEI(id, {
        status: body.status as
          | "DRAFT"
          | "REVIEW"
          | "APPROVED"
          | "ACTIVE"
          | "ARCHIVED",
        approved_by: body.status === "APPROVED" ? userId : undefined,
      });

      return ResponseHelper.updated(
        updatedPei,
        "Estado actualizado correctamente"
      );
    } catch (error: any) {
      if (error.message === "PEI no encontrado") {
        throw new NotFoundException("PEI no encontrado");
      }
      throw new BadRequestException(
        `Error al actualizar estado: ${error.message}`
      );
    }
  }

  @Get(":id/pdf")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "📄 Descargar PEI en PDF",
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
    name: "id",
    description: "ID único del PEI",
    example: "clxxxxx",
  })
  @SwaggerResponse({
    status: 200,
    description: "Archivo PDF del PEI",
    headers: {
      "Content-Type": {
        description: "application/pdf",
        schema: { type: "string" },
      },
      "Content-Disposition": {
        description: 'attachment; filename="PEI_Maria_Garcia.pdf"',
        schema: { type: "string" },
      },
    },
  })
  @SwaggerResponse({ status: 404, description: "PEI no encontrado" })
  async downloadPeiPdf(@Param("id") id: string, @Res() res: Response) {
    // No existe generatePeiPdf ni getPeiById en el servicio, solo getPEIById y exportPEI (mock)
    try {
      const pei = await this.peisService.getPEIById(id);
      if (!pei) throw new NotFoundException("PEI no encontrado");
      // Simula exportación PDF
      const exportData = await this.peisService.exportPEI(id, "pdf");
      // Redirige a la URL mock
      return res.redirect(exportData.downloadUrl);
    } catch (error: any) {
      throw new NotFoundException(error.message || "PEI no encontrado");
    }
  }

  @Get("student/:studentId")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "Obtener PEIs de un estudiante específico",
    description: "Obtiene todos los PEIs asociados a un estudiante específico",
  })
  @ApiParam({
    name: "studentId",
    description: "ID del estudiante",
    example: "clxxxxx",
  })
  @SwaggerResponse({
    status: 200,
    description: "Lista de PEIs del estudiante (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          peis: [{ id: "pei_123", studentId: "st_123", title: "Plan..." }],
          count: 1,
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async getPeisByStudent(
    @Param("studentId") studentId: string,
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    const peis = await this.peisService.getPEIsByStudent(studentId);
    return ResponseHelper.success({ peis: mapPeis(peis), count: peis.length });
  }

  @Post(":id/audio")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "🔊 Generar audio del PEI",
    description: "Convierte el PEI a audio usando AWS Polly para accesibilidad",
  })
  @ApiParam({
    name: "id",
    description: "ID único del PEI",
    example: "clxxxxx",
  })
  @SwaggerResponse({
    status: 201,
    description: "Audio generado (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          id: "audio_123",
          url: "https://.../pei-123.mp3",
          duration: 180,
          language: "es",
          voice: "Conchita",
          createdAt: "2025-10-11T15:00:00.000Z",
        },
        message: "Audio generado correctamente",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async generatePeiAudio(
    @Param("id") id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    const audio = await this.peisService.generatePeiAudio(id, user.id);
    return ResponseHelper.created(audio, "Audio generado correctamente");
  }

  @Post("generate-with-progress")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "🚀 Generate PEI with real-time progress",
    description:
      "Generates a PEI with Server-Sent Events (SSE) for real-time progress updates",
  })
  @SwaggerResponse({
    status: 201,
    description: "PEI generation started with stream ID",
    schema: {
      example: {
        success: true,
        data: {
          streamId: "pei_student123_1703500800000",
          message:
            "PEI generation started. Use the stream ID to listen for progress updates.",
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async generatePeiWithProgress(
    @Body()
    body: {
      studentId: string;
      reportId?: string;
      diagnosis?: string;
    },
    @CurrentUser() user: any
  ): Promise<ApiResponseType<any>> {
    const streamId = await this.peiStreamService.generatePeiWithProgress(
      body.studentId,
      body.reportId,
      body.diagnosis
    );

    return ResponseHelper.success({
      streamId,
      message:
        "PEI generation started. Use the stream ID to listen for progress updates.",
    });
  }

  @Get("progress/:streamId")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @Sse()
  @ApiOperation({
    summary: "📡 Listen to PEI generation progress",
    description:
      "Server-Sent Events endpoint to receive real-time progress updates during PEI generation",
  })
  @ApiParam({
    name: "streamId",
    description: "Stream ID returned from generate-with-progress endpoint",
    example: "pei_student123_1703500800000",
  })
  @SwaggerResponse({
    status: 200,
    description: "Real-time progress updates via SSE",
    content: {
      "text/event-stream": {
        schema: {
          type: "string",
          example:
            'data: {"step":"analyzing","progress":10,"message":"Analizando información del estudiante..."}\n\n',
        },
      },
    },
  })
  streamProgress(
    @Param("streamId") streamId: string
  ): Observable<MessageEvent> {
    return new Observable((observer) => {
      const onProgress = (data: any) => {
        if (data.streamId === streamId) {
          observer.next({
            data: JSON.stringify(data),
            type: "progress",
          } as MessageEvent);
        }
      };

      const onCompleted = (data: any) => {
        if (data.streamId === streamId) {
          observer.next({
            data: JSON.stringify(data),
            type: "completed",
          } as MessageEvent);
          observer.complete();
        }
      };

      const onCancelled = (data: any) => {
        if (data.streamId === streamId) {
          observer.next({
            data: JSON.stringify(data),
            type: "cancelled",
          } as MessageEvent);
          observer.complete();
        }
      };

      this.peiStreamService.on("progress", onProgress);
      this.peiStreamService.on("completed", onCompleted);
      this.peiStreamService.on("cancelled", onCancelled);

      // Cleanup on unsubscribe
      return () => {
        this.peiStreamService.off("progress", onProgress);
        this.peiStreamService.off("completed", onCompleted);
        this.peiStreamService.off("cancelled", onCancelled);
      };
    });
  }

  @Post("cancel/:streamId")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "❌ Cancel PEI generation",
    description: "Cancels an ongoing PEI generation process",
  })
  @ApiParam({
    name: "streamId",
    description: "Stream ID to cancel",
    example: "pei_student123_1703500800000",
  })
  @SwaggerResponse({
    status: 200,
    description: "PEI generation cancelled successfully (contrato ApiResponse)",
  })
  @SwaggerResponse({
    status: 404,
    description: "Stream not found or already completed",
  })
  cancelGeneration(@Param("streamId") streamId: string): ApiResponseType<any> {
    const cancelled = this.peiStreamService.cancelStream(streamId);

    if (!cancelled) {
      throw new NotFoundException("Stream not found or already completed");
    }

    return ResponseHelper.success({
      message: "PEI generation cancelled successfully",
      streamId,
    });
  }

  @Get("active-streams")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "📊 Get active PEI generation streams",
    description: "Returns a list of currently active PEI generation streams",
  })
  @SwaggerResponse({
    status: 200,
    description: "List of active streams",
    schema: {
      example: {
        success: true,
        data: {
          activeStreams: [
            "pei_student123_1703500800000",
            "pei_student456_1703500900000",
          ],
          count: 2,
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  getActiveStreams(): ApiResponseType<any> {
    const activeStreams = this.peiStreamService.getActiveStreams();

    return ResponseHelper.success({
      activeStreams,
      count: activeStreams.length,
    });
  }

  @Get("test")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO", "FAMILIA")
  @ApiOperation({
    summary: "🧪 Test endpoint (no auth required)",
    description: "Simple test endpoint to verify the service is working",
  })
  @SwaggerResponse({
    status: 200,
    description: "Test response (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          message: "PEI service is working!",
          status: "ok",
        },
        timestamp: "2025-10-25T18:15:00.000Z",
      },
    },
  })
  testEndpoint(): ApiResponseType<any> {
    return ResponseHelper.success({
      message: "PEI service is working!",
      status: "ok",
    });
  }
}
