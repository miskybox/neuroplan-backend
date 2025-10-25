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
    // Find user by id using existing schema
    const userRes = await pool.query(
      'SELECT * FROM "User" WHERE id = $1',
      [payload.sub]
    );
    const user = userRes.rows[0];
    if (!user?.activo) {
      throw new UnauthorizedException('User not authorized or inactive');
    }
    // Return the user (attached to request.user)
    return {
      id: user.id,
      email: user.email,
      firstName: user.nombre,
      lastName: user.apellidos,
      role: user.role,
      centerId: null, // No existe en el esquema actual
    };
  }
}
