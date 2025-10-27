import { Controller, Post, UseInterceptors, UploadedFile, Body, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SupabaseService } from '../supabase/supabase.service';
import { ExtractService } from '../extract/extract.service';
import { LlmService } from '../llm/llm.service';
import { RenderService } from '../render/render.service';
import { assertValidPei } from './pei.validate';

@Controller('api')
export class PeiController {
  constructor(
    private readonly supa: SupabaseService,
    private readonly extractor: ExtractService,
    private readonly llm: LlmService,
    private readonly renderer: RenderService,
  ) {}

  @Post('reports')
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
    const { pdfUrl, key: peiKey } = await this.renderer.renderAndUpload(student?.id || 'anon', pei);

    return {
      report: { key, signedUrl: signed.signedUrl },
      pei,
      peiPdf: { key: peiKey, pdfUrl }
    };
  }
}
