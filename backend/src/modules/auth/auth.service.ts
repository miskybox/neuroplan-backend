import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { supabase, getUserByEmail, createUser, getUserById } from '../../db';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    try {
      this.logger.log('Registrando usuario con Supabase Auth');
      
      // Verificar si el email ya existe en nuestra tabla de usuarios
      const existingUser = await getUserByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }



      // --- Permitir valores demo para centerId y role ---
      // Si centerId no es un UUID válido, usar uno demo fijo
      const uuidDemo = '11111111-1111-1111-1111-111111111111';
      const validRoles = ['ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO'];
      let centerId = dto.centerId;
      let role = dto.role;
      // Validar UUID simple (versión básica)
      if (!/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(centerId)) {
        centerId = uuidDemo;
      }
      if (!validRoles.includes(role)) {
        role = 'ADMIN';
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
          }
        }
      });

      if (authError) {
        this.logger.error(`Error en Supabase Auth: ${JSON.stringify(authError, null, 2)}`);
        throw new BadRequestException('Error al crear usuario: ' + authError.message);
      }

      if (!authData.user) {
        this.logger.error(`Supabase Auth no devolvió usuario: ${JSON.stringify(authData, null, 2)}`);
        throw new BadRequestException('No se pudo crear el usuario');
      }

      // Crear usuario en nuestra tabla de usuarios
      // IMPORTANTE: Usar el mismo ID de Supabase Auth para mantener consistencia
      const userData = {
        id: authData.user.id,
        email: dto.email,
        role,
        first_name: dto.firstName,
        last_name: dto.lastName,
        center_id: centerId,
      };

      const dbUser = await createUser(userData);

      // Generar token JWT personalizado
      const payload: JwtPayload = {
        sub: dbUser.id,
        email: dbUser.email,
        rol: dbUser.role,
        centroId: dbUser.center_id,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          firstName: dbUser.first_name,
          lastName: dbUser.last_name,
          centerId: dbUser.center_id,
        },
        authUser: authData.user, // Información adicional de Supabase Auth
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error en registro', errorStack);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async login(dto: LoginDto) {
    try {
      this.logger.log('Autenticando usuario con Supabase Auth');

      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      if (authError) {
        const errorStack = authError instanceof Error ? authError.stack : String(authError);
        this.logger.error('Error en Supabase Auth', errorStack);
        throw new UnauthorizedException('Credenciales inválidas');
      }

      if (!authData.user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }

      // Obtener información del usuario de nuestra tabla
      const dbUser = await getUserByEmail(dto.email);
      if (!dbUser) {
        throw new UnauthorizedException('Usuario no encontrado en la base de datos');
      }

      // Generar token JWT personalizado
      const payload: JwtPayload = {
        sub: dbUser.id,
        email: dbUser.email,
        rol: dbUser.role,
        centroId: dbUser.center_id,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        accessToken,
        user: {
          id: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          firstName: dbUser.first_name,
          lastName: dbUser.last_name,
          centerId: dbUser.center_id,
        },
        authUser: authData.user, // Información adicional de Supabase Auth
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error en login', errorStack);
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error interno del servidor');
    }
  }

  async validateUser(userId: string) {
    try {
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('Usuario no autorizado');
      }
      return user;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error validando usuario', errorStack);
      throw new UnauthorizedException('Usuario no autorizado');
    }
  }

  async getMe(userId: string) {
    try {
      const user = await getUserById(userId);
      if (!user) {
        throw new UnauthorizedException('Usuario no autorizado');
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
      this.logger.error('Error obteniendo usuario', errorStack);
      throw new UnauthorizedException('Usuario no autorizado');
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        const errorStack = error instanceof Error ? error.stack : String(error);
        this.logger.error('Error cerrando sesión', errorStack);
        throw new BadRequestException('Error al cerrar sesión');
      }
      return { message: 'Sesión cerrada correctamente' };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error en logout', errorStack);
      throw new BadRequestException('Error interno del servidor');
    }
  }

  // Método para verificar token de Supabase
  async verifySupabaseToken(token: string) {
    try {
      const { data, error } = await supabase.auth.getUser(token);
      if (error) {
        throw new UnauthorizedException('Token inválido');
      }
      return data.user;
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error('Error verificando token', errorStack);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
