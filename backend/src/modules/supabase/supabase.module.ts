import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { DatabaseService } from './database.service';

@Module({
  providers: [SupabaseService, DatabaseService],
  exports: [SupabaseService, DatabaseService],
})
export class SupabaseModule {}

