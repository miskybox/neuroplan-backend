import { Injectable } from '@nestjs/common';
import pool from '../../db';

@Injectable()
export class DashboardService {
  async getDashboardStats(userId: string, userRole: string) {
    try {
      // Obtener estadísticas básicas
      const [studentsResult, peisResult, activePeisResult, pendingResult] = await Promise.all([
        pool.query('SELECT COUNT(*) as total FROM "Student"'),
        pool.query('SELECT COUNT(*) as total FROM "PEI"'),
        pool.query('SELECT COUNT(*) as total FROM "PEI" WHERE status = $1', ['ACTIVE']),
        pool.query('SELECT COUNT(*) as total FROM "PEI" WHERE status = $1', ['REVIEW']),
      ]);

      // Obtener actividad reciente
      const recentActivity = await this.getRecentActivity(userId, userRole);

      // Estadísticas mensuales
      const monthlyStats = await this.getMonthlyStats();

      return {
        totalStudents: parseInt(studentsResult.rows[0].total),
        totalPeis: parseInt(peisResult.rows[0].total),
        activePeis: parseInt(activePeisResult.rows[0].total),
        pendingReviews: parseInt(pendingResult.rows[0].total),
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
      const query = `
        SELECT 
          p.id,
          'PEI_CREATED' as type,
          s.nombre as student_name,
          s.apellidos as student_lastname,
          p.created_at as timestamp,
          'Nuevo PEI generado para ' || s.nombre || ' ' || s.apellidos as description
        FROM "PEI" p
        JOIN "Student" s ON p."studentId" = s.id
        ORDER BY p.created_at DESC
        LIMIT 10
      `;

      const result = await pool.query(query);
      return result.rows.map(row => ({
        id: row.id,
        type: row.type,
        studentName: `${row.student_name} ${row.student_lastname}`,
        timestamp: row.timestamp,
        description: row.description,
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

      const [peisResult, studentsResult, reportsResult] = await Promise.all([
        pool.query(`
          SELECT COUNT(*) as total 
          FROM "PEI" 
          WHERE EXTRACT(MONTH FROM created_at) = $1 
          AND EXTRACT(YEAR FROM created_at) = $2
        `, [currentMonth, currentYear]),
        pool.query(`
          SELECT COUNT(*) as total 
          FROM "Student" 
          WHERE EXTRACT(MONTH FROM created_at) = $1 
          AND EXTRACT(YEAR FROM created_at) = $2
        `, [currentMonth, currentYear]),
        pool.query(`
          SELECT COUNT(*) as total 
          FROM "Report" 
          WHERE EXTRACT(MONTH FROM created_at) = $1 
          AND EXTRACT(YEAR FROM created_at) = $2
        `, [currentMonth, currentYear]),
      ]);

      return {
        peisGenerated: parseInt(peisResult.rows[0].total),
        studentsAdded: parseInt(studentsResult.rows[0].total),
        reportsProcessed: parseInt(reportsResult.rows[0].total),
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
