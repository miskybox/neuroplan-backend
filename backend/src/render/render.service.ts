import { Injectable, BadRequestException } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import puppeteer from 'puppeteer';
import { SupabaseService } from '../modules/supabase/supabase.service';

@Injectable()
export class RenderService {
  constructor(private readonly supa: SupabaseService) {}

  async renderHtml(pei: any): Promise<string> {
    const tplPath = path.join(process.cwd(), 'src', 'render', 'pei.template.hbs');
    const src = await fs.readFile(tplPath, 'utf8');
    const tpl = Handlebars.compile(src);
    return tpl(pei);
  }

  async htmlToPdfBuffer(html: string): Promise<Buffer> {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    // Puppeteer puede devolver Uint8Array, forzamos a Buffer
    const buf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return Buffer.from(buf);
  }

  async uploadPdfToSupabase(userId: string, buf: Buffer) {
    const bucketName = process.env.SUPABASE_PEIS_BUCKET;
    if (!bucketName) {
      throw new BadRequestException('SUPABASE_PEIS_BUCKET no está configurado');
    }
    
    const key = `peis/${userId}/${Date.now()}.pdf`;
    const cli = this.supa.getClient();
    const { error } = await cli.storage.from(bucketName).upload(key, buf, {
      contentType: 'application/pdf'
    });
    if (error) throw new BadRequestException(error.message);
    const ttl = Number(process.env.SIGNED_URL_TTL_SECONDS || 3600);
    const { data, error: signErr } = await cli
      .storage.from(bucketName).createSignedUrl(key, ttl);
    if (signErr) throw new BadRequestException(signErr.message);
    return { key, pdfUrl: data.signedUrl };
  }
}
