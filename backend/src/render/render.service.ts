import { Injectable, BadRequestException } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import puppeteer from 'puppeteer';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class RenderService {
  constructor(private readonly supa: SupabaseService) {}

  private async renderHtml(pei: any) {
  const tplPath = path.join(process.cwd(), 'src', 'render', 'pei.template.html');
  const src = await fs.readFile(tplPath, 'utf8');
  const tpl = Handlebars.compile(src);
  return tpl(pei);
  }

  private async htmlToPdfBuffer(html: string) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buf = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();
    return buf;
  }

  private async uploadPdf(buf: Buffer, userId: string) {
    const key = `peis/${userId}/${Date.now()}.pdf`;
    const cli = this.supa.get();
    const { error } = await cli.storage.from(process.env.SUPABASE_PEIS_BUCKET).upload(key, buf, {
      contentType: 'application/pdf'
    });
    if (error) throw new BadRequestException(error.message);
    const ttl = Number(process.env.SIGNED_URL_TTL_SECONDS || 3600);
    const { data, error: e2 } = await cli.storage.from(process.env.SUPABASE_PEIS_BUCKET).createSignedUrl(key, ttl);
    if (e2) throw new BadRequestException(e2.message);
    return { key, pdfUrl: data.signedUrl };
  }

  async renderAndUpload(userId: string, pei: any) {
    const html = await this.renderHtml(pei);
    const pdf = await this.htmlToPdfBuffer(html);
    const pdfBuffer = Buffer.from(pdf);
    return this.uploadPdf(pdfBuffer, userId);
  }
}
