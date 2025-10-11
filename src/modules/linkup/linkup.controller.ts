import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { LinkupService } from './linkup.service';
import { SearchResourcesDto, PeiResourceRequest } from './dto/linkup.dto';

@ApiTags('linkup')
@Controller('api/linkup')
export class LinkupController {
  constructor(private readonly linkupService: LinkupService) {}

  @Post('search')
  @ApiOperation({
    summary: '🔍 Buscar recursos educativos',
    description: `
**Premio Linkup (€500)** - Búsqueda en tiempo real de recursos educativos verificados.

**Sin alucinaciones de IA** - Todos los recursos son reales y actualizados.

**Tipos de recursos:**
- 📱 Apps educativas especializadas
- 🎯 Estrategias metodológicas probadas
- 🛠️ Herramientas digitales accesibles
- 📚 Artículos científicos recientes
- 🎮 Actividades interactivas

**Casos de uso:**
- Recursos específicos por diagnóstico
- Herramientas por curso académico
- Adaptaciones curriculares
- Apoyo familiar
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Recursos encontrados',
    schema: {
      example: [
        {
          title: 'Focus Apps - Aplicaciones para mejorar la concentración',
          description: 'Colección de apps específicamente diseñadas para estudiantes con TDAH...',
          url: 'https://focusapps.edu/tdah-concentration',
          category: 'app',
          relevance: 0.95,
          source: 'linkup',
          publishedAt: '2025-01-15T10:00:00.000Z',
        },
        {
          title: 'Estrategias de autorregulación para primaria',
          description: 'Guía completa con 25 técnicas probadas...',
          url: 'https://educacion.gob.es/estrategias-autorregulacion',
          category: 'strategy',
          relevance: 0.92,
          source: 'linkup',
        },
      ],
    },
  })
  @ApiResponse({ status: 400, description: 'Parámetros de búsqueda inválidos' })
  async searchResources(@Body() searchDto: SearchResourcesDto) {
    return this.linkupService.searchResources(searchDto);
  }

  @Get('search/:query')
  @ApiOperation({
    summary: '🔍 Búsqueda rápida por URL',
    description: 'Endpoint GET para búsquedas rápidas desde el frontend',
  })
  @ApiParam({
    name: 'query',
    description: 'Término de búsqueda',
    example: 'TDAH primaria recursos',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Número máximo de resultados',
    example: 10,
    required: false,
  })
  @ApiQuery({
    name: 'categories',
    description: 'Categorías separadas por comas',
    example: 'app,strategy,tool',
    required: false,
  })
  @ApiResponse({ status: 200, description: 'Recursos encontrados' })
  async quickSearch(
    @Param('query') query: string,
    @Query('limit') limit?: string,
    @Query('categories') categories?: string,
    @Query('grade') grade?: string,
  ) {
    const searchDto: SearchResourcesDto = {
      query: decodeURIComponent(query),
      limit: limit ? parseInt(limit, 10) : undefined,
      categories: categories ? categories.split(',') : undefined,
      grade,
    };

    return this.linkupService.searchResources(searchDto);
  }

  @Post('pei/:id/resources')
  @ApiOperation({
    summary: '🧠 Generar recursos automáticos para PEI',
    description: `
**Funcionalidad estrella** - Genera recursos educativos personalizados automáticamente.

**Proceso inteligente:**
1. 📋 Analiza objetivos del PEI
2. 🔍 Genera búsquedas específicas
3. 🎯 Filtra por relevancia
4. 📊 Categoriza resultados
5. 💾 Guarda en base de datos

**Categorías automáticas:**
- 📱 Apps específicas para NEE identificadas
- 🎯 Estrategias para objetivos del PEI
- 🛠️ Herramientas para adaptaciones
- 📚 Artículos sobre diagnóstico
- 🎮 Actividades para el aula

**Resultado:** 20-50 recursos verificados y categorizados
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 201,
    description: 'Recursos generados y categorizados',
    schema: {
      example: {
        apps: [
          {
            title: 'Focus Timer Pro',
            description: 'Timer visual para estudiantes con TDAH',
            url: 'https://focustimer.com',
            category: 'app',
            relevance: 0.95,
          },
        ],
        strategies: [
          {
            title: 'Técnicas de autorregulación',
            description: 'Estrategias probadas para autocontrol',
            url: 'https://strategies.edu',
            category: 'strategy',
            relevance: 0.92,
          },
        ],
        tools: [],
        articles: [],
        activities: [],
        general: [],
        total: 25,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'PEI no encontrado' })
  async generatePeiResources(
    @Param('id') peiId: string,
    @Body() request: PeiResourceRequest = {},
  ) {
    return this.linkupService.generatePeiResources(peiId, request);
  }

  @Get('pei/:id/resources')
  @ApiOperation({
    summary: '📚 Obtener recursos de PEI',
    description: `
Obtiene recursos educativos ya generados para un PEI específico.

**Si no existen recursos:** Los genera automáticamente.

**Organización:**
- Por categorías (apps, estrategias, herramientas...)
- Ordenados por relevancia
- Con enlaces directos verificados
- Información de actualización

**Para el frontend:** Perfecto para mostrar sección "Recursos Recomendados"
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID único del PEI',
    example: 'clxxxxx',
  })
  @ApiResponse({
    status: 200,
    description: 'Recursos categorizados del PEI',
    schema: {
      example: {
        apps: [
          {
            id: 'clxxxxx',
            title: 'Focus Apps Collection',
            description: 'Apps para mejorar concentración',
            url: 'https://focusapps.edu',
            category: 'app',
            relevance: 0.95,
            createdAt: '2025-10-11T14:50:00.000Z',
          },
        ],
        strategies: [
          {
            id: 'clyyyyy',
            title: 'Autorregulación en primaria',
            description: 'Técnicas de autocontrol para niños',
            url: 'https://autoregulacion.edu',
            category: 'strategy',
            relevance: 0.90,
            createdAt: '2025-10-11T14:50:00.000Z',
          },
        ],
        tools: [],
        articles: [],
        activities: [],
        general: [],
        total: 18,
      },
    },
  })
  async getPeiResources(@Param('id') peiId: string) {
    return this.linkupService.getPeiResources(peiId);
  }
}