import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  validateSync,
  Min,
  Max,
} from 'class-validator';

export class EnvironmentVariables {
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  SUPABASE_URL: string;

  @IsNotEmpty()
  @IsString()
  SUPABASE_ANON_KEY: string;

  @IsNotEmpty()
  @IsString()
  SUPABASE_SERVICE_ROLE_KEY: string;

  @IsOptional()
  @IsNumber()
  @Min(1000)
  @Max(65535)
  PORT: number = 3001;

  @IsOptional()
  @IsString()
  NODE_ENV: string = 'development';

  @IsOptional()
  @IsString()
  ALLOWED_ORIGINS?: string;

  @IsOptional()
  @IsString()
  OLLAMA_URL?: string;

  @IsOptional()
  @IsString()
  OLLAMA_MODEL?: string;

  @IsOptional()
  @IsString()
  DATABASE_URL?: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

  @IsOptional()
  @IsString()
  AWS_REGION?: string;

  @IsOptional()
  @IsString()
  AWS_ACCESS_KEY_ID?: string;

  @IsOptional()
  @IsString()
  AWS_SECRET_ACCESS_KEY?: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        if (error.constraints) {
          return Object.values(error.constraints).join(', ');
        }
        return `${error.property}: validation failed`;
      })
      .join('; ');

    throw new Error(
      `Environment validation failed:\n${errorMessages}\n\nPlease check your .env file.`
    );
  }

  // Validación adicional: JWT_SECRET no debe ser el valor por defecto
  if (
    validatedConfig.JWT_SECRET ===
    'neuroplan-secret-key-change-in-production'
  ) {
    throw new Error(
      'JWT_SECRET must be changed from default value. Please set a strong, random secret in your .env file.'
    );
  }

  // Validación adicional: JWT_SECRET debe tener al menos 32 caracteres
  if (validatedConfig.JWT_SECRET.length < 32) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters long for security reasons.'
    );
  }

  return validatedConfig;
}






