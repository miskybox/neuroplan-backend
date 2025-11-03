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
exports.GeneratePeiDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var GeneratePeiDto = /** @class */ (function () {
    function GeneratePeiDto() {
    }
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'ID del estudiante',
            example: '123e4567-e89b-12d3-a456-426614174000',
        }),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], GeneratePeiDto.prototype, "studentId", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Diagnóstico del estudiante',
            example: 'Trastorno por Déficit de Atención e Hiperactividad (TDAH)',
        }),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], GeneratePeiDto.prototype, "diagnosis", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Nivel académico del estudiante',
            example: 'Primaria - 3er grado',
        }),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsNotEmpty)(),
        __metadata("design:type", String)
    ], GeneratePeiDto.prototype, "academicLevel", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Edad del estudiante',
            example: 9,
        }),
        (0, class_validator_1.IsNumber)(),
        (0, class_validator_1.Min)(3),
        (0, class_validator_1.Max)(25),
        __metadata("design:type", Number)
    ], GeneratePeiDto.prototype, "age", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Fortalezas del estudiante',
            example: ['Buena memoria visual', 'Habilidades artísticas'],
            required: false,
        }),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], GeneratePeiDto.prototype, "strengths", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Áreas de mejora del estudiante',
            example: ['Dificultad para mantener la atención', 'Impulsividad'],
            required: false,
        }),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], GeneratePeiDto.prototype, "areasToImprove", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Intereses del estudiante',
            example: ['Deportes', 'Videojuegos', 'Dibujo'],
            required: false,
        }),
        (0, class_validator_1.IsArray)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", Array)
    ], GeneratePeiDto.prototype, "interests", void 0);
    __decorate([
        (0, swagger_1.ApiProperty)({
            description: 'Notas adicionales',
            example: 'El estudiante responde bien a refuerzos positivos y necesita descansos frecuentes',
            required: false,
        }),
        (0, class_validator_1.IsString)(),
        (0, class_validator_1.IsOptional)(),
        __metadata("design:type", String)
    ], GeneratePeiDto.prototype, "additionalNotes", void 0);
    return GeneratePeiDto;
}());
exports.GeneratePeiDto = GeneratePeiDto;
