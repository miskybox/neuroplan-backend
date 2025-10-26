import { Controller, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import * as path from 'node:path';
import * as fs from 'node:fs';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ 
    summary: 'Endpoint raíz',
    description: 'Verifica que el servidor está funcionando correctamente'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servidor operativo',
    schema: {
      example: {
        message: '🚀 NeuroPlan Backend API',
        version: '1.0.0',
        status: 'online',
        docs: '/api/docs',
        hackathonMode: true
      }
    }
  })
  getRoot() {
    return {
      message: '🚀 NeuroPlan Backend API',
      version: '1.0.0',
      status: 'online',
      docs: '/api/docs',
      hackathonMode: process.env.HACKATHON_MODE !== 'false',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ 
    summary: 'Health Check',
    description: 'Endpoint para verificar el estado del servidor y servicios'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Servidor saludable',
    schema: {
      example: {
        status: 'healthy',
        uptime: 123.45,
        environment: 'development',
        database: 'connected',
        apis: {
          claude: 'configured',
          aws: 'configured',
          prisma: 'connected',
        },
        timestamp: '2025-10-11T15:53:20.000Z'
      }
    }
  })
  getHealth() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      integrations: {
        aws: process.env.AWS_ACCESS_KEY_ID ? 'configured' : 'mock',
        claude: process.env.CLAUDE_API_KEY?.startsWith('sk-') ? 'configured' : 'mock',
      },
      timestamp: new Date().toISOString(),
    };
  }

  @Get('api')
  @ApiOperation({ 
    summary: 'Información de la API',
    description: 'Devuelve información general sobre los endpoints disponibles'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Información de la API',
  })
  getApiInfo() {
    return {
      name: 'NeuroPlan API',
      version: '1.0.0',
      description: 'API para generación automática de PEIs con IA',
      endpoints: {
        peis: '/api/peis',
        uploads: '/api/uploads',
        auth: '/auth',
        aws: '/aws',
        reports: '/api/reports',
      },
      documentation: '/api/docs',
      project: {
        name: 'NeuroPlan MVP',
        target: 'Ayuntamiento de Barcelona',
        technologies: ['NestJS', 'TypeScript', 'PostgreSQL', 'AWS', 'Prisma'],
      },
    };
  }

  @Get('upload')
  @ApiOperation({ 
    summary: 'Página de Upload',
    description: 'Sirve la página HTML para subir informes y generar PEIs'
  })
  serveUploadPage(@Res() res: Response) {
    // Usar process.cwd() para obtener la raíz del proyecto
    const htmlPath = path.join(process.cwd(), 'upload.html');
    
    if (fs.existsSync(htmlPath)) {
      return res.sendFile(htmlPath);
    } else {
      return res.status(404).json({ 
        error: 'Página no encontrada',
        message: `El archivo upload.html no existe en: ${htmlPath}`
      });
    }
  }
}
