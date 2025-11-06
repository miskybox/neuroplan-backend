import { Injectable, Logger } from '@nestjs/common';
import { LlmService } from '../llm/llm.service';
import { ExtractService } from './extract.service';

@Injectable()
export class DocumentAnalyzerService {
  private readonly logger = new Logger(DocumentAnalyzerService.name);

  constructor(
    private readonly extractService: ExtractService,
    private readonly llmService: LlmService,
  ) {}

  async analyzeDocument(pdfBuffer: Buffer): Promise<any> {
    // Extraer texto del PDF
    const extractedText = await this.extractService.fromPdfBuffer(pdfBuffer);
    
    // Analizar el texto con IA para extraer información relevante
    const analysisPrompt = `
    Analiza el siguiente texto extraído de un informe psicopedagógico y extrae la siguiente información en formato JSON:
    
    1. Diagnóstico principal
    2. Edad del estudiante
    3. Nivel académico
    4. Fortalezas identificadas
    5. Áreas de mejora
    6. Recomendaciones específicas
    
    Texto del informe:
    ${extractedText.substring(0, 4000)} // Limitamos a 4000 caracteres para evitar tokens excesivos
    
    Responde SOLO con un objeto JSON con las siguientes propiedades:
    {
      "diagnostico": string,
      "edad": number,
      "nivelAcademico": string,
      "fortalezas": string[],
      "areasMejora": string[],
      "recomendaciones": string[]
    }
    `;
    
    try {
      const analysisResult = await this.llmService.generateText(analysisPrompt);
      return JSON.parse(analysisResult);
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error al analizar documento con IA', errorStack);
      // Devolver un resultado parcial en caso de error
      return {
        diagnostico: "No se pudo determinar",
        edad: 0,
        nivelAcademico: "No se pudo determinar",
        fortalezas: ["No se pudieron extraer fortalezas"],
        areasMejora: ["No se pudieron extraer áreas de mejora"],
        recomendaciones: ["No se pudieron extraer recomendaciones"]
      };
    }
  }
  
  async generatePeiSuggestions(analysisResult: any): Promise<any> {
    const suggestionsPrompt = `
    Basado en el siguiente análisis de un informe psicopedagógico, genera sugerencias para un Plan Educativo Individualizado (PEI):
    
    Diagnóstico: ${analysisResult.diagnostico}
    Edad: ${analysisResult.edad}
    Nivel académico: ${analysisResult.nivelAcademico}
    Fortalezas: ${analysisResult.fortalezas.join(', ')}
    Áreas de mejora: ${analysisResult.areasMejora.join(', ')}
    
    Genera sugerencias en formato JSON con las siguientes propiedades:
    {
      "objetivos": [
        {
          "descripcion": string,
          "plazo": string,
          "criteriosEvaluacion": string
        }
      ],
      "adaptacionesCurriculares": [
        {
          "asignatura": string,
          "tipoAdaptacion": string,
          "descripcion": string
        }
      ],
      "estrategiasApoyo": string[]
    }
    `;
    
    try {
      const suggestionsResult = await this.llmService.generateText(suggestionsPrompt);
      return JSON.parse(suggestionsResult);
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error al generar sugerencias para PEI', errorStack);
      return {
        objetivos: [
          {
            descripcion: "Mejorar habilidades de atención",
            plazo: "3 meses",
            criteriosEvaluacion: "Completar tareas sin distracciones por 15 minutos"
          }
        ],
        adaptacionesCurriculares: [
          {
            asignatura: "Lenguaje",
            tipoAdaptacion: "Metodológica",
            descripcion: "Proporcionar instrucciones claras y concisas"
          }
        ],
        estrategiasApoyo: ["Trabajo en grupos pequeños", "Uso de material visual"]
      };
    }
  }
}