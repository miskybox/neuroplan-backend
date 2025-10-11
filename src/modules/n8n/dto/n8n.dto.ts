import { IsString, IsOptional, IsObject, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerWorkflowDto {
  @ApiProperty({
    description: 'Nombre del workflow a ejecutar',
    example: 'pei-generated',
    enum: ['pei-generated', 'pei-approved', 'send-notification', 'schedule-review'],
  })
  @IsEnum(['pei-generated', 'pei-approved', 'send-notification', 'schedule-review'])
  workflowName: string;

  @ApiProperty({
    description: 'Datos de entrada para el workflow',
    example: {
      studentId: 'clxxxxx',
      peiId: 'clyyyyy',
      parentEmail: 'parent@email.com',
      teacherEmail: 'teacher@school.edu',
    },
  })
  @IsObject()
  data: Record<string, any>;

  @ApiProperty({
    description: 'Prioridad de ejecución',
    example: 'normal',
    enum: ['low', 'normal', 'high', 'urgent'],
    required: false,
  })
  @IsEnum(['low', 'normal', 'high', 'urgent'])
  @IsOptional()
  priority?: string;
}

export class WebhookPayload {
  @ApiProperty({
    description: 'Acción que dispara el webhook',
    example: 'pei-completed',
  })
  @IsString()
  action: string;

  @ApiProperty({
    description: 'ID de la entidad relacionada',
    example: 'clxxxxx',
  })
  @IsString()
  entityId: string;

  @ApiProperty({
    description: 'Datos adicionales del evento',
    required: false,
  })
  @IsObject()
  @IsOptional()
  data?: Record<string, any>;

  @ApiProperty({
    description: 'Timestamp del evento',
    example: '2025-10-11T14:45:00.000Z',
  })
  @IsString()
  timestamp: string;
}