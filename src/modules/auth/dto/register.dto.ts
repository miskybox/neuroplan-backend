import { IsEmail, IsNotEmpty, IsString, MinLength, IsIn, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @IsString({ message: 'Los apellidos deben ser un texto' })
  @IsNotEmpty({ message: 'Los apellidos son obligatorios' })
  lastName: string;

  @IsString({ message: 'El rol debe ser un texto' })
  @IsIn(['ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO'], {
    message: 'El rol debe ser: ADMIN, ORIENTADOR, PROFESOR o DIRECTOR_CENTRO',
  })
  rol: string;

  @IsString({ message: 'El ID del centro debe ser un texto' })
  @IsNotEmpty({ message: 'El ID del centro es obligatorio' })
  centroId: string;

  @IsOptional()
  @IsString({ message: 'Las asignaturas deben ser un texto JSON' })
  asignaturas?: string; // JSON array: ["Matemáticas", "Lengua"]
}
