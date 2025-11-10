import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
  ApiResponse as SwaggerResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import {
  ResponseHelper,
  ApiResponse as ApiResponseType,
} from "../../utils/response.helper";
import { VideosService } from "./videos.service";

export interface VideoFilters {
  subject?: string;
  level?: string;
  search?: string;
}

@ApiTags("videos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("videos")
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  @ApiOperation({
    summary: "Listar videos educativos",
    description:
      "Obtiene lista de videos con filtros opcionales (subject, level, search)",
  })
  @ApiQuery({
    name: "subject",
    required: false,
    description: "Filtrar por materia (Matemáticas, Historia, etc.)",
  })
  @ApiQuery({
    name: "level",
    required: false,
    description: "Filtrar por nivel (ESO, Bachillerato, etc.)",
  })
  @ApiQuery({
    name: "search",
    required: false,
    description: "Búsqueda por título, descripción o tags",
  })
  @SwaggerResponse({
    status: 200,
    description: "Lista de videos (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: [
          {
            id: "1",
            title: "Introducción a las Ecuaciones de Segundo Grado",
            description:
              "Aprende los conceptos básicos de las ecuaciones cuadráticas con ejemplos prácticos",
            url: "https://example.com/video1.mp4",
            thumbnail:
              "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Matemáticas",
            duration: 1200,
            subject: "Matemáticas",
            level: "ESO",
            year: "3º ESO",
            progress: 75,
            views: 1250,
            likes: 89,
            rating: 4.8,
            subtitles: true,
            transcript:
              "En este video aprenderemos los conceptos básicos del álgebra...",
            tags: ["ecuaciones", "álgebra", "matemáticas", "segundo grado"],
            createdAt: "2024-01-15T00:00:00.000Z",
            instructor: "Prof. Ana Martínez",
          },
        ],
        message: "1 videos encontrados",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async getVideos(
    @Query("subject") subject?: string,
    @Query("level") level?: string,
    @Query("search") search?: string
  ): Promise<ApiResponseType<any[]>> {
    const filters: VideoFilters = { subject, level, search };
    const videos = await this.videosService.getVideos(filters);
    return ResponseHelper.success(
      videos,
      `${videos.length} videos encontrados`
    );
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obtener video por ID",
    description: "Obtiene detalles completos de un video específico",
  })
  @ApiParam({ name: "id", description: "ID del video", example: "123" })
  @SwaggerResponse({
    status: 200,
    description: "Detalle de video (contrato ApiResponse)",
    schema: {
      example: {
        success: true,
        data: {
          id: "1",
          title: "Introducción a las Ecuaciones de Segundo Grado",
          description:
            "Aprende los conceptos básicos de las ecuaciones cuadráticas con ejemplos prácticos",
          url: "https://example.com/video1.mp4",
          thumbnail:
            "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Matemáticas",
          duration: 1200,
          subject: "Matemáticas",
          level: "ESO",
          year: "3º ESO",
          progress: 75,
          views: 1250,
          likes: 89,
          rating: 4.8,
          subtitles: true,
          transcript:
            "En este video aprenderemos los conceptos básicos del álgebra...",
          tags: ["ecuaciones", "álgebra", "matemáticas", "segundo grado"],
          createdAt: "2024-01-15T00:00:00.000Z",
          instructor: "Prof. Ana Martínez",
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  @SwaggerResponse({
    status: 404,
    description: "Video no encontrado",
    schema: {
      example: {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: "Video no encontrado",
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async getVideoById(@Param("id") id: string): Promise<ApiResponseType<any>> {
    const video = await this.videosService.getVideoById(id);
    if (!video) {
      return ResponseHelper.notFound("Video no encontrado");
    }
    return ResponseHelper.success(video);
  }
}
