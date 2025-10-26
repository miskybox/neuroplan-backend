import { IsString, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePeiDto {
  @ApiProperty({ 
    description: 'ID del informe base para generar el PEI',
    example: 'clxxxxx'
  })
  @IsString()
  reportId: string;

  @ApiProperty({ 
    description: 'Análisis específico adicional (opcional)',
    example: 'Enfocar en matemáticas y comprensión lectora',
    required: false
  })
  @IsString()
  @IsOptional()
  additionalAnalysis?: string;

  @ApiProperty({ 
    description: 'Objetivos específicos solicitados (opcional)',
    type: [String],
    example: ['Mejorar atención sostenida', 'Desarrollar habilidades sociales'],
    required: false
  })
  @IsArray()
  @IsOptional()
  requestedObjectives?: string[];
}

export class GeneratePeiFromReportDto {
  @ApiProperty({ 
    description: 'ID del estudiante',
    example: 'clxxxxx'
  })
  @IsString()
  studentId: string;

  @ApiProperty({ 
    description: 'ID del informe a procesar',
    example: 'clxxxxx'
  })
  @IsString()
  reportId: string;

  @ApiProperty({ 
    description: 'Configuración adicional para la generación',
    required: false
  })
  @IsOptional()
  config?: {
    includeAudio?: boolean;
    includeResources?: boolean;
    triggerWorkflow?: boolean;
  };
}

export class PeiObjective {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  area: string; // 'cognitive', 'social', 'academic', 'motor'

  @ApiProperty()
  timeframe: string; // 'short', 'medium', 'long'

  @ApiProperty()
  criteria: string[];

  @ApiProperty()
  strategies: string[];
}

export class PeiAdaptation {
  @ApiProperty()
  type: string; // 'access', 'curriculum', 'methodology', 'evaluation'

  @ApiProperty()
  description: string;

  @ApiProperty()
  subject?: string;

  @ApiProperty()
  implementation: string;
}