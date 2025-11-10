import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from "@nestjs/common";
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

  @Public()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterDto): Promise<ApiResponse<any>> {
    const result = await this.authService.register(dto);
    return ResponseHelper.created(result, "Usuario registrado exitosamente");
  }

  @Public()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto): Promise<ApiResponse<any>> {
    const result = await this.authService.login(dto);
    return ResponseHelper.success(result, "Login exitoso");
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
