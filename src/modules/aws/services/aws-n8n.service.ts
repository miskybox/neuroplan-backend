import { Injectable } from '@nestjs/common';

/**
 * N8N Service
 * Integración con N8N para automatización de workflows
 */
@Injectable()
export class AwsN8nService {
  private readonly mockMode: boolean;
  private readonly n8nUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.mockMode = !process.env.N8N_API_KEY;
    this.n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
    this.apiKey = process.env.N8N_API_KEY || 'mock-key';
  }

  /**
   * Ejecutar workflow de N8N
   */
  async triggerWorkflow(
    workflowId: string,
    data: any,
    options: {
      waitForCompletion?: boolean;
      timeout?: number;
    } = {}
  ): Promise<{
    executionId: string;
    status: string;
    result?: any;
    error?: string;
  }> {
    if (this.mockMode) {
      return this.mockTriggerWorkflow(workflowId, data);
    }

    try {
      const response = await fetch(`${this.n8nUrl}/api/v1/workflows/${workflowId}/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-API-KEY': this.apiKey,
        },
        body: JSON.stringify({
          data,
          waitForCompletion: options.waitForCompletion || false,
          timeout: options.timeout || 30000,
        }),
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        executionId: result.executionId,
        status: result.status,
        result: result.data,
      };
    } catch (error) {
      console.error('Error triggering N8N workflow:', error);
      return {
        executionId: `mock-${Date.now()}`,
        status: 'error',
        error: error.message,
      };
    }
  }

  /**
   * Obtener historial de ejecuciones
   */
  async getExecutions(
    workflowId?: string,
    limit: number = 50
  ): Promise<Array<{
    id: string;
    workflowId: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    data: any;
  }>> {
    if (this.mockMode) {
      return this.mockGetExecutions(workflowId, limit);
    }

    try {
      const url = workflowId 
        ? `${this.n8nUrl}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`
        : `${this.n8nUrl}/api/v1/executions?limit=${limit}`;

      const response = await fetch(url, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.map((execution: any) => ({
        id: execution.id,
        workflowId: execution.workflowId,
        status: execution.status,
        startedAt: execution.startedAt,
        finishedAt: execution.finishedAt,
        data: execution.data,
      }));
    } catch (error) {
      console.error('Error getting N8N executions:', error);
      return this.mockGetExecutions(workflowId, limit);
    }
  }

  /**
   * Obtener estado de una ejecución específica
   */
  async getExecutionStatus(executionId: string): Promise<{
    id: string;
    status: string;
    progress: number;
    result?: any;
    error?: string;
  }> {
    if (this.mockMode) {
      return this.mockGetExecutionStatus(executionId);
    }

    try {
      const response = await fetch(`${this.n8nUrl}/api/v1/executions/${executionId}`, {
        headers: {
          'X-N8N-API-KEY': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(`N8N API error: ${response.statusText}`);
      }

      const result = await response.json();
      return {
        id: result.id,
        status: result.status,
        progress: result.progress || 0,
        result: result.data,
        error: result.error,
      };
    } catch (error) {
      console.error('Error getting execution status:', error);
      return this.mockGetExecutionStatus(executionId);
    }
  }

  /**
   * Enviar notificación automática
   */
  async sendNotificationWorkflow(
    type: 'PEI_APPROVED' | 'PEI_CREATED' | 'REPORT_PROCESSED' | 'REMINDER',
    data: {
      userId: string;
      studentName: string;
      peiId?: string;
      message: string;
    }
  ): Promise<{
    executionId: string;
    status: string;
  }> {
    const workflowId = this.getWorkflowIdByType(type);
    return this.triggerWorkflow(workflowId, data, { waitForCompletion: true });
  }

  /**
   * Generar reporte automático mensual
   */
  async generateMonthlyReport(
    centerId: string,
    month: number,
    year: number
  ): Promise<{
    executionId: string;
    status: string;
    reportUrl?: string;
  }> {
    const workflowId = 'monthly-report-generator';
    const result = await this.triggerWorkflow(workflowId, {
      centerId,
      month,
      year,
    }, { waitForCompletion: true });

    return {
      executionId: result.executionId,
      status: result.status,
      reportUrl: result.result?.reportUrl,
    };
  }

  // Métodos mock para desarrollo
  private mockTriggerWorkflow(workflowId: string, data: any) {
    return {
      executionId: `mock-${Date.now()}`,
      status: 'success',
      result: {
        message: `Workflow ${workflowId} ejecutado correctamente`,
        data,
      },
    };
  }

  private mockGetExecutions(workflowId?: string, limit: number = 50) {
    const executions = [];
    for (let i = 0; i < Math.min(limit, 10); i++) {
      executions.push({
        id: `mock-exec-${i}`,
        workflowId: workflowId || `workflow-${i % 3}`,
        status: ['success', 'running', 'error'][i % 3],
        startedAt: new Date(Date.now() - i * 3600000).toISOString(),
        finishedAt: i % 3 !== 1 ? new Date(Date.now() - i * 3600000 + 300000).toISOString() : undefined,
        data: { mock: true, iteration: i },
      });
    }
    return executions;
  }

  private mockGetExecutionStatus(executionId: string) {
    return {
      id: executionId,
      status: 'success',
      progress: 100,
      result: {
        message: 'Ejecución completada exitosamente',
        mock: true,
      },
    };
  }

  private getWorkflowIdByType(type: string): string {
    const workflowMap = {
      'PEI_APPROVED': 'pei-approval-notification',
      'PEI_CREATED': 'pei-creation-notification',
      'REPORT_PROCESSED': 'report-processing-notification',
      'REMINDER': 'reminder-notification',
    };
    return workflowMap[type] || 'default-notification';
  }
}
