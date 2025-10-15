import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Configuración Swagger para documentación API
  const config = new DocumentBuilder()
    .setTitle('NeuroPlan AI Campus API')
    .setDescription(`
🧠 **NeuroPlan AI Campus - Plataforma Educativa Personalizada**

API para la gestión de educación personalizada para estudiantes neurodivergentes.

## 🎯 Funcionalidades:
- 👥 Gestión de usuarios y roles (ADMIN, PROFESOR, ORIENTADOR, DIRECTOR_CENTRO)
- 🏫 Multi-tenancy por centros educativos
- 📄 Procesamiento de informes médicos/psicopedagógicos
- 🤖 Generación automática de PEIs con IA
- � Adaptación de temarios oficiales (LOMLOE)
- 🎓 Pasaporte Educativo Inteligente

## 🔒 Seguridad:
- Autenticación JWT
- RBAC (Control de acceso basado en roles)
- Multi-tenancy por centro educativo
- Auditoría completa de acciones
- Cumplimiento RGPD
    `)
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación y autorización')
    .addTag('peis', 'Planes Educativos Individualizados')
    .addTag('students', 'Gestión de estudiantes')
    .addTag('temarios', 'Temarios oficiales')
    .addTag('uploads', 'Gestión de archivos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NeuroPlan AI Campus API',
    customfavIcon: '🧠',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`
🚀 NeuroPlan AI Campus - MVP iniciado

🌐 API: http://localhost:${port}
📚 Docs: http://localhost:${port}/api/docs
🔒 Modo: ${process.env.NODE_ENV || 'development'}

✅ Sistema profesional configurado:
   - Autenticación JWT
   - Control de acceso por roles
   - Multi-tenancy
   - Validación estricta
   - Headers de seguridad
   - Auditoría de acciones

🎯 Listo para presentar al Ayuntamiento
  `);
}

bootstrap();