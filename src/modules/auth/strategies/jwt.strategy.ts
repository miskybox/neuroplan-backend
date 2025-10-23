import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import pool from '../../../db';

export interface JwtPayload {
  sub: string; // Usuario ID
  email: string;
  rol: string;
  centroId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'neuroplan-secret-key-change-in-production',
    });
  }
  async validate(payload: JwtPayload) {
    // Buscar usuario por id y traer centro
    const userRes = await pool.query(
      'SELECT u.*, c.* FROM usuario u LEFT JOIN centro c ON u."centroId" = c.id WHERE u.id = $1',
      [payload.sub]
    );
    const usuario = userRes.rows[0];
    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Usuario no autorizado o inactivo');
    }
    // Retornar el usuario (se adjunta a request.user)
    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      centroId: usuario.centroid,
      centro: usuario.nombre_centro ? {
        id: usuario.centroid,
        nombre: usuario.nombre_centro,
        direccion: usuario.direccion,
        telefono: usuario.telefono
      } : null,
    };
  }
}
