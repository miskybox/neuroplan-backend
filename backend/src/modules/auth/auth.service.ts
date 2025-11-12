import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { JwtPayload } from "./strategies/jwt.strategy";
import { supabase, getUserByEmail, createUser, getUserById } from "../../db";
import { MockAuthStore } from "./mock-auth.store";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private refreshTokens: Map<string, { userId: string; expiresAt: number }> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  // Generar access token (corta duración: 15 minutos)
  private generateAccessToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
  }

  // Generar refresh token (larga duración: 7 días)
  private generateRefreshToken(userId: string): string {
    const refreshToken = this.jwtService.sign(
      { sub: userId, type: 'refresh' },
      { expiresIn: '7d' }
    );

    // Guardar en memoria (en producción usar Redis o BD)
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 días
    this.refreshTokens.set(refreshToken, { userId, expiresAt });

    return refreshToken;
  }

  // Generar ambos tokens
  private generateTokenPair(user: any): { accessToken: string; refreshToken: string } {
    const payload = this.createPayload(user);
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  }

  // Validar refresh token
  async validateRefreshToken(refreshToken: string): Promise<string | null> {
    try {
      // Verificar que el token existe en nuestro store
      const tokenData = this.refreshTokens.get(refreshToken);
      if (!tokenData) {
        return null;
      }

      // Verificar que no haya expirado
      if (Date.now() > tokenData.expiresAt) {
        this.refreshTokens.delete(refreshToken);
        return null;
      }

      // Verificar la firma del token
      const decoded = this.jwtService.verify(refreshToken);
      if (decoded.type !== 'refresh') {
        return null;
      }

      return tokenData.userId;
    } catch (error) {
      this.logger.error('Error validating refresh token', error);
      return null;
    }
  }

  // Revocar refresh token (logout)
  revokeRefreshToken(refreshToken: string): void {
    this.refreshTokens.delete(refreshToken);
  }

  async register(dto: RegisterDto) {
    try {
      const authMock = this.isAuthMock();
      this.logger.log(
        authMock
          ? "Registrando usuario en modo AUTH_MOCK"
          : "Registrando usuario con Supabase Auth"
      );

      await this.ensureEmailAvailable(dto.email);

      const role = this.normalizeRole(dto.role);
      const centerId = this.normalizeCenterId(dto.centerId);

      const newUserId = await this.createAuthUser(
        dto,
        role,
        centerId,
        authMock
      );

      const dbUser = await this.createAppUser(
        {
          id: newUserId,
          email: dto.email,
          role,
          first_name: dto.firstName,
          last_name: dto.lastName,
          center_id: centerId,
        },
        authMock
      );

      // Generar access token y refresh token
      const { accessToken, refreshToken } = this.generateTokenPair(dbUser);

      return {
        accessToken,
        refreshToken,
        user: this.mapUserResponse(dbUser),
        authUser: authMock ? { id: dbUser.id, email: dbUser.email } : undefined,
      };
    } catch (error) {
      this.handleRegisterError(error);
    }
  }

  private isAuthMock(): boolean {
    return String(process.env.AUTH_MOCK || "false").toLowerCase() === "true";
  }

  private async ensureEmailAvailable(email: string): Promise<void> {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException("El email ya está registrado");
    }
  }

  private normalizeRole(role: string = "PROFESOR"): string {
    const validRoles = ["DIRECTOR_CENTRO", "PROFESOR", "TUTOR", "ORIENTADOR", "ALUMNO", "PADRE_TUTOR"];
    return validRoles.includes(role) ? role : "PROFESOR";
  }

  private normalizeCenterId(centerId?: string | null): string | null {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!centerId || centerId.trim() === "" || !uuidRegex.test(centerId)) {
      return null;
    }
    return centerId;
  }

  private async createAuthUser(
    dto: RegisterDto,
    role: string,
    centerId: string | null,
    authMock: boolean
  ): Promise<string> {
    if (authMock) {
      const mockUser = await MockAuthStore.create({
        email: dto.email,
        password: dto.password,
        role,
        first_name: dto.firstName,
        last_name: dto.lastName,
        center_id: centerId,
      });
      return mockUser.id;
    }

    // Crear usuario en Supabase Auth sin confirmación de email (para MVP)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        emailRedirectTo: undefined, // No redirigir a confirmación
        data: {
          first_name: dto.firstName,
          last_name: dto.lastName,
          role,
          center_id: centerId,
        },
      },
    });

    if (authError) {
      this.logger.error(
        `Error en Supabase Auth: ${JSON.stringify(authError, null, 2)}`
      );
      throw new BadRequestException(
        "Error al crear usuario: " + authError.message
      );
    }

    if (!authData.user) {
      this.logger.error(
        `Supabase Auth no devolvió usuario: ${JSON.stringify(authData, null, 2)}`
      );
      throw new BadRequestException("No se pudo crear el usuario");
    }

    return authData.user.id;
  }

  private async createAppUser(userData: any, authMock: boolean): Promise<any> {
    if (authMock) {
      return userData;
    }
    return await createUser(userData);
  }

  private createPayload(dbUser: any): JwtPayload {
    return {
      sub: dbUser.id,
      email: dbUser.email,
      rol: dbUser.role,
      centroId: dbUser.center_id,
    };
  }

  private mapUserResponse(dbUser: any) {
    return {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role,
      firstName: dbUser.first_name,
      lastName: dbUser.last_name,
      centerId: dbUser.center_id,
    };
  }

  private handleRegisterError(error: unknown): never {
    const errorStack = error instanceof Error ? error.stack : String(error);
    this.logger.error("Error en registro", errorStack);

    if (
      error instanceof ConflictException ||
      error instanceof BadRequestException
    ) {
      throw error;
    }

    if (error && typeof error === "object" && "message" in error) {
      const errorMessage =
        (error as { message: string }).message || "Error desconocido";
      this.logger.error(`Error de Supabase/DB: ${errorMessage}`);
      throw new BadRequestException(`Error al crear usuario: ${errorMessage}`);
    }

    this.logger.error("Error desconocido en registro", error as any);
    throw new BadRequestException(
      "Error interno del servidor. Verifica los logs para más detalles."
    );
  }

  async login(dto: LoginDto) {
    const authMock = this.isAuthMock();
    this.logger.log(
      authMock
        ? "Autenticando usuario en modo AUTH_MOCK"
        : "Autenticando usuario con Supabase Auth"
    );
    try {
      const dbUser = authMock
        ? await this.loginWithMock(dto)
        : await this.loginWithSupabase(dto);

      // Generar access token y refresh token
      const { accessToken, refreshToken } = this.generateTokenPair(dbUser);

      return {
        accessToken,
        refreshToken,
        user: this.mapUserResponse(dbUser),
        authUser: authMock ? { id: dbUser.id, email: dbUser.email } : undefined,
      };
    } catch (error) {
      this.handleLoginError(error);
    }
  }

  private async loginWithMock(dto: LoginDto) {
    const user = MockAuthStore.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    // Validar contraseña usando bcrypt
    const isPasswordValid = await MockAuthStore.validatePassword(dto.email, dto.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales inválidas");
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
      center_id: user.center_id,
    };
  }

  private async loginWithSupabase(dto: LoginDto) {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

    if (authError) {
      const errorStack =
        authError instanceof Error ? authError.stack : String(authError);
      this.logger.error("Error en Supabase Auth", errorStack);
      throw new UnauthorizedException("Credenciales inválidas");
    }

    if (!authData.user) {
      throw new UnauthorizedException("Usuario no encontrado");
    }

    const dbUser = await getUserByEmail(dto.email);
    if (!dbUser) {
      throw new UnauthorizedException(
        "Usuario no encontrado en la base de datos"
      );
    }
    return dbUser;
  }

  private handleLoginError(error: unknown): never {
    const errorStack = error instanceof Error ? error.stack : String(error);
    this.logger.error("Error en login", errorStack);
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    throw new UnauthorizedException("Error interno del servidor");
  }

  async validateUser(userId: string) {
    try {
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedException("Usuario no autorizado");
      }
      return user;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error("Error validando usuario", errorStack);
      throw new UnauthorizedException("Usuario no autorizado");
    }
  }

  async getMe(userId: string) {
    try {
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedException("Usuario no autorizado");
      }
      return {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        centerId: user.center_id,
        active: user.active,
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error("Error obteniendo usuario", errorStack);
      throw new UnauthorizedException("Usuario no autorizado");
    }
  }

  // Método para refrescar el access token usando el refresh token
  async refresh(refreshToken: string) {
    try {
      const userId = await this.validateRefreshToken(refreshToken);

      if (!userId) {
        throw new UnauthorizedException('Refresh token inválido o expirado');
      }

      // Obtener el usuario actualizado
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Generar nuevo access token
      const payload = this.createPayload(user);
      const newAccessToken = this.generateAccessToken(payload);

      return {
        accessToken: newAccessToken,
        user: this.mapUserResponse(user),
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error refreshing token', errorStack);

      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error al refrescar el token');
    }
  }

  // Método para cerrar sesión
  async logout(refreshToken?: string) {
    try {
      // Revocar refresh token si se proporciona
      if (refreshToken) {
        this.revokeRefreshToken(refreshToken);
      }

      // Cerrar sesión en Supabase (solo si no es mock)
      if (!this.isAuthMock()) {
        const { error } = await supabase.auth.signOut();
        if (error) {
          const errorStack = error instanceof Error ? error.stack : String(error);
          this.logger.error("Error cerrando sesión en Supabase", errorStack);
          // No lanzar error, el refresh token ya fue revocado
        }
      }

      return { message: "Sesión cerrada correctamente" };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error("Error en logout", errorStack);
      throw new BadRequestException("Error interno del servidor");
    }
  }

  // Método para verificar token de Supabase
  async verifySupabaseToken(token: string) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error) {
        throw new UnauthorizedException("Token inválido");
      }
      return data.user;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error("Error verificando token", errorStack);
      throw new UnauthorizedException("Token inválido");
    }
  }
}
