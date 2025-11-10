import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse as SwaggerResponse,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { DatabaseService } from "../supabase/database.service";
import { ResponseHelper, ApiResponse } from "../../utils/response.helper";
import { mapStudent, mapStudents } from "./student.mapper";

interface StudentDto {
  id?: string;
  first_name: string;
  last_name: string;
  birth_date?: string;
  grade?: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  school?: string;
  center_id?: string;
}

@ApiTags("Students")
@Controller("students")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO")
  @ApiOperation({
    summary: "Listar estudiantes",
    description: "Obtener lista de estudiantes del usuario autenticado",
  })
  @SwaggerResponse({
    status: 200,
    description: "Lista de estudiantes",
    schema: {
      example: {
        success: true,
        data: {
          students: [
            {
              id: "st_123",
              person_id: "p_123",
              center_id: "c_123",
              first_name: "María",
              last_name: "García López",
            },
          ],
          count: 1,
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async findAll(
    @CurrentUser() user: any
  ): Promise<ApiResponse<{ students: any[]; count: number }>> {
    try {
      const userId = user.id || user.userId;
      const { data: students, error } =
        await this.databaseService.getStudentsByUser(userId);

      if (error) throw new BadRequestException(error.message);

      // Transformar datos para compatibilidad con mapper centralizado
      const transformedStudents = mapStudents(students as any[]);

      return ResponseHelper.success({
        students: transformedStudents,
        count: transformedStudents.length,
      });
    } catch (error) {
      console.error("Error getting students:", error);
      throw new BadRequestException(
        "Error al obtener estudiantes: " + error.message
      );
    }
  }

  @Get(":id")
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR", "DIRECTOR_CENTRO")
  @ApiOperation({
    summary: "Obtener estudiante",
    description: "Obtener detalles de un estudiante específico",
  })
  @SwaggerResponse({
    status: 200,
    description: "Detalle de estudiante",
    schema: {
      example: {
        success: true,
        data: {
          id: "st_123",
          person_id: "p_123",
          center_id: "c_123",
          first_name: "María",
          last_name: "García López",
        },
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async findOne(
    @Param("id") id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponse<any>> {
    const userId = user.id || user.userId;
    const { data, error } = await this.databaseService
      .getClient()
      .from("students")
      .select(
        `
        *,
        persons!person_id (
          id,
          first_name,
          last_name
        ),
        centers!center_id (
          id,
          name,
          address
        )
      `
      )
      .eq("id", id)
      .eq("created_by", userId)
      .single();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException("Estudiante no encontrado");

    // Transformar datos para compatibilidad con mapper centralizado
    const student = mapStudent(data as any);

    return ResponseHelper.success(student);
  }

  @Post()
  @Roles("ADMIN", "ORIENTADOR", "PROFESOR")
  @ApiOperation({
    summary: "Crear estudiante",
    description: "Crear un nuevo estudiante asociado al usuario autenticado",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        name: { type: "string", example: "Juan Pérez" },
        email: { type: "string", example: "juan@ejemplo.com" },
        edad: { type: "number", example: 10 },
        curso: { type: "string", example: "5º Primaria" },
        diagnostico: { type: "string", example: "TDAH" },
        necesidadesEspeciales: {
          type: "array",
          items: { type: "string" },
          example: ["Atención personalizada", "Adaptaciones curriculares"],
        },
      },
      required: ["name"],
    },
  })
  async create(
    @CurrentUser() user: any,
    @Body() studentDto: StudentDto
  ): Promise<ApiResponse<any>> {
    try {
      const userId = user.id || user.userId;

      // Validar campos requeridos
      if (!studentDto.first_name || !studentDto.last_name) {
        throw new BadRequestException("first_name y last_name son requeridos");
      }

      // Crear persona primero
      const { data: person, error: personError } = await this.databaseService
        .getClient()
        .from("persons")
        .insert({
          first_name: studentDto.first_name,
          last_name: studentDto.last_name,
        })
        .select()
        .single();

      if (personError) {
        throw new BadRequestException(
          "Error al crear persona: " + personError.message
        );
      }

      // Crear estudiante con person_id (esquema normalizado: solo person_id, center_id, created_by)
      const newStudent = {
        person_id: person.id,
        center_id: studentDto.center_id || null,
        created_by: userId,
      };

      const { data, error } =
        await this.databaseService.createStudent(newStudent);

      if (error) throw new BadRequestException(error.message);

      // Transformar respuesta para compatibilidad con mapper centralizado
      const studentResponse = mapStudent({
        ...(data as any),
        // fallback si no viniera persons del insert
        persons: data?.persons ?? {
          id: (data as any)?.person_id,
          first_name: studentDto.first_name,
          last_name: studentDto.last_name,
        },
      } as any);

      return ResponseHelper.created(
        studentResponse,
        "Estudiante creado correctamente"
      );
    } catch (error) {
      console.error("Error creating student:", error);
      throw new BadRequestException(
        "Error al crear estudiante: " + error.message
      );
    }
  }

  @Put(":id")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "Actualizar estudiante",
    description: "Actualizar datos de un estudiante existente",
  })
  @SwaggerResponse({
    status: 200,
    description: "Estudiante actualizado",
    schema: {
      example: {
        success: true,
        data: {
          id: "st_123",
          person_id: "p_123",
          center_id: "c_789",
          first_name: "María",
          last_name: "García López",
        },
        message: "Estudiante actualizado correctamente",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async update(
    @Param("id") id: string,
    @Body() studentDto: StudentDto,
    @CurrentUser() user: any
  ): Promise<ApiResponse<any>> {
    const userId = user.id || user.userId;

    // Verificar que el estudiante pertenece al usuario
    const { data: existingStudent, error: fetchError } =
      await this.databaseService
        .getClient()
        .from("students")
        .select(
          `
        *,
        persons!person_id (
          id,
          first_name,
          last_name
        )
      `
        )
        .eq("id", id)
        .eq("created_by", userId)
        .single();

    if (fetchError || !existingStudent) {
      throw new NotFoundException("Estudiante no encontrado");
    }

    // Si hay cambios en first_name o last_name, actualizar la persona
    if (studentDto.first_name || studentDto.last_name) {
      const personId = existingStudent.person_id;
      if (personId) {
        const personUpdate: any = {};
        if (studentDto.first_name)
          personUpdate.first_name = studentDto.first_name;
        if (studentDto.last_name) personUpdate.last_name = studentDto.last_name;

        await this.databaseService
          .getClient()
          .from("persons")
          .update(personUpdate)
          .eq("id", personId);
      }
    }

    // Actualizar estudiante (solo campos permitidos)
    const studentUpdate: any = {
      updated_at: new Date().toISOString(),
    };
    if (studentDto.center_id !== undefined) {
      studentUpdate.center_id = studentDto.center_id;
    }

    const { data, error } = await this.databaseService
      .getClient()
      .from("students")
      .update(studentUpdate)
      .eq("id", id)
      .eq("created_by", userId)
      .select(
        `
        *,
        persons!person_id (
          id,
          first_name,
          last_name
        ),
        centers!center_id (
          id,
          name,
          address
        )
      `
      )
      .single();

    if (error) throw new BadRequestException(error.message);

    // Transformar datos para compatibilidad con mapper centralizado
    const student = mapStudent(data);

    return ResponseHelper.updated(
      student,
      "Estudiante actualizado correctamente"
    );
  }

  @Delete(":id")
  @Roles("ADMIN", "ORIENTADOR")
  @ApiOperation({
    summary: "Eliminar estudiante",
    description: "Eliminar un estudiante existente",
  })
  @SwaggerResponse({
    status: 200,
    description: "Estudiante eliminado",
    schema: {
      example: {
        success: true,
        data: null,
        message: "Estudiante eliminado correctamente",
        timestamp: "2025-11-09T12:00:00.000Z",
      },
    },
  })
  async remove(
    @Param("id") id: string,
    @CurrentUser() user: any
  ): Promise<ApiResponse<any>> {
    const userId = user.id || user.userId;

    // Verificar que el estudiante pertenece al usuario
    const { data: existingStudent } = await this.databaseService
      .getClient()
      .from("students")
      .select("*")
      .eq("id", id)
      .eq("created_by", userId)
      .single();

    if (!existingStudent) {
      throw new NotFoundException("Estudiante no encontrado");
    }

    const { error } = await this.databaseService
      .getClient()
      .from("students")
      .delete()
      .eq("id", id)
      .eq("created_by", userId);

    if (error) throw new BadRequestException(error.message);

    return ResponseHelper.deleted("Estudiante eliminado correctamente");
  }
}
