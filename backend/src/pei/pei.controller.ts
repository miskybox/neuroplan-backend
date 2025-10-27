import { Body, Controller, Post, Res, UploadedFile, BadRequestException, UseInterceptors, Get } from '@nestjs/common';
import { Response } from 'express';
import { SupabaseService } from '../supabase/supabase.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExtractService } from '../extract/extract.service';
import { LlmService } from '../llm/llm.service';
import { RenderService } from '../render/render.service';
import { assertValidPei } from './pei.validate';

@Controller()
export class PeiController {
  constructor(
    private readonly supa: SupabaseService,
    private readonly extractor: ExtractService,
    private readonly llm: LlmService,
    private readonly renderer: RenderService,
  ) {}

  @Post('api/reports')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: Number(process.env.MAX_FILE_SIZE || 10_485_760) } }))
  async uploadReport(
    @UploadedFile() file: Express.Multer.File,
    @Body('student') studentJson: string,
    @Body('context') context?: string,
  ) {
    if (!file) throw new BadRequestException('Falta archivo PDF');
    if (file.mimetype !== 'application/pdf') throw new BadRequestException('Solo PDF');

    const student = typeof studentJson === 'string' ? JSON.parse(studentJson) : studentJson;

    // 1) Subir reporte a Supabase
    const cli = this.supa.get();
    const key = `reports/${student?.id || 'anon'}/${Date.now()}.pdf`;
    const up = await cli.storage.from(process.env.SUPABASE_REPORTS_BUCKET).upload(key, file.buffer, {
      contentType: file.mimetype,
    });
    if (up.error) throw new BadRequestException(up.error.message);
    const { data: signed, error: signErr } =
      await cli.storage.from(process.env.SUPABASE_REPORTS_BUCKET).createSignedUrl(key, Number(process.env.SIGNED_URL_TTL_SECONDS||3600));
    if (signErr) throw new BadRequestException(signErr.message);

    // 2) Extraer texto del PDF
    const text = await this.extractor.fromPdfBuffer(file.buffer);

    // 3) LLM → PEI JSON
    const pei = await this.llm.peiFromText(student, text, context || '');

    // 4) Validar contra schema
    assertValidPei(pei);

    // 5) Render → PDF y subir a Supabase
    const { pdfUrl, key: peiKey } = await this.renderer.uploadPdfToSupabase(
      student?.id || 'anon',
      await this.renderer.renderHtml(pei).then(html => this.renderer.htmlToPdfBuffer(html))
    );

    return {
      report: { key, signedUrl: signed.signedUrl },
      pei,
      peiPdf: { key: peiKey, pdfUrl }
    };
  }

  // Alias para compatibilidad con frontend alternativo
  @Post('uploads/pdf-analysis')
  @UseInterceptors(FileInterceptor('pdf', { limits: { fileSize: Number(process.env.MAX_FILE_SIZE || 10_485_760) } }))
  async uploadPdfAnalysis(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
  ) {
    if (!file) throw new BadRequestException('Falta archivo PDF');
    if (file.mimetype !== 'application/pdf') throw new BadRequestException('Solo PDF');

    // Extraer texto
    const text = await this.extractor.fromPdfBuffer(file.buffer);
    // LLM → análisis
    const analysis = await this.llm.peiFromText({}, text, body?.context || '');
    // Render PDF editable
    const html = await this.renderer.renderHtml(analysis);
    const pdfBuffer = await this.renderer.htmlToPdfBuffer(html);
    // Opcional: subir a Supabase
    // const { pdfUrl } = await this.renderer.uploadPdfToSupabase('anon', pdfBuffer);

    // Devolver análisis y PDF en base64
    return {
      success: true,
      data: {
        analysis,
        reportPdf: {
          base64: pdfBuffer.toString('base64'),
          filename: 'informe.pdf',
        },
      },
    };
  }

  // Endpoint /health
  @Get('health')
  health() {
    return { status: 'ok', message: 'Servidor funcionando correctamente' };
  }

  // 1) PREVIEW: devuelve HTML (para iframe/srcDoc)
  @Post('peis/preview')
  async preview(@Body() body: { pei: any }, @Res() res: Response) {
    const pei = body.pei;
    // assertValidPei(pei); // opcional
    const html = await this.renderer.renderHtml(pei);
    res.set('Content-Type', 'text/html; charset=utf-8');
    // Evita que se embeba desde orígenes no permitidos (ajusta según tu front):
    res.set('X-Frame-Options', 'SAMEORIGIN');
    return res.status(200).send(html);
  }

  // 2) PDF: genera y sube a Supabase; devuelve pdfUrl
  @Post('peis/pdf')
  async pdf(@Body() body: { pei: any; userId?: string }) {
    const pei = body.pei;
    // assertValidPei(pei); // opcional
    const html = await this.renderer.renderHtml(pei);
    const buf = await this.renderer.htmlToPdfBuffer(html);
    const { pdfUrl } = await this.renderer.uploadPdfToSupabase(body.userId || 'anon', buf);
    return { pdfUrl };
  }
}

// Si necesitas registrar errores, puedes crear un archivo backend/error.log y usar un logger en producción.
// Ejemplo básico de logger con appendFile:
// import * as fs from 'node:fs/promises';
// async function logError(message: string) {
//   await fs.appendFile('backend/error.log', `[${new Date().toISOString()}] ${message}\n`);
// }
// Llama a logError(error.message) en tus catch o en los bloques donde quieras registrar errores.

