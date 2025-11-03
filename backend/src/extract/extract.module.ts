import { Module } from '@nestjs/common';
import { ExtractService } from './extract.service';
import { DocumentAnalyzerService } from './document-analyzer.service';
import { DocumentAnalyzerController } from './document-analyzer.controller';
import { LlmModule } from '../llm/llm.module';

@Module({
  imports: [LlmModule],
  controllers: [DocumentAnalyzerController],
  providers: [ExtractService, DocumentAnalyzerService],
  exports: [ExtractService, DocumentAnalyzerService],
})
export class ExtractModule {}
