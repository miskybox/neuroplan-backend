import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, Min, Max } from 'class-validator';

export class GeneratePeiDto {
  @ApiProperty({
    description: 'ID del estudiante',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @ApiProperty({
    description: 'Diagnóstico del estudiante',
    example: 'Trastorno por Déficit de Atención e Hiperactividad (TDAH)',
  })
  @IsString()
  @IsNotEmpty()
  diagnosis: string;

  @ApiProperty({
    description: 'Nivel académico del estudiante',
    example: 'Primaria - 3er grado',
  })
  @IsString()
  @IsNotEmpty()
  academicLevel: string;

  @ApiProperty({
    description: 'Edad del estudiante',
    example: 9,
  })
  @IsNumber()
  @Min(3)
  @Max(25)
  age: number;

  @ApiProperty({
    description: 'Fortalezas del estudiante',
    example: ['Buena memoria visual', 'Habilidades artísticas'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  strengths?: string[];

  @ApiProperty({
    description: 'Áreas de mejora del estudiante',
    example: ['Dificultad para mantener la atención', 'Impulsividad'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  areasToImprove?: string[];

  @ApiProperty({
    description: 'Intereses del estudiante',
    example: ['Deportes', 'Videojuegos', 'Dibujo'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  interests?: string[];

  @ApiProperty({
    description: 'Notas adicionales',
    example: 'El estudiante responde bien a refuerzos positivos y necesita descansos frecuentes',
    required: false,
  })
  @IsString()
  @IsOptional()
  additionalNotes?: string;
}