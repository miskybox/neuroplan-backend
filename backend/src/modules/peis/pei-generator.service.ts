import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../supabase/database.service';
import { GeneratePeiDto } from './dto/generate-pei.dto';
import { LlmService } from '../../llm/llm.service';

@Injectable()
export class PeiGeneratorService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly llmService: LlmService,
  ) {}

  async generatePei(generatePeiDto: GeneratePeiDto, userId: string) {
    // 1. Obtener información del estudiante
    const { data: student } = await this.databaseService.getClient()
      .from('students')
      .select('*')
      .eq('id', generatePeiDto.studentId)
      .eq('created_by', userId)
      .single();

    if (!student) {
      throw new Error('Estudiante no encontrado');
    }

    // 2. Generar objetivos SMART con IA
    const smartObjectives = await this.generateSmartObjectives(generatePeiDto);

    // 3. Generar adaptaciones curriculares
    const adaptations = await this.generateAdaptations(generatePeiDto);

    // 4. Generar plan de evaluación
    const evaluationPlan = await this.generateEvaluationPlan(generatePeiDto);

    // 5. Guardar el PEI en la base de datos
    const peiData = {
      student_id: generatePeiDto.studentId,
      created_by: userId,
      diagnosis: generatePeiDto.diagnosis,
      academic_level: generatePeiDto.academicLevel,
      smart_objectives: smartObjectives,
      adaptations: adaptations,
      evaluation_plan: evaluationPlan,
      created_at: new Date().toISOString(),
      status: 'active',
    };

    const { data: pei, error } = await this.databaseService.getClient()
      .from('peis')
      .insert(peiData)
      .select()
      .single();

    if (error) {
      throw new Error(`Error al guardar PEI: ${error.message}`);
    }

    return pei;
  }

  private async generateSmartObjectives(dto: GeneratePeiDto) {
    const prompt = `
    Genera 3-5 objetivos SMART (Específicos, Medibles, Alcanzables, Relevantes y con Tiempo definido) 
    para un estudiante con las siguientes características:
    - Edad: ${dto.age} años
    - Nivel académico: ${dto.academicLevel}
    - Diagnóstico: ${dto.diagnosis}
    - Fortalezas: ${dto.strengths?.join(', ') || 'No especificadas'}
    - Áreas de mejora: ${dto.areasToImprove?.join(', ') || 'No especificadas'}
    - Intereses: ${dto.interests?.join(', ') || 'No especificados'}
    
    Formato de respuesta: Array JSON de objetivos, cada uno con:
    - description: Descripción del objetivo
    - timeframe: Periodo para lograrlo (semanas/meses)
    - evaluation_criteria: Cómo se medirá el éxito
    `;

    const response = await this.llmService.generateText(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return [
        {
          description: 'Mejorar habilidades de atención',
          timeframe: '3 meses',
          evaluation_criteria: 'Completar tareas sin distracciones por 15 minutos',
        },
      ];
    }
  }

  private async generateAdaptations(dto: GeneratePeiDto) {
    const prompt = `
    Genera adaptaciones curriculares para un estudiante con las siguientes características:
    - Edad: ${dto.age} años
    - Nivel académico: ${dto.academicLevel}
    - Diagnóstico: ${dto.diagnosis}
    
    Formato de respuesta: Array JSON de adaptaciones, cada una con:
    - subject: Asignatura
    - adaptation_type: Tipo de adaptación (metodológica, de contenido, de evaluación)
    - description: Descripción detallada
    `;

    const response = await this.llmService.generateText(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return [
        {
          subject: 'Matemáticas',
          adaptation_type: 'Metodológica',
          description: 'Utilizar material concreto y visual para explicar conceptos abstractos',
        },
      ];
    }
  }

  private async generateEvaluationPlan(dto: GeneratePeiDto) {
    const prompt = `
    Genera un plan de evaluación y seguimiento para un estudiante con las siguientes características:
    - Edad: ${dto.age} años
    - Nivel académico: ${dto.academicLevel}
    - Diagnóstico: ${dto.diagnosis}
    
    Formato de respuesta: Array JSON con elementos del plan, cada uno con:
    - evaluation_area: Área a evaluar
    - frequency: Frecuencia de evaluación
    - methods: Métodos de evaluación
    - responsible: Responsable del seguimiento
    `;

    const response = await this.llmService.generateText(prompt);
    try {
      return JSON.parse(response);
    } catch (e) {
      console.error('Error parsing AI response:', e);
      return [
        {
          evaluation_area: 'Progreso académico',
          frequency: 'Mensual',
          methods: 'Revisión de tareas y evaluaciones',
          responsible: 'Profesor y orientador',
        },
      ];
    }
  }
}