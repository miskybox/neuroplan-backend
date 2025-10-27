import { Module } from '@nestjs/common';
import { RenderService } from './render.service';
import { SupabaseModule } from '../supabase/supabase.module';
@Module({
  imports: [SupabaseModule],
  providers: [RenderService],
  exports: [RenderService],
})
export class RenderModule {}
