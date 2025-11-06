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

      // Transformar datos para compatibilidad
      const transformedStudents = (students || []).map((student: any) => ({
        ...student,
        first_name: student.persons?.first_name || null,
        last_name: student.persons?.last_name || null,
      }));

      return {
        success: true,
        students: transformedStudents,
        count: transformedStudents.length,
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
      .select(`
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
      `)
      .eq("id", id)
      .eq("created_by", userId)
      .single();

    if (error) throw new BadRequestException(error.message);
    if (!data) throw new NotFoundException("Estudiante no encontrado");

    // Transformar datos para compatibilidad
    const student = {
      ...data,
      first_name: data.persons?.first_name || null,
      last_name: data.persons?.last_name || null,
    };

    return { success: true, student };
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
      
      // Validar campos requeridos
      if (!studentDto.first_name || !studentDto.last_name) {
        throw new BadRequestException('first_name y last_name son requeridos');
      }
      
      // Crear persona primero
      const { data: person, error: personError } = await this.databaseService
        .getClient()
        .from('persons')
        .insert({
          first_name: studentDto.first_name,
          last_name: studentDto.last_name,
        })
        .select()
        .single();

      if (personError) {
        throw new BadRequestException('Error al crear persona: ' + personError.message);
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

      // Transformar respuesta para compatibilidad
      const studentResponse = {
        ...data,
        first_name: data.persons?.first_name || studentDto.first_name,
        last_name: data.persons?.last_name || studentDto.last_name,
        // Nota: grade, parent_email, etc. ya no existen en el esquema normalizado
        // Si se necesitan, deberían guardarse en otra tabla o en la tabla persons
      };

      return {
        success: true,
        student: studentResponse,
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
    const { data: existingStudent, error: fetchError } = await this.databaseService
      .getClient()
      .from("students")
      .select(`
        *,
        persons!person_id (
          id,
          first_name,
          last_name
        )
      `)
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
        if (studentDto.first_name) personUpdate.first_name = studentDto.first_name;
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
      .select(`
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
      `)
      .single();

    if (error) throw new BadRequestException(error.message);

    // Transformar datos para compatibilidad
    const student = {
      ...data,
      first_name: data.persons?.first_name || null,
      last_name: data.persons?.last_name || null,
    };

    return {
      success: true,
      student,
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
