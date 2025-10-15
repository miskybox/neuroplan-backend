import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`
🚀 NeuroPlan AI Campus - MVP iniciado

🌐 API: http://localhost:${port}
 Modo: ${process.env.NODE_ENV || 'development'}

✅ Sistema profesional configurado:
   - Autenticación JWT
   - Control de acceso por roles (ADMIN, ORIENTADOR, PROFESOR, DIRECTOR_CENTRO, FAMILIA)
   - Multi-tenancy
   - Validación estricta
   - Headers de seguridad
   - Auditoría de acciones

🎯 Listo para presentar al Ayuntamiento
  `);
}

bootstrap();