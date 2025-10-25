import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import pool from '../../db';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto) {
    // Verificar si el usuario ya existe
    const { rows: existingUsers } = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [dto.email]
    );
    if (existingUsers.length > 0) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear usuario
    const { rows } = await pool.query(
      `INSERT INTO users (email, password, role, first_name, last_name, center_id) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, email, role, first_name, last_name, center_id`,
      [dto.email, hashedPassword, dto.rol, dto.firstName, dto.lastName, dto.centroId]
    );
    const usuario = rows[0];

    // Generar token JWT
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.role,
      centroId: usuario.center_id,
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role,
        firstName: usuario.first_name,
        lastName: usuario.last_name,
        centerId: usuario.center_id,
      },
    };
  }

  async login(dto: LoginDto) {
    // Search user
    const { rows } = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [dto.email]
    );
    const user = rows[0];

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      rol: user.role,
      centroId: null, // No existe en el esquema actual
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.nombre,
        lastName: user.apellidos,
        centerId: null,
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
