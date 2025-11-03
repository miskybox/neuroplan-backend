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
exports.DocumentAnalyzerService = void 0;
var common_1 = require("@nestjs/common");
var llm_service_1 = require("../llm/llm.service");
var extract_service_1 = require("./extract.service");
var DocumentAnalyzerService = /** @class */ (function () {
    function DocumentAnalyzerService(extractService, llmService) {
        this.extractService = extractService;
        this.llmService = llmService;
    }
    DocumentAnalyzerService.prototype.analyzeDocument = function (pdfBuffer) {
        return __awaiter(this, void 0, void 0, function () {
            var extractedText, analysisPrompt, analysisResult, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.extractService.fromPdfBuffer(pdfBuffer)];
                    case 1:
                        extractedText = _a.sent();
                        analysisPrompt = "\n    Analiza el siguiente texto extra\u00EDdo de un informe psicopedag\u00F3gico y extrae la siguiente informaci\u00F3n en formato JSON:\n    \n    1. Diagn\u00F3stico principal\n    2. Edad del estudiante\n    3. Nivel acad\u00E9mico\n    4. Fortalezas identificadas\n    5. \u00C1reas de mejora\n    6. Recomendaciones espec\u00EDficas\n    \n    Texto del informe:\n    ".concat(extractedText.substring(0, 4000), " // Limitamos a 4000 caracteres para evitar tokens excesivos\n    \n    Responde SOLO con un objeto JSON con las siguientes propiedades:\n    {\n      \"diagnostico\": string,\n      \"edad\": number,\n      \"nivelAcademico\": string,\n      \"fortalezas\": string[],\n      \"areasMejora\": string[],\n      \"recomendaciones\": string[]\n    }\n    ");
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.llmService.generateText(analysisPrompt)];
                    case 3:
                        analysisResult = _a.sent();
                        return [2 /*return*/, JSON.parse(analysisResult)];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error al analizar documento con IA:', error_1);
                        // Devolver un resultado parcial en caso de error
                        return [2 /*return*/, {
                                diagnostico: "No se pudo determinar",
                                edad: 0,
                                nivelAcademico: "No se pudo determinar",
                                fortalezas: ["No se pudieron extraer fortalezas"],
                                areasMejora: ["No se pudieron extraer áreas de mejora"],
                                recomendaciones: ["No se pudieron extraer recomendaciones"]
                            }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DocumentAnalyzerService.prototype.generatePeiSuggestions = function (analysisResult) {
        return __awaiter(this, void 0, void 0, function () {
            var suggestionsPrompt, suggestionsResult, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        suggestionsPrompt = "\n    Basado en el siguiente an\u00E1lisis de un informe psicopedag\u00F3gico, genera sugerencias para un Plan Educativo Individualizado (PEI):\n    \n    Diagn\u00F3stico: ".concat(analysisResult.diagnostico, "\n    Edad: ").concat(analysisResult.edad, "\n    Nivel acad\u00E9mico: ").concat(analysisResult.nivelAcademico, "\n    Fortalezas: ").concat(analysisResult.fortalezas.join(', '), "\n    \u00C1reas de mejora: ").concat(analysisResult.areasMejora.join(', '), "\n    \n    Genera sugerencias en formato JSON con las siguientes propiedades:\n    {\n      \"objetivos\": [\n        {\n          \"descripcion\": string,\n          \"plazo\": string,\n          \"criteriosEvaluacion\": string\n        }\n      ],\n      \"adaptacionesCurriculares\": [\n        {\n          \"asignatura\": string,\n          \"tipoAdaptacion\": string,\n          \"descripcion\": string\n        }\n      ],\n      \"estrategiasApoyo\": string[]\n    }\n    ");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.llmService.generateText(suggestionsPrompt)];
                    case 2:
                        suggestionsResult = _a.sent();
                        return [2 /*return*/, JSON.parse(suggestionsResult)];
                    case 3:
                        error_2 = _a.sent();
                        console.error('Error al generar sugerencias para PEI:', error_2);
                        return [2 /*return*/, {
                                objetivos: [
                                    {
                                        descripcion: "Mejorar habilidades de atención",
                                        plazo: "3 meses",
                                        criteriosEvaluacion: "Completar tareas sin distracciones por 15 minutos"
                                    }
                                ],
                                adaptacionesCurriculares: [
                                    {
                                        asignatura: "Lenguaje",
                                        tipoAdaptacion: "Metodológica",
                                        descripcion: "Proporcionar instrucciones claras y concisas"
                                    }
                                ],
                                estrategiasApoyo: ["Trabajo en grupos pequeños", "Uso de material visual"]
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DocumentAnalyzerService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [extract_service_1.ExtractService,
            llm_service_1.LlmService])
    ], DocumentAnalyzerService);
    return DocumentAnalyzerService;
}());
exports.DocumentAnalyzerService = DocumentAnalyzerService;
