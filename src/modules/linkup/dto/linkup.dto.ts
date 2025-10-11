import { IsString, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SearchResourcesDto {
  @ApiProperty({
    description: 'Consulta de búsqueda',
    example: 'TDAH niños actividades educativas',
  })
  @IsString()
  query: string;

  @ApiProperty({
    description: 'Categorías específicas a buscar',
    type: [String],
    example: ['app', 'strategy', 'tool'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  categories?: string[];

  @ApiProperty({
    description: 'Curso o edad del estudiante',
    example: '6º Primaria',
    required: false,
  })
  @IsString()
  @IsOptional()
  grade?: string;

  @ApiProperty({
    description: 'Número máximo de resultados',
    example: 20,
    minimum: 1,
    maximum: 100,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number;
}

export class PeiResourceRequest {
  @ApiProperty({
    description: 'Incluir recursos para objetivos específicos',
    example: true,
    required: false,
  })
  @IsOptional()
  includeObjectives?: boolean;

  @ApiProperty({
    description: 'Incluir herramientas de apoyo',
    example: true,
    required: false,
  })
  @IsOptional()
  includeTools?: boolean;

  @ApiProperty({
    description: 'Incluir estrategias metodológicas',
    example: true,
    required: false,
  })
  @IsOptional()
  includeStrategies?: boolean;

  @ApiProperty({
    description: 'Filtrar por idioma',
    example: 'es',
    enum: ['es', 'en', 'ca'],
    required: false,
  })
  @IsString()
  @IsOptional()
  language?: string;
}