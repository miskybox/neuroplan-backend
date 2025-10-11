import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { TriggerWorkflowDto, WebhookPayload } from './dto/n8n.dto';
import axios from 'axios';

@Injectable()
export class N8nService {
  private readonly webhookUrl: string;
  private readonly apiKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.webhookUrl = this.configService.get<string>('N8N_WEBHOOK_URL');
    this.apiKey = this.configService.get<string>('N8N_API_KEY');
    
    if (!this.webhookUrl || this.webhookUrl.startsWith('https://tu-')) {
      console.warn('⚠️  n8n webhook URL no configurada. Usando modo mock para hackathon.');
    }
  }

  /**
   * Dispara un workflow específico en n8n
   */
  async triggerWorkflow(dto: TriggerWorkflowDto) {
    // Crear registro de ejecución
    const execution = await this.prisma.workflowExecution.create({
      data: {
        workflowName: dto.workflowName,
        status: 'PENDING',
        input: JSON.stringify(dto.data),
        peiId: dto.data.peiId || 'unknown',
      },
    });

    // Modo mock para hackathon si no hay webhook URL
    if (!this.webhookUrl || this.webhookUrl.startsWith('https://tu-')) {
      return this.simulateWorkflowExecution(execution.id, dto);
    }

    try {
      // Preparar payload para n8n
      const payload = {
        workflowName: dto.workflowName,
        executionId: execution.id,
        priority: dto.priority || 'normal',
        timestamp: new Date().toISOString(),
        ...dto.data,
      };

      // Llamar webhook de n8n
      const response = await axios.post(this.webhookUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'Authorization': `Bearer ${this.apiKey}` }),
        },
        timeout: 10000, // 10 segundos timeout
      });

      // Actualizar ejecución con respuesta exitosa
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'RUNNING',
          executionId: response.data.executionId || execution.id,
          output: JSON.stringify(response.data),
        },
      });

      // Log de actividad
      await this.prisma.activityLog.create({
        data: {
          action: 'trigger_workflow',
          entity: 'workflow',
          entityId: execution.id,
          details: JSON.stringify({
            workflowName: dto.workflowName,
            executionId: execution.id,
            priority: dto.priority,
          }),
        },
      });

      return {
        executionId: execution.id,
        workflowName: dto.workflowName,
        status: 'RUNNING',
        n8nExecutionId: response.data.executionId,
        triggeredAt: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error('Error ejecutando workflow n8n:', error.response?.data || error.message);

      // Actualizar ejecución con error
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status: 'FAILED',
          error: error.message || 'Error desconocido en webhook n8n',
        },
      });

      throw new BadRequestException('Error ejecutando workflow en n8n');
    }
  }

  /**
   * Workflows automáticos para eventos de PEI
   */
  async triggerPeiGeneratedWorkflow(peiId: string, studentId: string) {
    // Obtener datos del PEI y estudiante
    const pei = await this.prisma.pEI.findUnique({
      where: { id: peiId },
      include: {
        student: true,
      },
    });

    if (!pei) {
      throw new BadRequestException('PEI no encontrado');
    }

    // Preparar datos del workflow
    const workflowData = {
      peiId,
      studentId,
      studentName: `${pei.student.name} ${pei.student.lastName}`,
      studentGrade: pei.student.grade,
      parentEmail: pei.student.parentEmail,
      school: pei.student.school,
      peiSummary: pei.summary.substring(0, 200) + '...',
      createdAt: pei.createdAt.toISOString(),
    };

    return this.triggerWorkflow({
      workflowName: 'pei-generated',
      data: workflowData,
      priority: 'normal',
    });
  }

  /**
   * Workflow para PEI aprobado
   */
  async triggerPeiApprovedWorkflow(peiId: string) {
    const pei = await this.prisma.pEI.findUnique({
      where: { id: peiId },
      include: {
        student: true,
      },
    });

    if (!pei) {
      throw new BadRequestException('PEI no encontrado');
    }

    const workflowData = {
      peiId,
      studentId: pei.studentId,
      studentName: `${pei.student.name} ${pei.student.lastName}`,
      parentEmail: pei.student.parentEmail,
      school: pei.student.school,
      approvedAt: new Date().toISOString(),
      approvedBy: pei.approvedBy || 'Sistema',
    };

    return this.triggerWorkflow({
      workflowName: 'pei-approved',
      data: workflowData,
      priority: 'high',
    });
  }

  /**
   * Workflow para notificaciones generales
   */
  async triggerNotificationWorkflow(data: {
    recipient: string;
    subject: string;
    message: string;
    type: 'email' | 'sms' | 'whatsapp';
    priority?: string;
  }) {
    return this.triggerWorkflow({
      workflowName: 'send-notification',
      data,
      priority: data.priority || 'normal',
    });
  }

  /**
   * Procesa webhooks entrantes de n8n
   */
  async processWebhook(payload: WebhookPayload) {
    // Buscar la ejecución correspondiente
    const execution = await this.prisma.workflowExecution.findFirst({
      where: {
        OR: [
          { id: payload.entityId },
          { executionId: payload.entityId },
        ],
      },
    });

    if (execution) {
      // Actualizar estado de la ejecución
      const status = this.mapWebhookStatusToExecution(payload.action);
      
      await this.prisma.workflowExecution.update({
        where: { id: execution.id },
        data: {
          status,
          output: JSON.stringify(payload.data),
          completedAt: status === 'SUCCESS' || status === 'FAILED' ? new Date() : undefined,
        },
      });
    }

    // Log de actividad
    await this.prisma.activityLog.create({
      data: {
        action: `webhook_${payload.action}`,
        entity: 'workflow',
        entityId: payload.entityId,
        details: JSON.stringify(payload.data),
      },
    });

    return { received: true, action: payload.action };
  }

  /**
   * Obtiene el estado de una ejecución de workflow
   */
  async getWorkflowExecution(executionId: string) {
    return this.prisma.workflowExecution.findUnique({
      where: { id: executionId },
      include: {
        pei: {
          include: {
            student: true,
          },
        },
      },
    });
  }

  /**
   * Lista todas las ejecuciones de workflows
   */
  async getAllWorkflowExecutions() {
    return this.prisma.workflowExecution.findMany({
      include: {
        pei: {
          include: {
            student: true,
          },
        },
      },
      orderBy: { startedAt: 'desc' },
    });
  }

  /**
   * Obtiene estadísticas de workflows
   */
  async getWorkflowStats() {
    const total = await this.prisma.workflowExecution.count();
    const success = await this.prisma.workflowExecution.count({
      where: { status: 'SUCCESS' },
    });
    const failed = await this.prisma.workflowExecution.count({
      where: { status: 'FAILED' },
    });
    const running = await this.prisma.workflowExecution.count({
      where: { status: 'RUNNING' },
    });

    return {
      total,
      success,
      failed,
      running,
      successRate: total > 0 ? (success / total) * 100 : 0,
    };
  }

  /**
   * Simula ejecución de workflow para modo mock
   */
  private async simulateWorkflowExecution(executionId: string, dto: TriggerWorkflowDto) {
    // Simular delay de procesamiento
    setTimeout(async () => {
      await this.prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
          status: 'SUCCESS',
          executionId: `mock_${Date.now()}`,
          output: JSON.stringify({
            message: `Workflow ${dto.workflowName} ejecutado exitosamente (modo mock)`,
            processedAt: new Date().toISOString(),
            actions: this.getMockWorkflowActions(dto.workflowName),
          }),
          completedAt: new Date(),
        },
      });
    }, 2000); // 2 segundos de delay

    return {
      executionId,
      workflowName: dto.workflowName,
      status: 'RUNNING',
      n8nExecutionId: `mock_${Date.now()}`,
      triggeredAt: new Date().toISOString(),
      mockMode: true,
    };
  }

  /**
   * Acciones mock por tipo de workflow
   */
  private getMockWorkflowActions(workflowName: string) {
    const actions = {
      'pei-generated': [
        'Email enviado a padres con resumen del PEI',
        'Notificación a profesores sobre nuevo PEI',
        'Calendario actualizado con fecha de revisión',
        'Documento PDF generado y almacenado',
      ],
      'pei-approved': [
        'Email de confirmación enviado a familia',
        'PEI añadido al expediente oficial',
        'Notificación a orientador/a educativo',
        'Programación de seguimiento en 3 meses',
      ],
      'send-notification': [
        'Mensaje enviado por canal especificado',
        'Confirmación de entrega registrada',
        'Estado actualizado en sistema',
      ],
      'schedule-review': [
        'Cita programada en calendario',
        'Recordatorio configurado',
        'Notificaciones preparadas',
      ],
    };

    return actions[workflowName] || ['Acción genérica ejecutada'];
  }

  /**
   * Mapea estados de webhook a estados de ejecución
   */
  private mapWebhookStatusToExecution(action: string): string {
    const statusMap = {
      'completed': 'SUCCESS',
      'success': 'SUCCESS',
      'failed': 'FAILED',
      'error': 'FAILED',
      'cancelled': 'CANCELLED',
      'running': 'RUNNING',
      'pending': 'PENDING',
    };

    return statusMap[action.toLowerCase()] || 'RUNNING';
  }
}