import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

/**
 * Servicio centralizado para operaciones de base de datos
 * Evita dependencias circulares al centralizar las operaciones
 */
@Injectable()
export class DatabaseService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getClient() {
    return this.supabaseService.getClient();
  }

  // Estudiantes
  async getStudentsByUser(userId: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('students')
      .select('*')
      .eq('created_by', userId);
    
    return { data, error };
  }

  async createStudent(studentData: any) {
    const { data, error } = await this.supabaseService.getClient()
      .from('students')
      .insert(studentData)
      .select()
      .single();
    
    return { data, error };
  }

  // Usuarios
  async getUserById(userId: string) {
    const { data, error } = await this.supabaseService.getClient()
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  }

  // Verificación de conexión
  async testConnection(): Promise<boolean> {
    try {
      const { error } = await this.supabaseService.getClient()
        .from('users')
        .select('count')
        .limit(1);
        
      if (error) {
        console.error('Supabase connection error:', error);
        return false;
      }
      console.log('✅ Supabase connection successful');
      return true;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  }
}