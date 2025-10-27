import { Module } from '@nestjs/common';
import { PeiController } from './pei.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { ExtractModule } from '../extract/extract.module';
import { LlmModule } from '../llm/llm.module';
import { RenderModule } from '../render/render.module';

@Module({
  imports: [SupabaseModule, ExtractModule, LlmModule, RenderModule],
  controllers: [PeiController],
})
export class PeiModule {}
