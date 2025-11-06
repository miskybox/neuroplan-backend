import { Injectable, Logger } from "@nestjs/common";
import { SupabaseService } from "./supabase.service";

/**
 * Servicio centralizado para operaciones de base de datos
 * Evita dependencias circulares al centralizar las operaciones
 */
@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  getClient() {
    return this.supabaseService.getClient();
  }

  // Estudiantes
  async getStudentsByUser(userId: string) {
    const { data, error } = await this.supabaseService
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
      .eq("created_by", userId);

    return { data, error };
  }

  async createStudent(studentData: any) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("students")
      .insert(studentData)
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

    return { data, error };
  }

  // Usuarios
  async getUserById(userId: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("users")
      .select(
        `
        *,
        persons!person_id (
          id,
          first_name,
          last_name
        ),
        roles!role_id (
          id,
          name
        ),
        centers!center_id (
          id,
          name,
          address
        )
      `
      )
      .eq("id", userId)
      .single();

    return { data, error };
  }

  // Personas
  async createPerson(personData: { first_name?: string; last_name?: string }) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("persons")
      .insert(personData)
      .select()
      .single();

    return { data, error };
  }

  // Roles
  async getRoleByName(roleName: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .from("roles")
      .select("*")
      .eq("name", roleName)
      .single();

    return { data, error };
  }

  // Verificación de conexión
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from("users")
        .select("count")
        .limit(1);

      if (error) {
        const msg = error instanceof Error ? error.message : String(error);
        this.logger.error("Supabase connection error:", msg);
        return false;
      }
      this.logger.log("✅ Supabase connection successful");
      return true;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      this.logger.error("Supabase connection failed:", msg);
      return false;
    }
  }
}
