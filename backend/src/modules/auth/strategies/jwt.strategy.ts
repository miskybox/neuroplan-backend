import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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
    // MODO MOCK: Validar usuario sin base de datos
    console.log('🔧 MODO MOCK: Validando JWT sin base de datos');
    
    // Simular usuarios válidos
    const mockUsers = [
      {
        id: 'user_123',
        email: 'admin@neuroplan.com',
        role: 'ADMIN',
        firstName: 'Admin',
        lastName: 'User',
        centerId: 'CENTRO_DEMO',
        active: true,
      },
      {
        id: 'user_456',
        email: 'orientador@neuroplan.com',
        role: 'ORIENTADOR',
        firstName: 'María',
        lastName: 'García',
        centerId: 'CENTRO_DEMO',
        active: true,
      },
    ];

    const user = mockUsers.find(u => u.id === payload.sub);
    
    if (!user?.active) {
      throw new UnauthorizedException('User not authorized or inactive');
    }

    // Return the user (attached to request.user)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      centerId: user.centerId,
    };
  }
}
