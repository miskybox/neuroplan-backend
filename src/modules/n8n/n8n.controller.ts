import {
  Controller,
  Post,
  Get,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { N8nService } from './n8n.service';
import { TriggerWorkflowDto, WebhookPayload } from './dto/n8n.dto';

@ApiTags('n8n')
@Controller('api/n8n')
export class N8nController {
  constructor(private readonly n8nService: N8nService) {}

  @Post('trigger-workflow')
  @ApiOperation({
    summary: '⚙️ Ejecutar workflow de automatización',
    description: `
**Premio n8n (€500 + €600/año)** - Automatización completa de procesos educativos.

**Workflows disponibles:**
- 🔔 **pei-generated**: Notificaciones automáticas cuando se genera un PEI
- ✅ **pei-approved**: Workflow de aprobación y distribución oficial
- 📧 **send-notification**: Envío de notificaciones personalizadas
- 📅 **schedule-review**: Programación automática de revisiones

**Acciones automáticas:**
- 📧 Emails a familias con resúmenes de PEI
- 📱 Notificaciones WhatsApp (Vonage integration)
- 📅 Programación de citas de seguimiento
- 🗃️ Actualización de expedientes digitales
- 📊 Informes de progreso automáticos

**Beneficio:** 0 intervención manual en el flujo educativo
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'Workflow ejecutado correctamente',
    schema: {
      example: {
        executionId: 'clxxxxx',
        workflowName: 'pei-generated',
        status: 'RUNNING',
        n8nExecutionId: 'n8n_exec_123456',
        triggeredAt: '2025-10-11T14:45:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos del workflow inválidos' })
  async triggerWorkflow(@Body() triggerDto: TriggerWorkflowDto) {
    return this.n8nService.triggerWorkflow(triggerDto);
  }

  @Post('pei/:id/generated')
  @ApiOperation({
    summary: '🧠 Workflow automático: PEI generado',
    description: `
**Trigger automático** - Se ejecuta cuando se genera un nuevo PEI.

**Acciones automáticas:**
1. 📧 Email a padres con resumen accesible
2. 🔊 Audio del PEI vía ElevenLabs adjunto
3. 📚 Lista de recursos recomendados vía Linkup
4. 👨‍🏫 Notificación a equipo educativo
5. 📅 Programación de primera revisión (3 meses)
6. 📄 Generación automática de PDF oficial

**Para el frontend:** Llamar después de generar PEI exitosamente
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI recién generado',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 201,
    description: 'Workflow de PEI generado ejecutado',
    schema: {
      example: {
        executionId: 'clxxxxx',
        workflowName: 'pei-generated',
        status: 'RUNNING',
        actions: [
          'Email enviado a padres',
          'Notificación a profesores',
          'Calendario actualizado',
        ],
      },
    },
  })
  async triggerPeiGenerated(@Param('id') peiId: string) {
    const pei = await this.n8nService.getWorkflowExecution(peiId); // Validation
    if (!pei) {
      // Get student from PEI
      const peiData = await this.n8nService.getWorkflowExecution(peiId);
      return this.n8nService.triggerPeiGeneratedWorkflow(peiId, peiData?.pei?.studentId || 'unknown');
    }
    return this.n8nService.triggerPeiGeneratedWorkflow(peiId, pei.pei?.studentId || 'unknown');
  }

  @Post('pei/:id/approved')
  @ApiOperation({
    summary: '✅ Workflow automático: PEI aprobado',
    description: `
**Trigger automático** - Se ejecuta cuando se aprueba oficialmente un PEI.

**Acciones automáticas:**
1. 📧 Confirmación oficial a familia
2. 🗃️ Integración con expediente académico
3. 👨‍🏫 Notificación a claustro de profesores
4. 📋 Copia a orientación educativa
5. 📅 Programación de seguimientos trimestrales
6. 📊 Activación de métricas de progreso

**Para el frontend:** Llamar cuando se cambie estado a "APPROVED"
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI aprobado',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 201,
    description: 'Workflow de PEI aprobado ejecutado',
  })
  async triggerPeiApproved(@Param('id') peiId: string) {
    return this.n8nService.triggerPeiApprovedWorkflow(peiId);
  }

  @Post('notification')
  @ApiOperation({
    summary: '📱 Enviar notificación automática',
    description: `
Workflow genérico para envío de notificaciones personalizadas.

**Canales soportados:**
- 📧 Email (HTML + attachments)
- 📱 SMS (texto plano)
- 💬 WhatsApp (con Vonage API)

**Casos de uso:**
- Recordatorios de citas
- Alertas de progreso
- Comunicaciones urgentes
- Informes periódicos
    `,
  })
  @ApiResponse({
    status: 201,
    description: 'Notificación enviada correctamente',
  })
  async sendNotification(@Body() data: {
    recipient: string;
    subject: string;
    message: string;
    type: 'email' | 'sms' | 'whatsapp';
    priority?: string;
  }) {
    return this.n8nService.triggerNotificationWorkflow(data);
  }

  @Post('webhook/:action')
  @ApiOperation({
    summary: '🔗 Webhook entrante de n8n',
    description: `
**Endpoint interno** - Recibe actualizaciones de estado desde n8n.

**Acciones soportadas:**
- completed: Workflow completado exitosamente
- failed: Error en ejecución
- cancelled: Workflow cancelado manualmente
- running: Actualización de progreso

**Para n8n:** Configurar este endpoint como webhook de callback
    `,
  })
  async processWebhook(
    @Param('action') action: string,
    @Body() webhookPayload: any,
  ) {
    const payload: WebhookPayload = {
      action,
      entityId: webhookPayload.executionId || webhookPayload.entityId,
      data: webhookPayload.data || webhookPayload,
      timestamp: webhookPayload.timestamp || new Date().toISOString(),
    };

    return this.n8nService.processWebhook(payload);
  }

  @Get('executions')
  @ApiOperation({
    summary: '📊 Listar ejecuciones de workflows',
    description: `
Obtiene historial completo de workflows ejecutados.

**Información incluida:**
- Estado de cada ejecución
- Datos de entrada y salida
- Errores si los hay
- Tiempos de ejecución
- PEI y estudiante relacionados

**Para dashboard:** Monitoreo de automatizaciones
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de ejecuciones de workflows',
    schema: {
      example: [
        {
          id: 'clxxxxx',
          workflowName: 'pei-generated',
          status: 'SUCCESS',
          startedAt: '2025-10-11T14:45:00.000Z',
          completedAt: '2025-10-11T14:46:30.000Z',
          pei: {
            id: 'clyyyyy',
            student: {
              name: 'María',
              lastName: 'García López',
            },
          },
        },
      ],
    },
  })
  async getAllExecutions() {
    return this.n8nService.getAllWorkflowExecutions();
  }

  @Get('execution/:id')
  @ApiOperation({
    summary: '🔍 Obtener ejecución específica',
    description: 'Obtiene detalles completos de una ejecución de workflow',
  })
  @ApiParam({
    name: 'id',
    description: 'ID único de la ejecución',
    example: 'clxxxxx',
  })
  @ApiResponse({ status: 200, description: 'Detalles de la ejecución' })
  @ApiResponse({ status: 404, description: 'Ejecución no encontrada' })
  async getExecution(@Param('id') executionId: string) {
    return this.n8nService.getWorkflowExecution(executionId);
  }

  @Get('stats')
  @ApiOperation({
    summary: '📈 Estadísticas de workflows',
    description: `
Obtiene métricas de rendimiento y confiabilidad de automatizaciones.

**Métricas incluidas:**
- Total de ejecuciones
- Tasa de éxito
- Workflows activos
- Errores comunes
- Tiempo promedio de ejecución

**Para dashboard:** KPIs de automatización
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de workflows',
    schema: {
      example: {
        total: 125,
        success: 118,
        failed: 5,
        running: 2,
        successRate: 94.4,
      },
    },
  })
  async getWorkflowStats() {
    return this.n8nService.getWorkflowStats();
  }
}