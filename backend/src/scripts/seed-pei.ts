import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PeiRepo } from '../pei/pei.repo';
import { SupabaseService } from '../supabase/supabase.service';

(async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const supabaseService = app.get(SupabaseService);
  const repo = new PeiRepo(supabaseService);

  const pei = {
    student: { firstName: 'Lucía', lastName: 'García', grade: '4º Primaria' },
    assessment: { summary: 'Dificultades en atención sostenida.' },
    goals: [{ area: 'Atención', target: 'Mejorar concentración', timeline: '3 meses' }],
    supports: ['Refuerzo individual', 'Tiempo adicional en exámenes'],
    plan: { actions: ['Ejercicios de atención 10 min/día'] },
    meta: { generatedAt: new Date().toISOString() }
  };

  const row = await repo.createPei('eva_sisalli', pei);
  console.log('✅ PEI creado:', row.id);
  await app.close();
})();
