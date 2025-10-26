import { Injectable } from '@nestjs/common';
import { supabase } from '../../db';

@Injectable()
export class DashboardService {
  async getDashboardStats(userId: string, userRole: string) {
    try {
      // Obtener estadísticas básicas usando Supabase
      const [studentsResult, peisResult, activePeisResult, pendingResult] = await Promise.all([
        supabase.from('students').select('count', { count: 'exact' }),
        supabase.from('peis').select('count', { count: 'exact' }),
        supabase.from('peis').select('count', { count: 'exact' }).eq('status', 'ACTIVE'),
        supabase.from('peis').select('count', { count: 'exact' }).eq('status', 'DRAFT'),
      ]);

      // Obtener actividad reciente
      const recentActivity = await this.getRecentActivity(userId, userRole);

      // Estadísticas mensuales
      const monthlyStats = await this.getMonthlyStats();

      return {
        totalStudents: studentsResult.count || 0,
        totalPeis: peisResult.count || 0,
        activePeis: activePeisResult.count || 0,
        pendingReviews: pendingResult.count || 0,
        recentActivity: recentActivity.slice(0, 5),
        monthlyStats,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return {
        totalStudents: 0,
        totalPeis: 0,
        activePeis: 0,
        pendingReviews: 0,
        recentActivity: [],
        monthlyStats: {
          peisGenerated: 0,
          studentsAdded: 0,
          reportsProcessed: 0,
        },
      };
    }
  }

  async getRecentActivity(userId: string, userRole: string) {
    try {
      // Obtener actividad reciente usando Supabase
      const { data, error } = await supabase
        .from('activity_logs')
        .select(`
          id,
          action,
          entity,
          entity_id,
          details,
          created_at,
          users!activity_logs_user_id_fkey(first_name, last_name)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error getting recent activity:', error);
        return [];
      }

      return (data || []).map(row => ({
        id: row.id,
        type: row.action,
        studentName: row.details?.studentName || 'N/A',
        timestamp: row.created_at,
        description: `${row.action} - ${row.entity}`,
      }));
    } catch (error) {
      console.error('Error getting recent activity:', error);
      return [];
    }
  }

  private async getMonthlyStats() {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const startDate = `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`;

      const [peisResult, studentsResult, reportsResult] = await Promise.all([
        supabase
          .from('peis')
          .select('count', { count: 'exact' })
          .gte('created_at', startDate)
          .lt('created_at', endDate),
        supabase
          .from('students')
          .select('count', { count: 'exact' })
          .gte('created_at', startDate)
          .lt('created_at', endDate),
        supabase
          .from('reports')
          .select('count', { count: 'exact' })
          .gte('created_at', startDate)
          .lt('created_at', endDate),
      ]);

      return {
        peisGenerated: peisResult.count || 0,
        studentsAdded: studentsResult.count || 0,
        reportsProcessed: reportsResult.count || 0,
      };
    } catch (error) {
      console.error('Error getting monthly stats:', error);
      return {
        peisGenerated: 0,
        studentsAdded: 0,
        reportsProcessed: 0,
      };
    }
  }
}