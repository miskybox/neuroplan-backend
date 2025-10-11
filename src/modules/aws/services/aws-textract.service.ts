import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsTextractService {
  private readonly mockMode: boolean;

  constructor() {
    this.mockMode = !process.env.AWS_TEXTRACT_API_KEY;
  }

  /**
   * Extract text from document using AWS Textract
   * Supports PDF, PNG, JPEG, TIFF
   */
  async extractText(fileBuffer: Buffer): Promise<{
    text: string;
    confidence: number;
    blocks: number;
    words: number;
    lines: number;
  }> {
    if (this.mockMode) {
      return this.mockExtractText();
    }

    // PRODUCTION: Real AWS Textract implementation
    // Requires: npm install @aws-sdk/client-textract
    // const textract = new TextractClient({ region: 'eu-west-1' });
    // const command = new DetectDocumentTextCommand({
    //   Document: { Bytes: fileBuffer }
    // });
    // const result = await textract.send(command);
    // return this.parseTextractResponse(result);

    return this.mockExtractText();
  }

  /**
   * Advanced document analysis with forms and tables
   */
  async analyzeDocument(fileBuffer: Buffer): Promise<{
    text: string;
    forms: any[];
    tables: any[];
    metadata: any;
  }> {
    if (this.mockMode) {
      return this.mockAnalyzeDocument();
    }

    // PRODUCTION: Real AWS Textract Analyze implementation
    // Requires: npm install @aws-sdk/client-textract
    // const textract = new TextractClient({ region: 'eu-west-1' });
    // const command = new AnalyzeDocumentCommand({
    //   Document: { Bytes: fileBuffer },
    //   FeatureTypes: [FeatureType.FORMS, FeatureType.TABLES]
    // });
    // const result = await textract.send(command);
    // return this.parseAnalyzeResponse(result);

    return this.mockAnalyzeDocument();
  }

  // ========================================
  // MOCK IMPLEMENTATIONS
  // ========================================

  private mockExtractText() {
    return {
      text: `INFORME PSICOPEDAGÓGICO

Datos del Alumno:
Nombre: Juan Pérez García
Fecha de Nacimiento: 15/05/2010
Edad: 13 años
Curso: 2º ESO

Motivo de Consulta:
Dificultades en lectoescritura y comprensión lectora detectadas por el tutor.

Pruebas Administradas:
- WISC-V (Escala de Inteligencia de Wechsler)
- PROLEC-SE (Evaluación de Procesos Lectores)
- DST-J (Test de Dislexia)

Resultados:
1. Capacidad Intelectual:
   - CI Total: 105 (Promedio)
   - Comprensión Verbal: 95
   - Razonamiento Perceptivo: 110
   - Memoria de Trabajo: 88 (Por debajo del promedio)
   - Velocidad de Procesamiento: 82 (Por debajo del promedio)

2. Lectoescritura:
   - Precisión lectora: Percentil 20 (Dificultad significativa)
   - Velocidad lectora: 60 palabras/min (Esperado: 120 p/min)
   - Comprensión lectora: Percentil 25 (Dificultad)
   - Escritura: Errores frecuentes de ortografía arbitraria

3. Observaciones:
   - Inversiones de letras (b/d, p/q)
   - Omisiones y sustituciones frecuentes
   - Lectura silábica y laboriosa
   - Fatiga rápida en tareas de lectura prolongada
   - Buena expresión oral

Diagnóstico:
DISLEXIA EVOLUTIVA MODERADA (CIE-10: F81.0)

Fortalezas:
✓ Capacidad intelectual normal-promedio
✓ Razonamiento lógico bien desarrollado
✓ Habilidades visuoespaciales adecuadas
✓ Buena motivación y esfuerzo
✓ Excelente expresión oral

Necesidades Educativas Especiales:
- Apoyo especializado en lectoescritura (3 sesiones/semana)
- Adaptaciones metodológicas en el aula
- Tiempo adicional en exámenes (50% más)
- Evaluación preferente oral
- Material adaptado con letra grande y espaciado

Recomendaciones:
1. Programa de intervención fonológica
2. Entrenamiento en estrategias de comprensión lectora
3. Uso de tecnología de apoyo (text-to-speech)
4. Coordinación familia-escuela-especialistas
5. Revisión trimestral del progreso

Pronóstico:
Favorable con intervención adecuada. Se espera mejora significativa en 12-18 meses.

Fecha del Informe: 10 de octubre de 2025
Psicopedagoga: Dra. María López Sánchez
Colegiada: M-12345`,
      confidence: 0.97,
      blocks: 45,
      words: 387,
      lines: 58,
    };
  }

  private mockAnalyzeDocument() {
    return {
      text: this.mockExtractText().text,
      forms: [
        {
          key: 'Nombre',
          value: 'Juan Pérez García',
          confidence: 0.99,
        },
        {
          key: 'Fecha de Nacimiento',
          value: '15/05/2010',
          confidence: 0.98,
        },
        {
          key: 'Diagnóstico',
          value: 'DISLEXIA EVOLUTIVA MODERADA',
          confidence: 0.96,
        },
      ],
      tables: [
        {
          title: 'Resultados WISC-V',
          rows: [
            ['Escala', 'Puntuación'],
            ['CI Total', '105'],
            ['Comprensión Verbal', '95'],
            ['Razonamiento Perceptivo', '110'],
            ['Memoria de Trabajo', '88'],
            ['Velocidad de Procesamiento', '82'],
          ],
        },
      ],
      metadata: {
        pages: 3,
        language: 'es',
        documentType: 'clinical_report',
      },
    };
  }
}
