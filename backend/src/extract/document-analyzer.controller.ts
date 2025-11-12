import { Controller, Post, UseGuards, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { CurrentUser } from '../modules/auth/decorators/current-user.decorator';
import { DocumentAnalyzerService } from './document-analyzer.service';

@ApiTags('document-analyzer')
@Controller('document-analyzer')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DocumentAnalyzerController {
  constructor(private readonly documentAnalyzerService: DocumentAnalyzerService) {}

  @Post('analyze')
  @ApiOperation({
    summary: 'Analizar documento PDF',
    description: 'Analiza un documento PDF y extrae información relevante usando IA',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeDocument(@UploadedFile() file: Express.Multer.File, @CurrentUser() _user: any) {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    if (file.mimetype !== 'application/pdf') {
      throw new BadRequestException('El archivo debe ser un PDF');
    }

    try {
      // Analizar el documento
      const analysisResult = await this.documentAnalyzerService.analyzeDocument(file.buffer);
      
      // Generar sugerencias para PEI
      const peiSuggestions = await this.documentAnalyzerService.generatePeiSuggestions(analysisResult);
      
      return {
        success: true,
        analysis: analysisResult,
        peiSuggestions,
      };
    } catch (error) {
      throw new BadRequestException(`Error al analizar el documento: ${error.message}`);
    }
  }
}