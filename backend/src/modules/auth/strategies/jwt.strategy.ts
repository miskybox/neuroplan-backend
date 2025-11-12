import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { getUserById } from "../../../db";
import { MockAuthStore } from "../mock-auth.store";

export interface JwtPayload {
  sub: string; // Usuario ID
  email: string;
  rol: string;
  centroId: string;
  type?: string; // Para diferenciar access/refresh tokens
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error(
        "JWT_SECRET must be defined in environment variables. " +
          "Please check your .env file and ensure JWT_SECRET is set."
      );
    }

    if (secret.length < 32) {
      throw new Error(
        "JWT_SECRET must be at least 32 characters long for security reasons."
      );
    }

    super({
      // Extraer token de cookies O del header Authorization
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Intentar obtener de cookie primero
          let token = request?.cookies?.['accessToken'];

          // Si no está en cookie, intentar obtener del header
          if (!token && request?.headers?.authorization) {
            const authHeader = request.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
              token = authHeader.substring(7);
            }
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: secret,
      passReqToCallback: false,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      // Log para debugging
      this.logger.debug(
        "🔐 JWT Validation - Payload:",
        JSON.stringify(payload)
      );

      const authMock =
        String(process.env.AUTH_MOCK || "false").toLowerCase() === "true";
      this.logger.debug(`🔐 Auth mode: ${authMock ? "MOCK" : "REAL"}`);

      let user: any;

      if (authMock) {
        const mock = MockAuthStore.findById(payload.sub);
        if (!mock) {
          throw new UnauthorizedException("User not authorized or inactive");
        }
        user = {
          id: mock.id,
          email: mock.email,
          first_name: mock.first_name,
          last_name: mock.last_name,
          role: mock.role,
          center_id: mock.center_id,
          active: mock.active,
        };
      } else {
        // Validar usuario contra base de datos real
        this.logger.debug(`🔐 Fetching user from DB with ID: ${payload.sub}`);
        user = await getUserById(payload.sub);
        this.logger.debug(`🔐 User found:`, user ? "YES" : "NO");
      }

      if (!user?.active) {
        this.logger.warn(`🔐 User ${payload.sub} is inactive or not found`);
        throw new UnauthorizedException("User not authorized or inactive");
      }

      this.logger.debug(`🔐 User validated successfully: ${user.email}`);

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
