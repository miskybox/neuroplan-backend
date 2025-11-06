import { Injectable } from '@nestjs/common';
import { supabase } from '../../db';

type AnyObject = Record<string, any>;

@Injectable()
export class PeisService {
  /**
   * Genera un PEI y lo guarda en la tabla `public.peis`
   * - Esquema normalizado: id, student_id, created_by, title, summary, diagnosis
   */
  async generatePEI(diagnosisData: {
    studentId: string;
    reportId?: string;
    diagnosis: string;
    objectives?: any[];
    adaptations?: any[];
    strategies?: any[];
    evaluation?: any[];
    timeline?: any[];
    createdBy: string; // usuario que crea el PEI
  }) {
    try {
      // 1) Obtener info del estudiante con relaciones
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`
          *,
          persons!person_id (
            id,
            first_name,
            last_name
          )
        `)
        .eq('id', diagnosisData.studentId)
        .single();

      if (studentError || !student) {
        console.error('Error getting student:', studentError);
        throw new Error('Estudiante no encontrado');
      }

      // 2) Construir título y resumen basados en el estudiante
      const firstName = student.persons?.first_name ?? '';
      const lastName = student.persons?.last_name ?? '';
      const title = `PEI - ${firstName} ${lastName}`.trim();
      const summary = `Plan Educativo Individualizado para ${firstName} ${lastName}`.trim();

      // 3) Insertar en la tabla `peis` (esquema normalizado: solo title, summary, diagnosis)
      const { data, error } = await supabase
        .from('peis')
        .insert({
          student_id: diagnosisData.studentId,
          created_by: diagnosisData.createdBy,
          title: title,
          summary: summary,
          diagnosis: diagnosisData.diagnosis,
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting PEI:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error generating PEI:', error);
      throw error;
    }
  }

  /**
   * Devuelve todos los PEIs de un estudiante (ordenados por fecha)
   */
  async getPEIsByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting PEIs by student:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error getting PEIs by student:', error);
      return [];
    }
  }

  /**
   * Devuelve un PEI por ID
   */
  async getPEIById(peiId: string) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .select('*')
        .eq('id', peiId)
        .single();

      if (error) {
        console.error('Error getting PEI:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error getting PEI:', error);
      return null;
    }
  }

  /**
   * Actualiza (parcialmente) un PEI
   * Esquema normalizado: title, summary, diagnosis, status
   */
  async updatePEI(peiId: string, updates: {
    title?: string;
    summary?: string;
    diagnosis?: string;
    status?: 'DRAFT' | 'REVIEW' | 'APPROVED' | 'ACTIVE' | 'ARCHIVED';
    approved_by?: string;
  }) {
    try {
      const row = await this.getPEIById(peiId);
      if (!row) throw new Error('PEI no encontrado');

      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.summary !== undefined) updateData.summary = updates.summary;
      if (updates.diagnosis !== undefined) updateData.diagnosis = updates.diagnosis;
      if (updates.status !== undefined) {
        updateData.status = updates.status;
        // Si se aprueba, registrar fecha y usuario
        if (updates.status === 'APPROVED' && updates.approved_by) {
          updateData.approved_at = new Date().toISOString();
          updateData.approved_by = updates.approved_by;
        }
      }

      const { data, error } = await supabase
        .from('peis')
        .update(updateData)
        .eq('id', peiId)
        .select()
        .single();

      if (error) {
        console.error('Error updating PEI:', error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Error updating PEI:', error);
      throw error;
    }
  }

  /**
   * Elimina un PEI
   */
  async deletePEI(peiId: string) {
    try {
      const { error } = await supabase
        .from('peis')
        .delete()
        .eq('id', peiId);

      if (error) {
        console.error('Error deleting PEI:', error);
        throw error;
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting PEI:', error);
      throw error;
    }
  }

  /**
   * Devuelve los PEIs creados por un usuario
   */
  async getPEIsByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting PEIs by user:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error getting PEIs by user:', error);
      return [];
    }
  }

  /**
   * Búsqueda simple por término dentro de campos típicos del JSON
   * NOTA: Supabase permite filtrar por paths JSON con la sintaxis `pei->>campo`.
   * Aquí intento diagnosis/summary. Ajusta si usas otros nombres.
   */
  async searchPEIs(searchTerm: string, userId: string) {
    const term = searchTerm?.trim();
    if (!term) return this.getPEIsByUser(userId);

    try {
      // Importante: esta sintaxis con JSON path funciona en Supabase PostgREST.
      // Si tienes problemas, puedes hacer dos queries separadas y unir resultados en memoria.
      const { data, error } = await supabase
        .from('peis')
        .select('*')
        .eq('user_id', userId)
        .or(
          `pei->>summary.ilike.%${term}%,pei->>diagnosis.ilike.%${term}%`
        )
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching PEIs:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error searching PEIs:', error);
      return [];
    }
  }

  /**
   * (Mock) Genera "audio" de un PEI y lo registra en tabla auxiliar
   * Si no tienes `audio_files`, puedes simplemente devolver un objeto mock.
   */
  async generatePeiAudio(peiId: string, userId: string) {
    const pei = await this.getPEIById(peiId);
    if (!pei) throw new Error('PEI no encontrado');

    // Simulación sencilla para MVP
    return {
      pei_id: peiId,
      url: `https://mock-audio-url.com/pei-${peiId}.mp3`,
      duration: 300,
      language: 'es',
      voice: 'es-ES-Standard-A',
      created_at: new Date().toISOString(),
      created_by: userId,
    };
  }

  /**
   * (Mock) Devuelve "audios" asociados. Si no tienes tabla real, devuelve []
   */
  async getPeiAudio(peiId: string) {
    // Para MVP sin tabla real:
    return [];
  }

  /**
   * (Mock) Exporta un PEI a fichero y devuelve URL (para MVP)
   * En producción, usar RenderService + Storage (Supabase o S3)
   */
  async exportPEI(peiId: string, format: string = 'pdf') {
    const pei = await this.getPEIById(peiId);
    if (!pei) throw new Error('PEI no encontrado');

    return {
      peiId,
      format,
      downloadUrl: `https://mock-export-url.com/pei-${peiId}.${format}`,
      generatedAt: new Date().toISOString(),
    };
  }

  /**
   * Duplica un PEI (crea nueva fila con el JSON actualizado)
   */
  async duplicatePEI(peiId: string, userId: string) {
    const original = await this.getPEIById(peiId);
    if (!original) throw new Error('PEI no encontrado');

    const newPeiJson = {
      ...original.pei,
      title: `${original.pei?.title ?? 'PEI'} (Copia)`,
      meta: {
        ...original.pei?.meta,
        duplicatedFrom: peiId,
        duplicatedAt: new Date().toISOString(),
      },
      status: 'DRAFT',
    };

    const { data, error } = await supabase
      .from('peis')
      .insert({
        user_id: userId,
        student_id: original.student_id,
        pei: newPeiJson,
      })
      .select()
      .single();

    if (error) {
      console.error('Error duplicating PEI:', error);
      throw error;
    }
    return data;
  }
}
