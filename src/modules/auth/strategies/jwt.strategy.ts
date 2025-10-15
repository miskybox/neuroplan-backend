import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // Usuario ID
  email: string;
  rol: string;
  centroId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'neuroplan-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload) {
    // Verificar que el usuario existe y está activo
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: payload.sub },
      include: { centro: true },
    });

    if (!usuario?.activo) {
      throw new UnauthorizedException('Usuario no autorizado o inactivo');
    }

    // Retornar el usuario (se adjunta a request.user)
    return {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
      apellidos: usuario.apellidos,
      rol: usuario.rol,
      centroId: usuario.centroId,
      centro: usuario.centro,
    };
  }
}
