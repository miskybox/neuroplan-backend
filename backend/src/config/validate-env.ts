import { Logger } from '@nestjs/common';

const logger = new Logger('EnvValidator');

/**
 * Valida que las variables de entorno críticas estén presentes
 * y tengan valores seguros antes de iniciar la aplicación
 */
export function validateRequiredEnvVars(): void {
  const authMock = String(process.env.AUTH_MOCK || 'false').toLowerCase() === 'true';

  const required = ['JWT_SECRET'];

  // Solo exigir Supabase si no estamos en modo AUTH_MOCK
  if (!authMock) {
    required.push('SUPABASE_URL', 'SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY');
  }

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    const errorMsg = `❌ Missing required environment variables: ${missing.join(', ')}\n\nPlease check your .env file and ensure all required variables are set.`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Validar que JWT_SECRET no sea el valor por defecto
  if (
    process.env.JWT_SECRET === 'neuroplan-secret-key-change-in-production'
  ) {
    const errorMsg =
      '❌ JWT_SECRET must be changed from default value.\n\nPlease set a strong, random secret in your .env file.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Validar longitud mínima de JWT_SECRET
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    const errorMsg =
      '❌ JWT_SECRET must be at least 32 characters long for security reasons.';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  logger.log('✅ Environment variables validated successfully');
}





