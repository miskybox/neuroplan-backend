"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterDto = void 0;
var class_validator_1 = require("class-validator");
var RegisterDto = /** @class */ (function () {
    function RegisterDto() {
    }
    __decorate([
        (0, class_validator_1.IsEmail)({}, { message: 'El email debe ser válido' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'El email es obligatorio' }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "email", void 0);
    __decorate([
        (0, class_validator_1.IsString)({ message: 'La contraseña debe ser un texto' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria' }),
        (0, class_validator_1.MinLength)(8, { message: 'La contraseña debe tener al menos 8 caracteres' }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "password", void 0);
    __decorate([
        (0, class_validator_1.IsString)({ message: 'El nombre debe ser un texto' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'El nombre es obligatorio' }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "firstName", void 0);
    __decorate([
        (0, class_validator_1.IsString)({ message: 'Los apellidos deben ser un texto' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'Los apellidos son obligatorios' }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "lastName", void 0);
    __decorate([
        (0, class_validator_1.IsString)({ message: 'El rol debe ser un texto' }),
        (0, class_validator_1.IsIn)(['ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO'], {
            message: 'El rol debe ser: ADMIN, ORIENTADOR, PROFESOR o DIRECTOR_CENTRO',
        }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "role", void 0);
    __decorate([
        (0, class_validator_1.IsString)({ message: 'El ID del centro debe ser un texto' }),
        (0, class_validator_1.IsNotEmpty)({ message: 'El ID del centro es obligatorio' }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "centerId", void 0);
    __decorate([
        (0, class_validator_1.IsOptional)(),
        (0, class_validator_1.IsString)({ message: 'Las asignaturas deben ser un texto JSON' }),
        __metadata("design:type", String)
    ], RegisterDto.prototype, "asignaturas", void 0);
    return RegisterDto;
}());
exports.RegisterDto = RegisterDto;
