import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

// Capturar errores no manejados
process.on('uncaughtException', (error) => {
  console.error('ERROR NO CAPTURADO:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('PROMESA RECHAZADA NO MANEJADA:', promise, 'razon:', reason);
  process.exit(1);
});

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // ⭐ PREFIJO GLOBAL - Todas las rutas tendrán /api
  app.setGlobalPrefix('api');

  // Seguridad: Helmet para headers HTTP seguros
  app.use(helmet());

  // CORS restrictivo para producción
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Pipe global de validación estricta
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = 3001;
  await app.listen(port);

  console.log('\n==============================================');
  console.log('   NeuroPlan AI Campus - Backend MVP');
  console.log('==============================================');
  console.log(`\nAPI: http://localhost:${port}/api`);
  console.log(`Health: http://localhost:${port}/api/health`);
  console.log(`Login: http://localhost:${port}/api/auth/login`);
  console.log(`Modo: ${process.env.NODE_ENV || 'development'}\n`);
  console.log('Sistema profesional configurado:');
  console.log('- Autenticacion JWT');
  console.log('- Control de acceso por roles (ADMIN, ORIENTADOR, PROFESOR, DIRECTOR_CENTRO, FAMILIA)');
  console.log('- Multi-tenancy');
  console.log('- Validacion estricta');
  console.log('- Headers de seguridad');
  console.log('- Auditoria de acciones');
  console.log('- Prefijo global: /api\n');

  // Signal handlers para mantener el proceso vivo
  process.on('SIGTERM', async () => {
    console.log('\nRecibida senal SIGTERM - Cerrando servidor..');
    await app.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('\n\nRecibida senal SIGINT - Cerrando servidor..');
    await app.close();
    process.exit(0);
  });
}

(async () => {
  try {
    await bootstrap();
  } catch (error) {
    console.error('Error al iniciar la aplicacion:', error);
    process.exit(1);
  }
})();