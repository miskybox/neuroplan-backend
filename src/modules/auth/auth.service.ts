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
      'SELECT * FROM "User" WHERE email = $1',
      [dto.email]
    );
    if (existingUsers.length > 0) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear usuario
    const { rows } = await pool.query(
      `INSERT INTO "User" (email, password, role) VALUES ($1, $2, $3) RETURNING id, email, role`,
      [dto.email, hashedPassword, dto.rol]
    );
    const usuario = rows[0];

    // Generar token JWT
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.role,
      centroId: null, // Ajusta si tienes centroId en tu modelo
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      usuario,
    };
  }

  async login(dto: LoginDto) {
    // Buscar usuario
    const { rows } = await pool.query(
      'SELECT * FROM "User" WHERE email = $1',
      [dto.email]
    );
    const usuario = rows[0];

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(dto.password, usuario.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Generar token JWT
    const payload: JwtPayload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.role,
      centroId: null, // Ajusta si tienes centroId en tu modelo
    };

    const accessToken = this.jwtService.sign(payload);

    return {
      accessToken,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        rol: usuario.role,
      },
    };
  }

  async validateUser(userId: string) {
    const { rows } = await pool.query(
      'SELECT * FROM "User" WHERE id = $1',
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
      'SELECT id, email, role FROM "User" WHERE id = $1',
      [userId]
    );
    const usuario = rows[0];
    if (!usuario) {
      throw new UnauthorizedException('Usuario no autorizado');
    }
    return usuario;
  }
}
