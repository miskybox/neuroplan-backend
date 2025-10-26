import { Injectable } from '@nestjs/common';
import { supabase } from '../../db';

@Injectable()
export class PeisService {
  async generatePEI(diagnosisData: {
    studentId: string;
    reportId?: string;
    diagnosis: string;
    objectives: any[];
    adaptations: any[];
    strategies: any[];
    evaluation: any[];
    timeline: any[];
  }) {
    try {
      // Obtener información del estudiante
      const { data: student, error: studentError } = await supabase
        .from('students')
        .select('*')
        .eq('id', diagnosisData.studentId)
        .single();

      if (studentError) {
        console.error('Error getting student:', studentError);
        throw new Error('Estudiante no encontrado');
      }

      // Crear PEI
      const { data: pei, error: peiError } = await supabase
        .from('peis')
        .insert({
          student_id: diagnosisData.studentId,
          report_id: diagnosisData.reportId,
          title: `PEI - ${student.first_name} ${student.last_name}`,
          summary: `Plan Educativo Individualizado para ${student.first_name} ${student.last_name}`,
          diagnosis: diagnosisData.diagnosis,
          objectives: diagnosisData.objectives,
          adaptations: diagnosisData.adaptations,
          strategies: diagnosisData.strategies,
          evaluation: diagnosisData.evaluation,
          timeline: diagnosisData.timeline,
          status: 'DRAFT',
          created_by: student.created_by, // Usar el creador del estudiante
        })
        .select()
        .single();

      if (peiError) {
        console.error('Error creating PEI:', peiError);
        throw peiError;
      }

      return pei;
    } catch (error) {
      console.error('Error generating PEI:', error);
      throw error;
    }
  }

  async getPEIsByStudent(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting PEIs:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting PEIs:', error);
      return [];
    }
  }

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

  async updatePEI(peiId: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .update(updates)
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

  async getPEIsByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .select(`
          *,
          students!peis_student_id_fkey(first_name, last_name),
          reports!peis_report_id_fkey(filename, original_name)
        `)
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

  async searchPEIs(searchTerm: string, userId: string) {
    try {
      const { data, error } = await supabase
        .from('peis')
        .select(`
          *,
          students!peis_student_id_fkey(first_name, last_name)
        `)
        .eq('created_by', userId)
        .or(`title.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,diagnosis.ilike.%${searchTerm}%`)
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

  async generatePeiAudio(peiId: string, userId: string) {
    try {
      // Obtener el PEI
      const pei = await this.getPEIById(peiId);
      if (!pei) {
        throw new Error('PEI no encontrado');
      }

      // Simular generación de audio (en modo mock)
      const audioData = {
        pei_id: peiId,
        url: `https://mock-audio-url.com/pei-${peiId}.mp3`,
        duration: 300, // 5 minutos
        language: 'es',
        voice: 'es-ES-Standard-A',
      };

      const { data, error } = await supabase
        .from('audio_files')
        .insert(audioData)
        .select()
        .single();

      if (error) {
        console.error('Error creating audio file:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error generating PEI audio:', error);
      throw error;
    }
  }

  async getPeiAudio(peiId: string) {
    try {
      const { data, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('pei_id', peiId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error getting PEI audio:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting PEI audio:', error);
      return [];
    }
  }

  async exportPEI(peiId: string, format: string = 'pdf') {
    try {
      const pei = await this.getPEIById(peiId);
      if (!pei) {
        throw new Error('PEI no encontrado');
      }

      // Simular exportación (en modo mock)
      const exportData = {
        peiId,
        format,
        downloadUrl: `https://mock-export-url.com/pei-${peiId}.${format}`,
        generatedAt: new Date().toISOString(),
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting PEI:', error);
      throw error;
    }
  }

  async duplicatePEI(peiId: string, userId: string) {
    try {
      const originalPei = await this.getPEIById(peiId);
      if (!originalPei) {
        throw new Error('PEI no encontrado');
      }

      // Crear copia del PEI
      const { data, error } = await supabase
        .from('peis')
        .insert({
          student_id: originalPei.student_id,
          report_id: originalPei.report_id,
          title: `${originalPei.title} (Copia)`,
          summary: originalPei.summary,
          diagnosis: originalPei.diagnosis,
          objectives: originalPei.objectives,
          adaptations: originalPei.adaptations,
          strategies: originalPei.strategies,
          evaluation: originalPei.evaluation,
          timeline: originalPei.timeline,
          status: 'DRAFT',
          created_by: userId,
        })
        .select()
        .single();

      if (error) {
        console.error('Error duplicating PEI:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error duplicating PEI:', error);
      throw error;
    }
  }
}