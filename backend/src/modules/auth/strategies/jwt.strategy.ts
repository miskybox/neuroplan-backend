import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { getUserById } from "../../../db";

export interface JwtPayload {
  sub: string; // Usuario ID
  email: string;
  rol: string;
  centroId: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || "neuroplan-secret-key-change-in-production",
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Validar usuario contra base de datos real
      const user = await getUserById(payload.sub);

      if (!user?.active) {
        throw new UnauthorizedException("User not authorized or inactive");
      }

      // Return the user (attached to request.user)
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        centerId: user.center_id,
      };
    } catch (error) {
      const errorStack = error instanceof Error ? error.stack : String(error);
      this.logger.error("Error validating JWT", errorStack);
      throw new UnauthorizedException("User not authorized or inactive");
    }
  }
}
