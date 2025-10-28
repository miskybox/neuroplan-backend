import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { testSupabaseConnection } from './db';

// Manejo de errores globales (NO tumbar el server en prod por cosas recuperables)
process.on('uncaughtException', (error) => {
  console.error('ERROR NO CAPTURADO:', error);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('PROMESA RECHAZADA NO MANEJADA:', promise, 'razon:', reason);
});

async function bootstrap(): Promise<void> {
  // 1) PROBAR SUPABASE PERO NO BLOQUEAR EL ARRANQUE (salvo modo estricto)
  const strict = String(process.env.SUPABASE_STRICT || 'false').toLowerCase() === 'true';
  console.log('🔍 Testing Supabase connection...');
  const supabaseConnected = await testSupabaseConnection();
  if (!supabaseConnected) {
    const msg = '❌ Failed to connect to Supabase. Check your configuration.';
    if (strict) {
      console.error(msg);
      process.exit(1);
    } else {
      console.warn(`${msg} (Continuing without Supabase for MVP)`);
    }
  }

  const app = await NestFactory.create(AppModule);

  // 2) Prefijo /api
  app.setGlobalPrefix('api');

  // 3) Seguridad
  app.use(helmet());

  // 4) CORS desde env o por defecto a 5173
  const origins =
    (process.env.ALLOWED_ORIGINS?.split(',').map(s => s.trim()).filter(Boolean)) ||
    ['http://localhost:5173'];
  app.enableCors({
    origin: origins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: false,
  });

  // 5) Validación
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // 6) Puerto desde env (fallback 3001)
  const port = Number(process.env.PORT || 3001);
  await app.listen(port);

  console.log('\n==============================================');
  console.log('   NeuroPlan AI Campus - Backend MVP');
  console.log('==============================================');
  console.log(`API:    http://localhost:${port}/api`);
  console.log(`Health: http://localhost:${port}/api/health`);
  console.log(`Modo:   ${process.env.NODE_ENV || 'development'}`);
  console.log(`CORS:   ${origins.join(', ')}`);
}

(async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.error('Error al iniciar la aplicacion:', error);
    process.exit(1);
  }
})();
