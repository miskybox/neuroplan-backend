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
import { ApiTags, ApiOperation, ApiBody, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { DatabaseService } from "../supabase/database.service";

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
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly databaseService: DatabaseService) {}

  @Get()
  @ApiOperation({
    summary: "Listar estudiantes",
    description: "Obtener lista de estudiantes del usuario autenticado",
  })
  async findAll(@CurrentUser() user: any) {
    try {
      const userId = user.id || user.userId;
      const { data: students, error } =
        await this.databaseService.getStudentsByUser(userId);

      if (error) throw new BadRequestException(error.message);

      return {
        success: true,
        students: students || [],
        count: students?.length || 0,
      };
    } catch (error) {
      console.error("Error getting students:", error);
      throw new BadRequestException(
        "Error al obtener estudiantes: " + error.message
      );
    }
  }

  @Get(":id")
  @ApiOperation({
    summary: "Obtener estudiante",
    description: "Obtener detalles de un estudiante específico",
  })
  async findOne(@Param("id") id: string, @CurrentUser() user: any) {
    const userId = user.id || user.userId;
    const { data, error } = await this.databaseService
      .getClient()
      .from("students")
      .select("*")
      .eq("id", id)
      .eq("created_by", userId)
      .single();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException("Estudiante no encontrado");

    return { success: true, student: data };
  }

  @Post()
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
  async create(@CurrentUser() user: any, @Body() studentDto: StudentDto) {
    try {
      const userId = user.id || user.userId;
      const newStudent = {
        ...studentDto,
        created_by: userId,
        created_at: new Date().toISOString(),
      };

      const { data, error } =
        await this.databaseService.createStudent(newStudent);

      if (error) throw new BadRequestException(error.message);

      return {
        success: true,
        student: data,
        message: "Estudiante creado correctamente",
      };
    } catch (error) {
      console.error("Error creating student:", error);
      throw new BadRequestException(
        "Error al crear estudiante: " + error.message
      );
    }
  }

  @Put(":id")
  @ApiOperation({
    summary: "Actualizar estudiante",
    description: "Actualizar datos de un estudiante existente",
  })
  async update(
    @Param("id") id: string,
    @Body() studentDto: StudentDto,
    @CurrentUser() user: any
  ) {
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

    const { data, error } = await this.databaseService
      .getClient()
      .from("students")
      .update({
        ...studentDto,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("created_by", userId)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    return {
      success: true,
      student: data,
      message: "Estudiante actualizado correctamente",
    };
  }

  @Delete(":id")
  @ApiOperation({
    summary: "Eliminar estudiante",
    description: "Eliminar un estudiante existente",
  })
  async remove(@Param("id") id: string, @CurrentUser() user: any) {
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

    return {
      success: true,
      message: "Estudiante eliminado correctamente",
    };
  }
}
