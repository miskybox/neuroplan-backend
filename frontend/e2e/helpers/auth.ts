import { APIRequestContext } from "@playwright/test";

interface CachedToken {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, CachedToken>();

export async function getAuthToken(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const cacheKey = `${email}:${password}`;

  // Verificar si hay token en cache y no ha expirado
  const cached = tokenCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    console.log(`🔐 Reutilizando token cached para ${email}`);
    return cached.token;
  }

  // Si no hay cache o expiró, hacer login
  console.log(`🔐 Autenticando usuario ${email}`);

  const response = await request.post("http://localhost:3001/api/auth/login", {
    data: { email, password },
  });

  if (!response.ok()) {
    throw new Error(
      `Login failed for ${email}: ${response.status()} ${await response.text()}`
    );
  }

  const body = await response.json();
  const token = body.accessToken;

  // Cachear token por 50 minutos (los tokens de Supabase duran 1 hora)
  tokenCache.set(cacheKey, {
    token,
    expiresAt: Date.now() + 50 * 60 * 1000,
  });

  return token;
}

export function clearTokenCache() {
  tokenCache.clear();
}
