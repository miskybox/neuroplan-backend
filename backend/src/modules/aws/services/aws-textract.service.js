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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsTextractService = void 0;
var common_1 = require("@nestjs/common");
var AwsTextractService = /** @class */ (function () {
    function AwsTextractService() {
        this.mockMode = !process.env.AWS_TEXTRACT_API_KEY;
    }
    /**
     * Extract text from document using AWS Textract
     * Supports PDF, PNG, JPEG, TIFF
     */
    AwsTextractService.prototype.extractText = function (fileBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockExtractText()];
                }
                // PRODUCTION: Real AWS Textract implementation
                // Requires: npm install @aws-sdk/client-textract
                // const textract = new TextractClient({ region: 'eu-west-1' });
                // const command = new DetectDocumentTextCommand({
                //   Document: { Bytes: fileBuffer }
                // });
                // const result = await textract.send(command);
                // return this.parseTextractResponse(result);
                return [2 /*return*/, this.mockExtractText()];
            });
        });
    };
    /**
     * Advanced document analysis with forms and tables
     */
    AwsTextractService.prototype.analyzeDocument = function (fileBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.mockMode) {
                    return [2 /*return*/, this.mockAnalyzeDocument()];
                }
                // PRODUCTION: Real AWS Textract Analyze implementation
                // Requires: npm install @aws-sdk/client-textract
                // const textract = new TextractClient({ region: 'eu-west-1' });
                // const command = new AnalyzeDocumentCommand({
                //   Document: { Bytes: fileBuffer },
                //   FeatureTypes: [FeatureType.FORMS, FeatureType.TABLES]
                // });
                // const result = await textract.send(command);
                // return this.parseAnalyzeResponse(result);
                return [2 /*return*/, this.mockAnalyzeDocument()];
            });
        });
    };
    // ========================================
    // MOCK IMPLEMENTATIONS
    // ========================================
    AwsTextractService.prototype.mockExtractText = function () {
        return {
            text: "INFORME PSICOPEDAG\u00D3GICO\n\nDatos del Alumno:\nNombre: Juan P\u00E9rez Garc\u00EDa\nFecha de Nacimiento: 15/05/2010\nEdad: 13 a\u00F1os\nCurso: 2\u00BA ESO\n\nMotivo de Consulta:\nDificultades en lectoescritura y comprensi\u00F3n lectora detectadas por el tutor.\n\nPruebas Administradas:\n- WISC-V (Escala de Inteligencia de Wechsler)\n- PROLEC-SE (Evaluaci\u00F3n de Procesos Lectores)\n- DST-J (Test de Dislexia)\n\nResultados:\n1. Capacidad Intelectual:\n   - CI Total: 105 (Promedio)\n   - Comprensi\u00F3n Verbal: 95\n   - Razonamiento Perceptivo: 110\n   - Memoria de Trabajo: 88 (Por debajo del promedio)\n   - Velocidad de Procesamiento: 82 (Por debajo del promedio)\n\n2. Lectoescritura:\n   - Precisi\u00F3n lectora: Percentil 20 (Dificultad significativa)\n   - Velocidad lectora: 60 palabras/min (Esperado: 120 p/min)\n   - Comprensi\u00F3n lectora: Percentil 25 (Dificultad)\n   - Escritura: Errores frecuentes de ortograf\u00EDa arbitraria\n\n3. Observaciones:\n   - Inversiones de letras (b/d, p/q)\n   - Omisiones y sustituciones frecuentes\n   - Lectura sil\u00E1bica y laboriosa\n   - Fatiga r\u00E1pida en tareas de lectura prolongada\n   - Buena expresi\u00F3n oral\n\nDiagn\u00F3stico:\nDISLEXIA EVOLUTIVA MODERADA (CIE-10: F81.0)\n\nFortalezas:\n\u2713 Capacidad intelectual normal-promedio\n\u2713 Razonamiento l\u00F3gico bien desarrollado\n\u2713 Habilidades visuoespaciales adecuadas\n\u2713 Buena motivaci\u00F3n y esfuerzo\n\u2713 Excelente expresi\u00F3n oral\n\nNecesidades Educativas Especiales:\n- Apoyo especializado en lectoescritura (3 sesiones/semana)\n- Adaptaciones metodol\u00F3gicas en el aula\n- Tiempo adicional en ex\u00E1menes (50% m\u00E1s)\n- Evaluaci\u00F3n preferente oral\n- Material adaptado con letra grande y espaciado\n\nRecomendaciones:\n1. Programa de intervenci\u00F3n fonol\u00F3gica\n2. Entrenamiento en estrategias de comprensi\u00F3n lectora\n3. Uso de tecnolog\u00EDa de apoyo (text-to-speech)\n4. Coordinaci\u00F3n familia-escuela-especialistas\n5. Revisi\u00F3n trimestral del progreso\n\nPron\u00F3stico:\nFavorable con intervenci\u00F3n adecuada. Se espera mejora significativa en 12-18 meses.\n\nFecha del Informe: 10 de octubre de 2025\nPsicopedagoga: Dra. Mar\u00EDa L\u00F3pez S\u00E1nchez\nColegiada: M-12345",
            confidence: 0.97,
            blocks: 45,
            words: 387,
            lines: 58,
        };
    };
    AwsTextractService.prototype.mockAnalyzeDocument = function () {
        return {
            text: this.mockExtractText().text,
            forms: [
                {
                    key: 'Nombre',
                    value: 'Juan Pérez García',
                    confidence: 0.99,
                },
                {
                    key: 'Fecha de Nacimiento',
                    value: '15/05/2010',
                    confidence: 0.98,
                },
                {
                    key: 'Diagnóstico',
                    value: 'DISLEXIA EVOLUTIVA MODERADA',
                    confidence: 0.96,
                },
            ],
            tables: [
                {
                    title: 'Resultados WISC-V',
                    rows: [
                        ['Escala', 'Puntuación'],
                        ['CI Total', '105'],
                        ['Comprensión Verbal', '95'],
                        ['Razonamiento Perceptivo', '110'],
                        ['Memoria de Trabajo', '88'],
                        ['Velocidad de Procesamiento', '82'],
                    ],
                },
            ],
            metadata: {
                pages: 3,
                language: 'es',
                documentType: 'clinical_report',
            },
        };
    };
    AwsTextractService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], AwsTextractService);
    return AwsTextractService;
}());
exports.AwsTextractService = AwsTextractService;
