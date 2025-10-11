import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TextToSpeechDto {
  @ApiProperty({
    description: 'Texto a convertir en audio',
    example: 'Plan Educativo Individualizado para María García López...',
  })
  @IsString()
  text: string;

  @ApiProperty({
    description: 'ID de voz de ElevenLabs',
    example: '21m00Tcm4TlvDq8ikWAM',
    required: false,
  })
  @IsString()
  @IsOptional()
  voiceId?: string;

  @ApiProperty({
    description: 'Idioma del audio',
    example: 'es',
    enum: ['es', 'en', 'ca'],
    required: false,
  })
  @IsEnum(['es', 'en', 'ca'])
  @IsOptional()
  language?: string;
}

export class PeiAudioRequest {
  @ApiProperty({
    description: 'Tipo de audio a generar',
    example: 'SUMMARY',
    enum: ['SUMMARY', 'OBJECTIVES', 'FULL', 'CUSTOM'],
  })
  @IsEnum(['SUMMARY', 'OBJECTIVES', 'FULL', 'CUSTOM'])
  type: string;

  @ApiProperty({
    description: 'Texto personalizado (solo para tipo CUSTOM)',
    example: 'Resumen personalizado del PEI...',
    required: false,
  })
  @IsString()
  @IsOptional()
  customText?: string;
}