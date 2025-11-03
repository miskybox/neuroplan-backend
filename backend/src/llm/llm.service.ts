import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { HttpService } from '../common/http/http.service';
import { AxiosError } from 'axios';

const SYSTEM_PROMPT = `Eres un asistente educativo. Devuelve EXCLUSIVAMENTE un JSON válido con las claves:
meta, student, assessment, goals, supports, plan.
Si falta info, estima y marca "(estimado)". Sin texto extra.`;

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);

  constructor(private readonly httpService: HttpService) {}

  async generateText(prompt: string): Promise<string> {
    const body = {
      model: process.env.OLLAMA_MODEL || 'llama3.2:3b',
      prompt,
      stream: false,
      options: { temperature: 0.2 }
    };

    const baseUrl = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_URL || 'http://localhost:11434';

    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug('[LLM] Enviando solicitud a Ollama');
    }

    let response: string;
    try {
      const { data } = await this.httpService.post<{ response: string }>(
        `${baseUrl}/api/generate`,
        body
      );
      response = data.response;
      this.logger.debug('[LLM] Respuesta recibida de Ollama');
    } catch (error) {
      this.handleOllamaError(error);
    }

    return response;
  }

  async peiFromText(student: any, text: string, context = ''): Promise<any> {
    const prompt = `${SYSTEM_PROMPT}

Perfil del estudiante:
${JSON.stringify(student, null, 2)}

Texto clínico:
${text}

Contexto del centro:
${context}

Devuelve SOLO el JSON.`;

    const response = await this.generateText(prompt);
    return this.parseOllamaResponse(response);
  }

  private parseOllamaResponse(response: string): any {
    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      // Intentar extraer JSON del texto
      const first = response.indexOf('{');
      const last = response.lastIndexOf('}');
      if (first >= 0 && last > first) {
        try {
          parsed = JSON.parse(response.slice(first, last + 1));
        } catch {
          this.logger.error('[LLM] No se pudo parsear JSON de la respuesta');
          throw new BadRequestException('El modelo no devolvió JSON válido');
        }
      } else {
        this.logger.error('[LLM] No se encontró JSON en la respuesta');
        throw new BadRequestException('El modelo no devolvió JSON válido');
      }
    }

    // Validar estructura mínima
    if (!parsed || typeof parsed !== 'object' || !parsed.meta || !parsed.student) {
      this.logger.error('[LLM] JSON incompleto o inesperado');
      throw new BadRequestException('El modelo devolvió un JSON incompleto');
    }

    this.logger.debug('[LLM] JSON parseado correctamente');
    return parsed;
  }

  private handleOllamaError(error: unknown): never {
    if (error instanceof AxiosError) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;

      this.logger.error(`[LLM] Error de Ollama (${status}): ${message}`);

      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        throw new BadRequestException(
          'No se pudo conectar con Ollama. Asegúrate de que esté corriendo en ' +
          (process.env.OLLAMA_URL || 'http://localhost:11434')
        );
      }

      throw new BadRequestException(`Error de Ollama: ${message}`);
    }

    this.logger.error('[LLM] Error desconocido:', error);
    throw new BadRequestException('Error al comunicarse con Ollama');
  }
}
