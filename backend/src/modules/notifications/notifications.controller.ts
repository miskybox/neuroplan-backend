import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @ApiOperation({
    summary: '📧 Obtener notificaciones',
    description: 'Obtiene las notificaciones del usuario actual',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones',
    schema: {
      example: [
        {
          id: 'clxxxxx',
          type: 'PEI_APPROVED',
          title: 'PEI Aprobado',
          message: 'El PEI de María García ha sido aprobado',
          read: false,
          createdAt: '2025-10-11T15:00:00.000Z',
        },
      ],
    },
  })
  async getNotifications(@CurrentUser() user: any) {
    return this.notificationsService.getUserNotifications(user.id);
  }

  @Post('send')
  @Roles('ADMIN', 'ORIENTADOR')
  @ApiOperation({
    summary: '📤 Enviar notificación',
    description: 'Envía una notificación a usuarios específicos',
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación enviada correctamente',
  })
  async sendNotification(
    @Body() notificationData: {
      userIds: string[];
      type: string;
      title: string;
      message: string;
    },
    @CurrentUser() user: any,
  ) {
    return this.notificationsService.sendNotification(notificationData, user.id);
  }

  @Post(':id/mark-read')
  @Roles('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA')
  @ApiOperation({
    summary: '✅ Marcar notificación como leída',
    description: 'Marca una notificación específica como leída',
  })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: any) {
    return this.notificationsService.markAsRead(id, user.id);
  }
}
