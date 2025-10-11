import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración CORS para hackathon
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite React
      'http://localhost:3000', // React Dev Server
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Pipe global de validación
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
    .setTitle('NeuroPlan API')
    .setDescription(`
🧠 **NeuroPlan Backend API**

API para la generación automática de Planes Educativos Individualizados (PEIs) con IA.

**Hackathon Barcelona 2025 - Multi-Premio Strategy**

## 🎯 Funcionalidades Core:
- 📄 Upload y procesamiento de informes médicos/psicopedagógicos
- 🤖 Generación automática de PEIs con Claude AI
- 🔊 Conversión texto-a-voz con ElevenLabs
- 📚 Búsqueda de recursos educativos con Linkup
- ⚙️ Automatización de workflows con n8n

## 🏆 Integraciones Ganadoras:
- **ElevenLabs** ($2000): Text-to-speech accesible
- **Linkup** (€500): Recursos educativos verificados  
- **n8n** (€500 + €600/año): Automatización completa
- **Norrsken**: Impacto social en educación inclusiva
    `)
    .setVersion('1.0')
    .addTag('peis', 'Gestión de Planes Educativos Individualizados')
    .addTag('elevenlabs', 'Conversión texto-a-voz')
    .addTag('linkup', 'Búsqueda de recursos educativos')
    .addTag('n8n', 'Automatización de workflows')
    .addTag('uploads', 'Gestión de archivos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'NeuroPlan API Docs',
    customfavIcon: '🧠',
    customCss: '.swagger-ui .topbar { display: none }',
  });

  // Configurar puerto desde variables de entorno
  const port = process.env.PORT || 3001;
  
  await app.listen(port);
  
  console.log(`
🚀 NeuroPlan Backend iniciado correctamente!

🌐 Servidor: http://localhost:${port}
📚 API Docs: http://localhost:${port}/api/docs
🧠 Modo: ${process.env.NODE_ENV || 'development'}
🎯 Hackathon Mode: ${process.env.HACKATHON_MODE === 'true' ? '✅ ACTIVADO' : '❌ Desactivado'}

🏆 Integraciones configuradas:
${process.env.ELEVENLABS_API_KEY?.startsWith('tu_') ? '🔊 ElevenLabs: ⚠️  Pendiente configurar API key' : '🔊 ElevenLabs: ✅ Configurado'}
${process.env.LINKUP_API_KEY?.startsWith('tu_') ? '📚 Linkup: ⚠️  Pendiente configurar API key' : '📚 Linkup: ✅ Configurado'}
${process.env.N8N_WEBHOOK_URL?.startsWith('https://tu-') ? '⚙️  n8n: ⚠️  Pendiente configurar webhook' : '⚙️  n8n: ✅ Configurado'}

¡Listos para ganar el hackathon! 🎯
  `);
}

bootstrap();