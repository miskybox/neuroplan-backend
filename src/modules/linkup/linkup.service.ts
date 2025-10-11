import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { SearchResourcesDto, PeiResourceRequest } from './dto/linkup.dto';
import axios from 'axios';

@Injectable()
export class LinkupService {
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.linkup.so/v1';

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.apiKey = this.configService.get<string>('LINKUP_API_KEY');
    
    if (!this.apiKey || this.apiKey.startsWith('tu_')) {
      console.warn('⚠️  Linkup API key no configurada. Usando modo mock para hackathon.');
    }
  }

  /**
   * Busca recursos educativos en tiempo real
   */
  async searchResources(dto: SearchResourcesDto) {
    // Modo mock para hackathon si no hay API key
    if (!this.apiKey || this.apiKey.startsWith('tu_')) {
      return this.generateMockResources(dto);
    }

    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        params: {
          q: dto.query,
          limit: dto.limit || 20,
          categories: dto.categories?.join(','),
          grade: dto.grade,
        },
      });

      return this.formatLinkupResponse(response.data);
    } catch (error: any) {
      console.error('Error en Linkup API:', error.response?.data || error.message);
      
      // Fallback a recursos mock si falla la API
      return this.generateMockResources(dto);
    }
  }

  /**
   * Genera recursos automáticos para un PEI específico
   */
  async generatePeiResources(peiId: string, request: PeiResourceRequest = {}) {
    // Obtener PEI con datos completos
    const pei = await this.prisma.pEI.findUnique({
      where: { id: peiId },
      include: {
        student: true,
      },
    });

    if (!pei) {
      throw new BadRequestException('PEI no encontrado');
    }

    // Parsear objetivos y adaptaciones
    const objectives = JSON.parse(pei.objectives);
    const adaptations = JSON.parse(pei.adaptations);

    // Generar búsquedas específicas
    const searchQueries = this.generateSearchQueries(pei, objectives, adaptations, request);

    // Buscar recursos para cada consulta
    const allResources = [];
    
    for (const searchQuery of searchQueries) {
      const resources = await this.searchResources({
        query: searchQuery.query,
        categories: searchQuery.categories,
        grade: pei.student.grade,
        limit: 10,
      });

      // Añadir contexto de relevancia
      const enrichedResources = resources.map((resource: any) => ({
        ...resource,
        context: searchQuery.context,
        relevanceScore: this.calculateRelevance(resource, searchQuery),
      }));

      allResources.push(...enrichedResources);
    }

    // Ordenar por relevancia y eliminar duplicados
    const uniqueResources = this.deduplicateResources(allResources);
    uniqueResources.sort((a, b) => b.relevanceScore - a.relevanceScore);
    const sortedResources = uniqueResources.slice(0, 50); // Top 50 recursos

    // Guardar recursos en base de datos
    await this.saveResourcesToPei(peiId, sortedResources);

    // Log de actividad
    await this.prisma.activityLog.create({
      data: {
        action: 'generate_resources',
        entity: 'resources',
        entityId: peiId,
        details: JSON.stringify({
          peiId,
          resourceCount: sortedResources.length,
          searchQueries: searchQueries.length,
        }),
      },
    });

    return this.categorizeResources(sortedResources);
  }

  /**
   * Obtiene recursos guardados para un PEI
   */
  async getPeiResources(peiId: string) {
    const savedResources = await this.prisma.resourceLink.findMany({
      where: { peiId },
      orderBy: { relevance: 'desc' },
    });

    if (savedResources.length === 0) {
      // Generar recursos automáticamente si no existen
      return this.generatePeiResources(peiId);
    }

    return this.categorizeResources(savedResources);
  }

  /**
   * Genera consultas de búsqueda específicas para un PEI
   */
  private generateSearchQueries(pei: any, objectives: any[], adaptations: any[], request: PeiResourceRequest) {
    const queries = [];

    // Búsqueda general basada en diagnóstico
    queries.push({
      query: `${pei.diagnosis.split('.')[0]} recursos educativos ${pei.student.grade}`,
      categories: ['app', 'strategy', 'tool'],
      context: 'general',
    });

    // Búsquedas específicas por objetivos
    if (request.includeObjectives !== false) {
      objectives.forEach((objective: any) => {
        queries.push({
          query: `${objective.area} ${objective.title} actividades educativas`,
          categories: ['app', 'activity'],
          context: 'objective',
        });
      });
    }

    // Búsquedas por adaptaciones
    if (request.includeTools !== false) {
      adaptations.forEach((adaptation: any) => {
        if (adaptation.type === 'access' || adaptation.type === 'methodology') {
          queries.push({
            query: `${adaptation.description} herramientas digitales`,
            categories: ['tool', 'app'],
            context: 'adaptation',
          });
        }
      });
    }

    // Búsquedas por estrategias
    if (request.includeStrategies !== false) {
      queries.push(
        {
          query: `atención concentración técnicas estudiantes ${pei.student.grade}`,
          categories: ['strategy', 'method'],
          context: 'attention',
        },
        {
          query: `motivación escolar refuerzo positivo`,
          categories: ['strategy', 'tool'],
          context: 'motivation',
        }
      );
    }

    return queries;
  }

  /**
   * Calcula relevancia de un recurso para una búsqueda específica
   */
  private calculateRelevance(resource: any, searchQuery: any): number {
    let score = resource.relevance || 0.5;

    // Bonificaciones por contexto
    if (searchQuery.context === 'general') score += 0.1;
    if (searchQuery.context === 'objective') score += 0.2;
    if (searchQuery.context === 'adaptation') score += 0.15;

    // Bonificaciones por categoría
    if (searchQuery.categories.includes(resource.category)) score += 0.1;

    // Bonificaciones por título/descripción relevante
    const keywords = ['tdah', 'dislexia', 'autismo', 'educativo', 'primaria', 'infantil'];
    const text = (resource.title + ' ' + resource.description).toLowerCase();
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) score += 0.05;
    });

    return Math.min(score, 1.0); // Máximo 1.0
  }

  /**
   * Elimina recursos duplicados
   */
  private deduplicateResources(resources: any[]) {
    const seen = new Set();
    return resources.filter(resource => {
      const key = resource.url || resource.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  /**
   * Categoriza recursos por tipo
   */
  private categorizeResources(resources: any[]) {
    return {
      apps: resources.filter(r => r.category === 'app'),
      strategies: resources.filter(r => r.category === 'strategy'),
      tools: resources.filter(r => r.category === 'tool'),
      articles: resources.filter(r => r.category === 'article'),
      activities: resources.filter(r => r.category === 'activity'),
      general: resources.filter(r => !['app', 'strategy', 'tool', 'article', 'activity'].includes(r.category)),
      total: resources.length,
    };
  }

  /**
   * Guarda recursos en base de datos vinculados al PEI
   */
  private async saveResourcesToPei(peiId: string, resources: any[]) {
    // Eliminar recursos anteriores
    await this.prisma.resourceLink.deleteMany({
      where: { peiId },
    });

    // Insertar nuevos recursos
    for (const resource of resources.slice(0, 30)) { // Máximo 30 recursos
      await this.prisma.resourceLink.create({
        data: {
          title: resource.title,
          description: resource.description || '',
          url: resource.url,
          category: resource.category,
          relevance: resource.relevanceScore,
          peiId,
        },
      });
    }
  }

  /**
   * Formatea respuesta de Linkup API
   */
  private formatLinkupResponse(data: any) {
    if (!data.results) return [];

    return data.results.map((result: any) => ({
      title: result.title,
      description: result.snippet || result.description,
      url: result.url,
      category: this.inferCategory(result),
      relevance: result.score || 0.7,
      source: 'linkup',
      publishedAt: result.published_at,
    }));
  }

  /**
   * Infiere categoría a partir del contenido
   */
  private inferCategory(result: any): string {
    const text = (result.title + ' ' + (result.snippet || '')).toLowerCase();

    if (text.includes('app') || text.includes('aplicación')) return 'app';
    if (text.includes('estrategia') || text.includes('método')) return 'strategy';
    if (text.includes('herramienta') || text.includes('recurso')) return 'tool';
    if (text.includes('actividad') || text.includes('ejercicio')) return 'activity';
    if (text.includes('artículo') || text.includes('investigación')) return 'article';

    return 'general';
  }

  /**
   * Genera recursos mock para desarrollo
   */
  private generateMockResources(dto: SearchResourcesDto) {
    const baseResources = [
      {
        title: 'Focus Apps - Aplicaciones para mejorar la concentración',
        description: 'Colección de apps específicamente diseñadas para estudiantes con TDAH. Incluye temporizadores visuales, técnicas de respiración y juegos de atención.',
        url: 'https://focusapps.edu/tdah-concentration',
        category: 'app',
        relevance: 0.95,
        source: 'mock',
      },
      {
        title: 'Estrategias de autorregulación para primaria',
        description: 'Guía completa con 25 técnicas probadas para ayudar a estudiantes de primaria a desarrollar habilidades de autocontrol y organización.',
        url: 'https://educacion.gob.es/estrategias-autorregulacion',
        category: 'strategy',
        relevance: 0.92,
        source: 'mock',
      },
      {
        title: 'Calculadora visual con apoyo paso a paso',
        description: 'Herramienta digital que descompone operaciones matemáticas en pasos visuales, ideal para estudiantes con dificultades en matemáticas.',
        url: 'https://mathsupport.com/calculadora-visual',
        category: 'tool',
        relevance: 0.88,
        source: 'mock',
      },
      {
        title: 'Actividades de mindfulness para el aula',
        description: 'Banco de 50 actividades de mindfulness adaptadas para niños de 6-12 años, con instrucciones paso a paso y recursos imprimibles.',
        url: 'https://mindfulschools.org/actividades-primaria',
        category: 'activity',
        relevance: 0.85,
        source: 'mock',
      },
      {
        title: 'Agenda visual personalizable',
        description: 'App que permite crear agendas visuales personalizadas con pictogramas, recordatorios y seguimiento de tareas para estudiantes con NEE.',
        url: 'https://visualplanner.edu/agenda-nee',
        category: 'app',
        relevance: 0.90,
        source: 'mock',
      },
      {
        title: 'Técnicas de lectura adaptada',
        description: 'Conjunto de estrategias metodológicas para adaptar textos y mejorar la comprensión lectora en estudiantes con dificultades.',
        url: 'https://lecturafacil.org/tecnicas-adaptacion',
        category: 'strategy',
        relevance: 0.87,
        source: 'mock',
      },
      {
        title: 'Timer visual con sonidos relajantes',
        description: 'Cronómetro visual que ayuda a gestionar el tiempo de trabajo con efectos visuales motivadores y sonidos de la naturaleza.',
        url: 'https://visualtimer.com/relax-edition',
        category: 'tool',
        relevance: 0.83,
        source: 'mock',
      },
      {
        title: 'Juegos de memoria y atención',
        description: 'Plataforma con más de 100 juegos diseñados por neuropsicólogos para entrenar memoria de trabajo y atención sostenida.',
        url: 'https://cognitivetraining.com/atencion-memoria',
        category: 'app',
        relevance: 0.91,
        source: 'mock',
      },
    ];

    // Filtrar por consulta
    const query = dto.query.toLowerCase();
    const filtered = baseResources.filter(resource => 
      resource.title.toLowerCase().includes(query) ||
      resource.description.toLowerCase().includes(query) ||
      query.split(' ').some(term => 
        resource.title.toLowerCase().includes(term) ||
        resource.description.toLowerCase().includes(term)
      )
    );

    // Aplicar filtros de categoría
    const categoryFiltered = dto.categories && dto.categories.length > 0
      ? filtered.filter(resource => dto.categories.includes(resource.category))
      : filtered;

    // Limitar resultados
    return categoryFiltered.slice(0, dto.limit || 20);
  }
}