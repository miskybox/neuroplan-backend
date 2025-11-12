import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Res,
  Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { Public } from "./decorators/public.decorator";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { CurrentUser } from "./decorators/current-user.decorator";
import { ResponseHelper, ApiResponse } from "../../utils/response.helper";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Helper para configurar cookies
  private setCookies(res: Response, accessToken: string, refreshToken: string) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Access token en cookie httpOnly (15 minutos)
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    // Refresh token en cookie httpOnly (7 días)
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });
  }

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.register(dto);

    // Establecer cookies
    this.setCookies(res, result.accessToken, result.refreshToken);

    // No enviar tokens en el body (solo user info)
    return ResponseHelper.created(
      { user: result.user },
      "Usuario registrado exitosamente"
    );
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<any>> {
    const result = await this.authService.login(dto);

    // Establecer cookies
    this.setCookies(res, result.accessToken, result.refreshToken);

    // No enviar tokens en el body (solo user info)
    return ResponseHelper.success(
      { user: result.user },
      "Login exitoso"
    );
  }

  @Public()
  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<any>> {
    const refreshToken = req.cookies['refreshToken'];

    if (!refreshToken) {
      return ResponseHelper.unauthorized('Refresh token no proporcionado');
    }

    const result = await this.authService.refresh(refreshToken);

    // Establecer nueva cookie de access token
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutos
    });

    return ResponseHelper.success(
      { user: result.user },
      "Token renovado exitosamente"
    );
  }

  @Public()
  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ApiResponse<any>> {
    const refreshToken = req.cookies['refreshToken'];

    // Revocar refresh token
    await this.authService.logout(refreshToken);

    // Limpiar cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return ResponseHelper.success(null, "Sesión cerrada correctamente");
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  async getProfile(@CurrentUser() user: any): Promise<ApiResponse<any>> {
    const usuarioCompleto = await this.authService.getMe(user.id);
    return ResponseHelper.success(
      usuarioCompleto,
      "Perfil del usuario autenticado"
    );
  }
}
