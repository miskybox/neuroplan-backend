import { Module } from '@nestjs/common';
import { PeisController } from './peis.controller';
import { PeisService } from './peis.service';
import { PeiStreamService } from './pei-stream.service';
import { PeiGeneratorService } from './pei-generator.service';
import { LlmModule } from '../../llm/llm.module';
import { AuthModule } from '../auth/auth.module';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [LlmModule, AuthModule, SupabaseModule],
  controllers: [PeisController],
  providers: [PeisService, PeiStreamService, PeiGeneratorService],
  exports: [PeisService, PeiGeneratorService],
})
export class PeisModule {}
