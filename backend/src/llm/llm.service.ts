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

    const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
    const res = await fetch(`${base}/api/generate`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new BadRequestException('Ollama error ' + res.status);
    const { response } = await res.json();

    try { return JSON.parse(response); }
    catch {
      const first = response.indexOf('{');
      const last = response.lastIndexOf('}');
      if (first >= 0 && last > first) return JSON.parse(response.slice(first, last + 1));
      throw new BadRequestException('El modelo no devolvió JSON válido');
    }
  }
}
