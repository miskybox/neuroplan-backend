import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import pool from '../../db';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    // MODO MOCK: Simular registro sin base de datos
    console.log('🔧 MODO MOCK: Registrando usuario sin base de datos');
    
    // Simular verificación de email existente
    if (dto.email === 'admin@neuroplan.com') {
      throw new ConflictException('El email ya está registrado');
    }

    // Simular usuario creado
    const mockUser = {
      id: `user_${Date.now()}`,
      email: dto.email,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      centerId: dto.centerId,
    };

    // Generar token JWT
    const payload: JwtPayload = {
      sub: mockUser.id,
      email: mockUser.email,
      rol: mockUser.role,
      centroId: mockUser.centerId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        centerId: mockUser.centerId,
      },
    };
  }

  async login(dto: LoginDto) {
    // MODO MOCK: Simular login sin base de datos
    console.log('🔧 MODO MOCK: Login sin base de datos');
    
    // Simular usuarios válidos
    const mockUsers = [
      {
        id: 'user_123',
        email: 'admin@neuroplan.com',
        password: 'admin123',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        centerId: 'CENTRO_DEMO',
      },
      {
        id: 'user_456',
        email: 'orientador@neuroplan.com',
        password: 'orientador123',
        role: 'ORIENTADOR',
        firstName: 'María',
        lastName: 'García',
        centerId: 'CENTRO_DEMO',
      },
    ];

    const user = mockUsers.find(u => u.email === dto.email);
    
    if (!user || user.password !== dto.password) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rol: user.role,
      centroId: user.centerId,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        centerId: user.centerId,
      },
    };
  }

  async validateUser(userId: string) {
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    const usuario = rows[0];
    if (!usuario) {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    return usuario;
  }

  async getMe(userId: string) {
    const { rows } = await pool.query(
      'SELECT id, email, role, first_name, last_name, center_id, active FROM users WHERE id = $1',
      [userId]
    );
    const usuario = rows[0];
    if (!usuario) {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    return {
      id: usuario.id,
      email: usuario.email,
      role: usuario.role,
      firstName: usuario.first_name,
      lastName: usuario.last_name,
      centerId: usuario.center_id,
      active: usuario.active,
    };
  }
}
