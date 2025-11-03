import {
  Controller,
  Get,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}
  
  @Get()
  @ApiOperation({
    summary: 'Obtener datos del dashboard',
    description: 'Obtiene estadísticas y datos para el dashboard del usuario autenticado',
  })
  async getDashboardData(@CurrentUser() user: any) {
    try {
      const userId = user.id || user.userId;
      const dashboardData = await this.dashboardService.getDashboardStats(userId, user.rol);
      
      return {
        success: true,
        data: dashboardData,
      };
    } catch (error) {
      throw new BadRequestException(`Error al obtener datos del dashboard: ${error.message}`);
    }
  }

  @Get('stats')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO')
  @ApiOperation({
    summary: '📊 Estadísticas del Dashboard',
    description: 'Obtiene estadísticas generales del sistema para el dashboard principal',
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas del dashboard',
    schema: {
      example: {
        totalStudents: 45,
        totalPeis: 23,
        activePeis: 18,
        pendingReviews: 5,
        recentActivity: [
          {
            id: 'clxxxxx',
            type: 'PEI_CREATED',
            studentName: 'María García',
            timestamp: '2025-10-11T15:00:00.000Z',
            description: 'Nuevo PEI generado para María García',
          },
        ],
        monthlyStats: {
          peisGenerated: 12,
          studentsAdded: 8,
          reportsProcessed: 15,
        },
      },
    },
  })
  async getDashboardStats(@CurrentUser() user: any) {
    return this.dashboardService.getDashboardStats(user.id, user.rol);
  }

  @Get('recent-activity')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO')
  @ApiOperation({
    summary: '🕒 Actividad Reciente',
    description: 'Obtiene la actividad reciente del sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de actividades recientes',
  })
  async getRecentActivity(@CurrentUser() user: any) {
    return this.dashboardService.getRecentActivity(user.id, user.rol);
  }
}
