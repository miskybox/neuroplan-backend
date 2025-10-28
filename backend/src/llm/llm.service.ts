import { Injectable, BadRequestException } from '@nestjs/common';
import fetch from 'node-fetch';

const SYSTEM_PROMPT = `Eres un asistente educativo. Devuelve EXCLUSIVAMENTE un JSON válido con las claves:
meta, student, assessment, goals, supports, plan.
Si falta info, estima y marca "(estimado)". Sin texto extra.`;

@Injectable()
export class LlmService {
  async peiFromText(student: any, text: string, context = ''): Promise<any> {
    const body = {
      model: process.env.OLLAMA_MODEL || 'llama3.1:8b-instruct',
      prompt:
`${SYSTEM_PROMPT}

Perfil del estudiante:
${JSON.stringify(student, null, 2)}

Texto clínico:
${text}

Contexto del centro:
${context}

Devuelve SOLO el JSON.`,
      stream: false,
      options: { temperature: 0.2 }
    };

    const base = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_URL || 'http://localhost:11434';
    // LOG: prompt y body
    console.log('[LLM] Prompt enviado a Ollama:', body.prompt);
    let res;
    try {
      res = await fetch(`${base}/api/generate`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (err) {
      console.error('[LLM] Error de red al llamar a Ollama:', err);
      throw new BadRequestException('No se pudo conectar con Ollama');
    }
    if (!res.ok) {
      const errText = await res.text();
      console.error('[LLM] Ollama error', res.status, errText);
      throw new BadRequestException('Ollama error ' + res.status);
    }
    const { response } = await res.json();
    // LOG: respuesta cruda
    console.log('[LLM] Respuesta cruda de Ollama:', response);

    let parsed;
    try {
      parsed = JSON.parse(response);
    } catch {
      const first = response.indexOf('{');
      const last = response.lastIndexOf('}');
      if (first >= 0 && last > first) {
        parsed = JSON.parse(response.slice(first, last + 1));
      } else {
        console.error('[LLM] No se pudo parsear JSON:', response);
        throw new BadRequestException('El modelo no devolvió JSON válido');
      }
    }
    // LOG: JSON parseado
    console.log('[LLM] JSON parseado:', parsed);
    // Validar estructura mínima
    if (!parsed || typeof parsed !== 'object' || !parsed.meta || !parsed.student) {
      console.error('[LLM] JSON incompleto o inesperado:', parsed);
      throw new BadRequestException('El modelo devolvió un JSON incompleto o inesperado');
    }
    return parsed;
  }
}
