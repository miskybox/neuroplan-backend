import { Injectable, BadRequestException } from '@nestjs/common';
import pdf from 'pdf-parse';

@Injectable()
export class ExtractService {
  async fromPdfBuffer(buf: Buffer): Promise<string> {
    try {
      const data = await pdf(buf);
      const text = (data.text || '').trim();
      if (!text) throw new Error('empty');
      return text;
    } catch {
      throw new BadRequestException('No se pudo extraer texto (¿PDF escaneado?)');
    }
  }
}
