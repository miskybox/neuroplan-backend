import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GeneratePeiFromReportDto } from './dto/create-pei.dto';
import * as fs from 'node:fs';
import pdfParse from 'pdf-parse';
import pool from '../../db';

@Injectable()
export class PeisService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  /**
   * Genera un PEI completo desde diagnóstico directo (para frontend)
   */
  async generatePeiFromDiagnosis(
    diagnosisData: {
      studentId: string;
      diagnosis: string[];
      symptoms?: string[];
      strengths?: string[];
      additionalNotes?: string;
    },
    userId: string, // Usuario autenticado que crea el PEI
  ) {
    // 1. Validate that the student exists
    const studentRes = await pool.query('SELECT * FROM "Student" WHERE id = $1', [diagnosisData.studentId]);
    const student = studentRes.rows[0];
    if (!student) {
      throw new BadRequestException('Estudiante no encontrado');
    }

    // 2. Calculate student age
    const today = new Date();
    const birthDate = new Date(student.birth_date);
    const age = today.getFullYear() - birthDate.getFullYear();

    // 3. Prepare analysis from direct diagnosis
    const analysis = {
      diagnosis: diagnosisData.diagnosis,
      symptoms: diagnosisData.symptoms || [],
      strengths: diagnosisData.strengths || [],
      additionalInfo: diagnosisData.additionalNotes || '',
      studentName: `${student.name} ${student.last_name}`,
      gradeLevel: student.grade,
      age,
    };

    // 4. Generar PEI estructurado usando el método existente
    const peiData = await this.generatePeiStructure(analysis, student);

    // 5. Crear un report virtual para cumplir con el esquema
    const virtualReportRes = await pool.query(
      `INSERT INTO report (filename, "originalName", "mimeType", size, path, "extractedText", status, "processedAt", "studentId")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        `diagnosis-${Date.now()}.json`,
        `Diagnóstico directo - ${student.nombre} ${student.apellidos}`,
        'application/json',
        JSON.stringify(diagnosisData).length,
        `/virtual/diagnosis-${Date.now()}.json`,
        JSON.stringify(analysis),
        'COMPLETED',
        new Date(),
        diagnosisData.studentId
      ]
    );
    const virtualReport = virtualReportRes.rows[0];

    // 6. Crear PEI en base de datos
    const peiRes = await pool.query(
      `INSERT INTO pei (resumen, diagnostico, objetivos, adaptaciones, estrategias, evaluacion, cronograma, estado, "creadoPorId", "studentId", "reportId")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        peiData.summary,
        peiData.diagnosis,
        JSON.stringify(peiData.objectives),
        JSON.stringify(peiData.adaptations),
        JSON.stringify(peiData.strategies),
        JSON.stringify(peiData.evaluation),
        JSON.stringify(peiData.timeline),
        'BORRADOR',
        userId,
        diagnosisData.studentId,
        virtualReport.id
      ]
    );
    const pei = peiRes.rows[0];

    // 7. Log de actividad
    await pool.query(
      `INSERT INTO "activityLog" (accion, entidad, "entidadId", detalles)
       VALUES ($1, $2, $3, $4)`,
      [
        'generate_pei_from_diagnosis',
        'pei',
        pei.id,
        JSON.stringify({
          diagnosis: diagnosisData.diagnosis,
          studentId: diagnosisData.studentId,
          method: 'direct_diagnosis',
        })
      ]
    );

    // 8. Retornar PEI con datos expandidos
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
  async generatePeiFromReport(dto: GeneratePeiFromReportDto, userId: string) {
    // 1. Validar que el informe existe y pertenece al estudiante
    const reportRes = await pool.query(
      'SELECT * FROM report WHERE id = $1 AND "studentId" = $2',
      [dto.reportId, dto.studentId]
    );
    const report = reportRes.rows[0];
    if (!report) {
      throw new BadRequestException('Informe no encontrado o no pertenece al estudiante');
    }

    // 2. Extraer texto del informe si no se ha hecho
    let extractedText = report.extractedText;
    if (!extractedText) {
      extractedText = await this.extractTextFromReport(report);
      // Actualizar el informe con el texto extraído
      await pool.query(
        'UPDATE report SET "extractedText" = $1, status = $2 WHERE id = $3',
        [extractedText, 'PROCESSING', report.id]
      );
    }

    // 3. Analizar con Claude AI (mock para hackathon)
    const analysis = await this.analyzeWithClaude(extractedText, report.student);

    // 4. Generar PEI estructurado
    const peiData = await this.generatePeiStructure(analysis, report.student);

    // 5. Crear PEI en base de datos
    const peiRes = await pool.query(
      `INSERT INTO pei (resumen, diagnostico, objetivos, adaptaciones, estrategias, evaluacion, cronograma, estado, "creadoPorId", "studentId", "reportId")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [
        peiData.summary,
        peiData.diagnosis,
        JSON.stringify(peiData.objectives),
        JSON.stringify(peiData.adaptations),
        JSON.stringify(peiData.strategies),
        JSON.stringify(peiData.evaluation),
        JSON.stringify(peiData.timeline),
        'BORRADOR',
        userId,
        dto.studentId,
        dto.reportId
      ]
    );
    const pei = peiRes.rows[0];

    // 6. Marcar informe como completado
    await pool.query(
      'UPDATE report SET status = $1, "processedAt" = $2 WHERE id = $3',
      ['COMPLETED', new Date(), report.id]
    );

    // 7. Log de actividad
    await pool.query(
      `INSERT INTO "activityLog" (accion, entidad, "entidadId", detalles)
       VALUES ($1, $2, $3, $4)`,
      [
        'generate_pei',
        'pei',
        pei.id,
        JSON.stringify({
          studentId: dto.studentId,
          reportId: dto.reportId,
          objectivesCount: peiData.objectives.length,
        })
      ]
    );

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
  async getAllPeis(userId?: string, userRole?: string) {
    // Si es FAMILIA, filtrar por usuarioFamiliaId
    if (userRole === 'FAMILIA' && userId) {
      // Solo devolver PEIs de estudiantes vinculados al usuario
      const peisRes = await pool.query(
        `SELECT pei.*, student.*, report.*
         FROM pei
         JOIN student ON pei."studentId" = student.id
         JOIN report ON pei."reportId" = report.id
         WHERE student."usuarioFamiliaId" = $1
         ORDER BY pei."createdAt" DESC`,
        [userId]
      );
      return peisRes.rows;
    }
    // Para otros roles, devolver todos los PEIs
    const peisRes = await pool.query(
      `SELECT pei.*, student.*, report.*
       FROM pei
       JOIN student ON pei."studentId" = student.id
       JOIN report ON pei."reportId" = report.id
       ORDER BY pei."createdAt" DESC`
    );
    return peisRes.rows;
  }

  /**
   * Obtiene un PEI específico
   */
  async getPeiById(id: string, userId?: string, userRole?: string) {
    // Obtener PEI único
    const peiRes = await pool.query(
      `SELECT pei.*, student.*, report.*
       FROM pei
       JOIN student ON pei."studentId" = student.id
       JOIN report ON pei."reportId" = report.id
       WHERE pei.id = $1`,
      [id]
    );
    const pei = peiRes.rows[0];
    if (!pei) {
      throw new BadRequestException('PEI no encontrado');
    }
    // Verificar acceso si es FAMILIA
    if (userRole === 'FAMILIA' && userId) {
      if (pei.usuarioramiliaid && pei.usuarioramiliaid !== userId) {
        throw new BadRequestException('No tienes acceso a este PEI');
      }
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

    // Actualizar estado del PEI
    await pool.query(
      'UPDATE pei SET estado = $1, "fechaAprobacion" = $2 WHERE id = $3',
      [
        status,
        status === 'APROBADO' ? new Date() : null,
        id
      ]
    );
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

  /**
   * Obtener PEIs de un estudiante específico
   */
  async getPeisByStudent(studentId: string, userId: string, userRole: string) {
    try {
      // Verificar permisos según el rol
      let query = `
        SELECT 
          p.id,
          p.version,
          p.summary,
          p.status,
          p.created_at as "createdAt",
          p.updated_at as "updatedAt",
          s.nombre,
          s.apellidos,
          s.curso
        FROM "PEI" p
        JOIN "Student" s ON p."studentId" = s.id
        WHERE p."studentId" = $1
      `;

      const params = [studentId];

      // Aplicar filtros según el rol
      if (userRole === 'FAMILIA') {
        query += ` AND s."familyId" = $2`;
        params.push(userId);
      }

      query += ` ORDER BY p.created_at DESC`;

      const result = await pool.query(query, params);
      return result.rows;
    } catch (error) {
      console.error('Error getting PEIs by student:', error);
      throw new BadRequestException('Error al obtener PEIs del estudiante');
    }
  }

  /**
   * Generar audio del PEI usando AWS Polly
   */
  async generatePeiAudio(peiId: string, userId: string) {
    try {
      // Obtener el PEI
      const pei = await this.getPeiById(peiId, userId, 'ADMIN');
      
      if (!pei) {
        throw new BadRequestException('PEI no encontrado');
      }

      // Generar contenido de audio
      const audioContent = this.prepareAudioContent(pei);
      
      // Simular generación de audio (en producción usar AWS Polly)
      const audioUrl = `https://neuroplan-audio.s3.amazonaws.com/pei-${peiId}-${Date.now()}.mp3`;
      const duration = this.estimateAudioDuration(audioContent);

      // Guardar información del audio en la base de datos
      const audioRecord = await pool.query(`
        INSERT INTO "AudioFile" ("peiId", url, duration, language, voice, "createdAt")
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, url, duration, language, voice, "createdAt"
      `, [peiId, audioUrl, duration, 'es', 'Conchita']);

      return {
        id: audioRecord.rows[0].id,
        url: audioRecord.rows[0].url,
        duration: audioRecord.rows[0].duration,
        language: audioRecord.rows[0].language,
        voice: audioRecord.rows[0].voice,
        createdAt: audioRecord.rows[0].createdAt,
      };
    } catch (error) {
      console.error('Error generating PEI audio:', error);
      throw new BadRequestException('Error al generar audio del PEI');
    }
  }

  /**
   * Preparar contenido para audio
   */
  private prepareAudioContent(pei: any): string {
    let content = `Plan Educativo Individualizado para ${pei.student?.nombre || 'el estudiante'}\n\n`;
    
    if (pei.summary) {
      content += `Resumen: ${pei.summary}\n\n`;
    }
    
    if (pei.diagnosis) {
      content += `Diagnóstico: ${pei.diagnosis}\n\n`;
    }
    
    if (pei.objectives && Array.isArray(pei.objectives)) {
      content += `Objetivos:\n`;
      for (const [index, obj] of pei.objectives.entries()) {
        content += `${index + 1}. ${obj.title || obj}\n`;
      }
      content += '\n';
    }
    
    if (pei.adaptations && Array.isArray(pei.adaptations)) {
      content += `Adaptaciones:\n`;
      for (const [index, adapt] of pei.adaptations.entries()) {
        content += `${index + 1}. ${adapt.description || adapt}\n`;
      }
    }
    
    return content;
  }

  /**
   * Estimate audio duration
   */
  private estimateAudioDuration(content: string): number {
    // Estimation: ~150 words per minute
    const words = content.split(' ').length;
    return Math.ceil((words / 150) * 60);
  }
}