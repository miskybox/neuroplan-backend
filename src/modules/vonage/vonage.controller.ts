import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VonageService } from './vonage.service';

@ApiTags('vonage')
@Controller('api/vonage')
export class VonageController {
  constructor(private readonly vonageService: VonageService) {}

  @Post('sms/send')
  @ApiOperation({ summary: 'Enviar SMS a padres/tutores' })
  @ApiResponse({ status: 200, description: 'SMS enviado exitosamente' })
  async sendSMS(
    @Body() body: { to: string; message: string },
  ) {
    return this.vonageService.sendSMS(body.to, body.message);
  }

  @Post('whatsapp/send')
  @ApiOperation({ summary: 'Enviar mensaje de WhatsApp' })
  @ApiResponse({ status: 200, description: 'WhatsApp enviado exitosamente' })
  async sendWhatsApp(
    @Body() body: { to: string; template: any },
  ) {
    return this.vonageService.sendWhatsApp(body.to, body.template);
  }

  @Post('video/create-session')
  @ApiOperation({ summary: 'Crear sesión de video para tutoría' })
  @ApiResponse({ status: 200, description: 'Sesión creada exitosamente' })
  async createVideoSession(
    @Body() body: { studentId: string; tutorId: string },
  ) {
    return this.vonageService.createVideoSession(body.studentId, body.tutorId);
  }

  @Post('notify/pei-generated')
  @ApiOperation({ summary: 'Notificar que PEI está generado' })
  @ApiResponse({ status: 200, description: 'Notificación enviada' })
  async notifyPEIGenerated(
    @Body() body: { studentData: any; peiUrl: string },
  ) {
    return this.vonageService.notifyPEIGenerated(body.studentData, body.peiUrl);
  }

  @Post('remind/session')
  @ApiOperation({ summary: 'Enviar recordatorio de sesión' })
  @ApiResponse({ status: 200, description: 'Recordatorio enviado' })
  async sendSessionReminder(
    @Body() body: { phone: string; sessionDate: string; sessionLink: string },
  ) {
    return this.vonageService.sendSessionReminder(
      body.phone,
      new Date(body.sessionDate),
      body.sessionLink,
    );
  }

  @Get('messages/history')
  @ApiOperation({ summary: 'Obtener historial de mensajes' })
  @ApiResponse({ status: 200, description: 'Historial obtenido' })
  async getMessageHistory(
    @Query('phone') phone: string,
    @Query('limit') limit?: number,
  ) {
    return this.vonageService.getMessageHistory(phone, limit);
  }
}
