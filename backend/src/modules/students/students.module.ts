import { Module } from '@nestjs/common';
import { StudentsController } from './students.controller';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [StudentsController],
})
export class StudentsModule {}
