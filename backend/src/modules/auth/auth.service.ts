import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { supabase, getUserByEmail, createUser, getUserById } from '../../db';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    try {
      console.log('🔐 Registrando usuario con Supabase Auth');
      
      // Verificar si el email ya existe en nuestra tabla de usuarios
      const existingUser = await getUserByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('El email ya está registrado');
      }

      // Crear usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: dto.email,
        password: dto.password,
        options: {
          data: {
            first_name: dto.firstName,
            last_name: dto.lastName,
            role: dto.role,
            center_id: dto.centerId,
          }
        }
      });

      if (authError) {
        console.error('Error en Supabase Auth:', authError);
        throw new BadRequestException('Error al crear usuario: ' + authError.message);
      }

      if (!authData.user) {
        throw new BadRequestException('No se pudo crear el usuario');
      }

      // Crear usuario en nuestra tabla de usuarios
      const userData = {
        email: dto.email,
        role: dto.role,
        first_name: dto.firstName,
        last_name: dto.lastName,
        center_id: dto.centerId,
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
      console.error('Error en registro:', error);
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error interno del servidor');
    }
  }

  async login(dto: LoginDto) {
    try {
      console.log('🔐 Autenticando usuario con Supabase Auth');
      
      // Autenticar con Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: dto.email,
        password: dto.password,
      });

      if (authError) {
        console.error('Error en Supabase Auth:', authError);
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
      console.error('Error en login:', error);
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
      console.error('Error validando usuario:', error);
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
      console.error('Error obteniendo usuario:', error);
      throw new UnauthorizedException('Usuario no autorizado');
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error cerrando sesión:', error);
        throw new BadRequestException('Error al cerrar sesión');
      }
      return { message: 'Sesión cerrada correctamente' };
    } catch (error) {
      console.error('Error en logout:', error);
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
      console.error('Error verificando token:', error);
      throw new UnauthorizedException('Token inválido');
    }
  }
}
