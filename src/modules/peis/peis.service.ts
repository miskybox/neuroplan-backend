import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { GeneratePeiFromReportDto } from './dto/create-pei.dto';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';

@Injectable()
export class PeisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Genera un PEI completo desde diagnóstico directo (para frontend)
   */
  async generatePeiFromDiagnosis(diagnosisData: {
    studentId: string;
    diagnosis: string[];
    symptoms?: string[];
    strengths?: string[];
    additionalNotes?: string;
  }) {
    // 1. Validar que el estudiante existe
    const student = await this.prisma.student.findUnique({
      where: { id: diagnosisData.studentId },
    });

    if (!student) {
      throw new BadRequestException('Estudiante no encontrado');
    }

    // 2. Calcular edad del estudiante
    const today = new Date();
    const birthDate = new Date(student.fechaNacimiento);
    const age = today.getFullYear() - birthDate.getFullYear();

    // 3. Preparar análisis desde el diagnóstico directo
    const analysis = {
      diagnosis: diagnosisData.diagnosis,
      symptoms: diagnosisData.symptoms || [],
      strengths: diagnosisData.strengths || [],
      additionalInfo: diagnosisData.additionalNotes || '',
      studentName: `${student.nombre} ${student.apellidos}`,
      gradeLevel: student.curso,
      age,
    };

    // 4. Generar PEI estructurado usando el método existente
    const peiData = await this.generatePeiStructure(analysis, student);

    // 5. Crear un report virtual para cumplir con el esquema
    const virtualReport = await this.prisma.report.create({
      data: {
        filename: `diagnosis-${Date.now()}.json`,
        originalName: `Diagnóstico directo - ${student.nombre} ${student.apellidos}`,
        mimeType: 'application/json',
        size: JSON.stringify(diagnosisData).length,
        path: `/virtual/diagnosis-${Date.now()}.json`,
        extractedText: JSON.stringify(analysis),
        status: 'COMPLETED',
        processedAt: new Date(),
        studentId: diagnosisData.studentId,
      },
    });

    // 6. Crear PEI en base de datos
    const pei = await this.prisma.pEI.create({
      data: {
        resumen: peiData.summary,
        diagnostico: peiData.diagnosis,
        objetivos: JSON.stringify(peiData.objectives),
        adaptaciones: JSON.stringify(peiData.adaptations),
        estrategias: JSON.stringify(peiData.strategies),
        evaluacion: JSON.stringify(peiData.evaluation),
        cronograma: JSON.stringify(peiData.timeline),
        estado: 'BORRADOR',
        creadoPor: {
          connect: { id: 'system' }, // TODO: Usar usuario autenticado
        },
        student: {
          connect: { id: diagnosisData.studentId },
        },
        report: {
          connect: { id: virtualReport.id },
        },
      },
    });

    // 6. Log de actividad
    await this.prisma.activityLog.create({
      data: {
        accion: 'generate_pei_from_diagnosis',
        entidad: 'pei',
        entidadId: pei.id,
        detalles: JSON.stringify({
          diagnosis: diagnosisData.diagnosis,
          studentId: diagnosisData.studentId,
          method: 'direct_diagnosis',
        }),
      },
    });

    // 7. Retornar PEI con datos expandidos
    return {
      ...pei,
      objectives: JSON.parse(pei.objetivos),
      adaptations: JSON.parse(pei.adaptaciones),
      strategies: JSON.parse(pei.estrategias),
      evaluation: JSON.parse(pei.evaluacion),
      timeline: JSON.parse(pei.cronograma),
      student: {
        id: student.id,
        name: student.nombre,
        lastName: student.apellidos,
        grade: student.curso,
      },
    };
  }

  /**
   * Genera un PEI completo a partir de un informe subido
   */
  async generatePeiFromReport(dto: GeneratePeiFromReportDto) {
    // 1. Validar que el informe existe y pertenece al estudiante
    const report = await this.prisma.report.findFirst({
      where: {
        id: dto.reportId,
        studentId: dto.studentId,
      },
      include: {
        student: true,
      },
    });

    if (!report) {
      throw new BadRequestException('Informe no encontrado o no pertenece al estudiante');
    }

    // 2. Extraer texto del informe si no se ha hecho
    let extractedText = report.extractedText;
    if (!extractedText) {
      extractedText = await this.extractTextFromReport(report);
      
      // Actualizar el informe con el texto extraído
      await this.prisma.report.update({
        where: { id: report.id },
        data: { 
          extractedText,
          status: 'PROCESSING',
        },
      });
    }

    // 3. Analizar con Claude AI (mock para hackathon)
    const analysis = await this.analyzeWithClaude(extractedText, report.student);

    // 4. Generar PEI estructurado
    const peiData = await this.generatePeiStructure(analysis, report.student);

    // 5. Crear PEI en base de datos
    const pei = await this.prisma.pEI.create({
      data: {
        resumen: peiData.summary,
        diagnostico: peiData.diagnosis,
        objetivos: JSON.stringify(peiData.objectives),
        adaptaciones: JSON.stringify(peiData.adaptations),
        estrategias: JSON.stringify(peiData.strategies),
        evaluacion: JSON.stringify(peiData.evaluation),
        cronograma: JSON.stringify(peiData.timeline),
        estado: 'BORRADOR',
        creadoPor: {
          connect: { email: 'system@neuroplan.ai' }, // Usuario system
        },
        student: {
          connect: { id: dto.studentId },
        },
        report: {
          connect: { id: dto.reportId },
        },
      },
    });

    // 6. Marcar informe como completado
    await this.prisma.report.update({
      where: { id: report.id },
      data: { 
        status: 'COMPLETED',
        processedAt: new Date(),
      },
    });

    // 7. Log de actividad
    await this.prisma.activityLog.create({
      data: {
        accion: 'generate_pei',
        entidad: 'pei',
        entidadId: pei.id,
        detalles: JSON.stringify({
          studentId: dto.studentId,
          reportId: dto.reportId,
          objectivesCount: peiData.objectives.length,
        }),
      },
    });

    return pei;
  }

  /**
   * Extrae texto de un informe (PDF o imagen)
   */
  private async extractTextFromReport(report: any): Promise<string> {
    try {
      if (!fs.existsSync(report.path)) {
        throw new Error('Archivo no encontrado');
      }

      const fileBuffer = fs.readFileSync(report.path);

      if (report.mimeType === 'application/pdf') {
        // Extraer texto de PDF
        const data = await pdfParse(fileBuffer);
        return data.text;
      } else if (report.mimeType.startsWith('image/')) {
        // Para imágenes, simular OCR (en producción usar Tesseract o AWS Textract)
        return `[OCR simulado] Texto extraído de imagen: ${report.originalName}. 
        
Diagnóstico: TDAH combinado moderado
Edad: 12 años
Curso: 6º Primaria

Fortalezas identificadas:
- Buena comprensión verbal
- Creatividad alta
- Habilidades sociales positivas

Dificultades observadas:
- Atención sostenida reducida (5-10 minutos)
- Impulsividad en tareas académicas
- Dificultades en organización temporal
- Problemas de memoria de trabajo

Recomendaciones:
- Pausas frecuentes cada 15 minutos
- Instrucciones cortas y precisas
- Apoyo visual para organización
- Refuerzo positivo inmediato`;
      }

      return 'Texto no extraíble del formato proporcionado';
    } catch (error) {
      console.error('Error extrayendo texto:', error);
      return 'Error en extracción de texto';
    }
  }

  /**
   * Analiza el texto extraído con Claude AI (mock para hackathon)
   */
  private async analyzeWithClaude(text: string, student: any) {
    // En producción: llamar a Claude API real
    // const claudeResponse = await this.callClaudeAPI(text, student);
    
    // Mock para hackathon - análisis estructurado
    return {
      mainDiagnosis: 'TDAH combinado moderado',
      secondaryConditions: ['Dificultades específicas de aprendizaje en matemáticas'],
      strengths: [
        'Excelente comprensión verbal',
        'Creatividad y pensamiento divergente',
        'Habilidades sociales desarrolladas',
        'Motivación hacia actividades prácticas'
      ],
      challenges: [
        'Atención sostenida limitada (5-10 minutos)',
        'Impulsividad en resolución de problemas',
        'Dificultades en organización temporal',
        'Memoria de trabajo reducida',
        'Problemas en cálculo mental'
      ],
      priorityAreas: [
        'Desarrollo de atención sostenida',
        'Estrategias de autocontrol',
        'Competencia matemática',
        'Habilidades organizativas'
      ],
      recommendedAdaptations: [
        'Tiempo adicional en evaluaciones',
        'Instrucciones fraccionadas',
        'Apoyo visual y manipulativo',
        'Pausas estructuradas',
        'Refuerzo positivo inmediato'
      ]
    };
  }

  /**
   * Genera estructura completa del PEI
   */
  private async generatePeiStructure(analysis: any, student: any) {
    const currentDate = new Date();
    const reviewDate = new Date(currentDate.getTime() + (90 * 24 * 60 * 60 * 1000)); // 3 meses

    return {
      summary: `Plan Educativo Individualizado para ${student.name} ${student.lastName}, estudiante de ${student.grade} con ${analysis.mainDiagnosis}. 
      
Este PEI establece objetivos específicos, adaptaciones curriculares y estrategias metodológicas personalizadas para maximizar su potencial académico y desarrollo personal.

Fortalezas clave: ${analysis.strengths.slice(0, 2).join(', ')}.
Áreas de mejora: ${analysis.priorityAreas.slice(0, 2).join(', ')}.

Fecha de creación: ${currentDate.toLocaleDateString('es-ES')}
Próxima revisión: ${reviewDate.toLocaleDateString('es-ES')}`,

      diagnosis: `Diagnóstico principal: ${analysis.mainDiagnosis}
      
Condiciones asociadas: ${analysis.secondaryConditions.join(', ')}

FORTALEZAS IDENTIFICADAS:
${analysis.strengths.map((s: string, i: number) => (i + 1) + '. ' + s).join('\n')}

DIFICULTADES OBSERVADAS:
${analysis.challenges.map((c: string, i: number) => (i + 1) + '. ' + c).join('\n')}

ÁREAS PRIORITARIAS DE INTERVENCIÓN:
${analysis.priorityAreas.map((a: string, i: number) => (i + 1) + '. ' + a).join('\n')}`,

      objectives: [
        {
          id: 'obj-1',
          title: 'Mejorar atención sostenida',
          description: 'Aumentar el tiempo de concentración en tareas académicas de 5-10 minutos a 20-25 minutos',
          area: 'cognitive',
          timeframe: 'medium', // 3-6 meses
          criteria: [
            'Mantiene atención en actividades dirigidas durante 15 minutos mínimo',
            'Completa tareas de 3-4 pasos sin recordatorios',
            'Utiliza estrategias de autorregulación aprendidas'
          ],
          strategies: [
            'Técnicas de mindfulness adaptadas',
            'Temporizadores visuales',
            'Pausas programadas cada 15 minutos',
            'Actividades de movimiento regulado'
          ]
        },
        {
          id: 'obj-2',
          title: 'Desarrollar competencia matemática',
          description: 'Mejorar habilidades de cálculo mental y resolución de problemas matemáticos',
          area: 'academic',
          timeframe: 'long', // 6-12 meses
          criteria: [
            'Resuelve operaciones básicas mentalmente sin apoyo',
            'Aplica estrategias de resolución de problemas paso a paso',
            'Demuestra comprensión de conceptos geométricos básicos'
          ],
          strategies: [
            'Manipulativos matemáticos',
            'Estrategias visuales para cálculo',
            'Problemas del mundo real',
            'Refuerzo positivo por proceso, no solo resultado'
          ]
        },
        {
          id: 'obj-3',
          title: 'Fortalecer habilidades organizativas',
          description: 'Desarrollar autonomía en planificación y organización de tareas escolares',
          area: 'executive',
          timeframe: 'medium',
          criteria: [
            'Utiliza agenda personal de forma independiente',
            'Organiza materiales por asignatura',
            'Planifica tiempo para deberes en casa'
          ],
          strategies: [
            'Agenda visual personalizada',
            'Rutinas estructuradas',
            'Apoyo familiar coordinado',
            'Autoevaluación semanal'
          ]
        }
      ],

      adaptations: [
        {
          type: 'access',
          description: 'Tiempo adicional en evaluaciones (25% extra)',
          subject: 'todas',
          implementation: 'Aplicar en todas las pruebas escritas y orales'
        },
        {
          type: 'methodology',
          description: 'Instrucciones fraccionadas en pasos simples',
          subject: 'todas',
          implementation: 'Dividir tareas complejas en 3-4 pasos máximo'
        },
        {
          type: 'curriculum',
          description: 'Apoyo visual y manipulativo en matemáticas',
          subject: 'matemáticas',
          implementation: 'Uso de regletas, ábacos, gráficos y esquemas'
        },
        {
          type: 'evaluation',
          description: 'Evaluación continua vs exámenes únicos',
          subject: 'todas',
          implementation: 'Valorar proceso diario, trabajos y participación'
        }
      ],

      strategies: [
        {
          area: 'classroom',
          description: 'Ubicación estratégica en el aula',
          details: 'Primera fila, cerca del profesor, lejos de distracciones'
        },
        {
          area: 'attention',
          description: 'Señales visuales para redirección',
          details: 'Contacto visual, gestos acordados, tarjetas de apoyo'
        },
        {
          area: 'motivation',
          description: 'Sistema de refuerzo positivo',
          details: 'Reconocimiento inmediato, puntos canjeables, privilegios'
        },
        {
          area: 'family',
          description: 'Coordinación familia-escuela',
          details: 'Comunicación semanal, estrategias compartidas en casa'
        }
      ],

      evaluation: {
        frequency: 'Mensual',
        criteria: [
          'Cumplimiento de objetivos específicos',
          'Progreso en áreas académicas priorizadas',
          'Desarrollo de autonomía personal',
          'Bienestar emocional y social'
        ],
        instruments: [
          'Observación directa en aula',
          'Evaluaciones adaptadas',
          'Autoevaluación del estudiante',
          'Feedback familiar'
        ],
        reviewDates: [
          reviewDate.toISOString(),
          new Date(reviewDate.getTime() + (90 * 24 * 60 * 60 * 1000)).toISOString(),
          new Date(reviewDate.getTime() + (180 * 24 * 60 * 60 * 1000)).toISOString()
        ]
      },

      timeline: {
        academicYear: '2024-2025',
        startDate: currentDate.toISOString(),
        reviewPeriods: [
          {
            period: 'Primer trimestre',
            focus: 'Establecimiento de rutinas y estrategias básicas',
            milestones: ['Adaptación a nuevas metodologías', 'Mejora inicial en atención']
          },
          {
            period: 'Segundo trimestre',
            focus: 'Consolidación de aprendizajes y autonomía',
            milestones: ['Uso independiente de estrategias', 'Progreso académico medible']
          },
          {
            period: 'Tercer trimestre',
            focus: 'Evaluación final y preparación siguiente curso',
            milestones: ['Cumplimiento objetivos', 'Planificación continuidad']
          }
        ]
      }
    };
  }

  /**
   * Obtiene todos los PEIs
   */
  async getAllPeis() {
    return this.prisma.pEI.findMany({
      include: {
        student: true,
        report: true,
        materialesAdaptados: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtiene un PEI específico
   */
  async getPeiById(id: string) {
    const pei = await this.prisma.pEI.findUnique({
      where: { id },
      include: {
        student: true,
        report: true,
        materialesAdaptados: true,
      },
    });

    if (!pei) {
      throw new BadRequestException('PEI no encontrado');
    }

    // Parsear campos JSON
    return {
      ...pei,
      objectives: JSON.parse(pei.objetivos),
      adaptations: JSON.parse(pei.adaptaciones),
      strategies: JSON.parse(pei.estrategias),
      evaluation: JSON.parse(pei.evaluacion),
      timeline: JSON.parse(pei.cronograma),
    };
  }

  /**
   * Actualiza el estado de un PEI
   */
  async updatePeiStatus(id: string, status: string) {
    const validStatuses = ['BORRADOR', 'REVISION', 'APROBADO', 'ACTIVO', 'ARCHIVADO'];
    
    if (!validStatuses.includes(status)) {
      throw new BadRequestException('Estado no válido');
    }

    return this.prisma.pEI.update({
      where: { id },
      data: { 
        estado: status,
        ...(status === 'APROBADO' && { fechaAprobacion: new Date() }),
      },
    });
  }

  /**
   * Genera versión PDF del PEI (mock)
   */
  async generatePeiPdf(id: string) {
    const pei = await this.getPeiById(id);
    
    // En producción: generar PDF real con librería como puppeteer o jsPDF
    // Este es un mock básico para demostración
    const mockPdf = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
100 700 Td
(Plan Educativo Individualizado - ${pei.student?.nombre || 'N/A'} ${pei.student?.apellidos || ''}) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000125 00000 n 
0000000185 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
300
%%EOF
    `;

    return Buffer.from(mockPdf);
  }
}