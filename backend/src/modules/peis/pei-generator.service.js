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
exports.PeiGeneratorService = void 0;
var common_1 = require("@nestjs/common");
var database_service_1 = require("../supabase/database.service");
var llm_service_1 = require("../../llm/llm.service");
var PeiGeneratorService = /** @class */ (function () {
    function PeiGeneratorService(databaseService, llmService) {
        this.databaseService = databaseService;
        this.llmService = llmService;
    }
    PeiGeneratorService.prototype.generatePei = function (generatePeiDto, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var student, smartObjectives, adaptations, evaluationPlan, peiData, _a, pei, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.databaseService.getClient()
                            .from('students')
                            .select('*')
                            .eq('id', generatePeiDto.studentId)
                            .eq('created_by', userId)
                            .single()];
                    case 1:
                        student = (_b.sent()).data;
                        if (!student) {
                            throw new Error('Estudiante no encontrado');
                        }
                        return [4 /*yield*/, this.generateSmartObjectives(generatePeiDto)];
                    case 2:
                        smartObjectives = _b.sent();
                        return [4 /*yield*/, this.generateAdaptations(generatePeiDto)];
                    case 3:
                        adaptations = _b.sent();
                        return [4 /*yield*/, this.generateEvaluationPlan(generatePeiDto)];
                    case 4:
                        evaluationPlan = _b.sent();
                        peiData = {
                            student_id: generatePeiDto.studentId,
                            created_by: userId,
                            diagnosis: generatePeiDto.diagnosis,
                            academic_level: generatePeiDto.academicLevel,
                            smart_objectives: smartObjectives,
                            adaptations: adaptations,
                            evaluation_plan: evaluationPlan,
                            created_at: new Date().toISOString(),
                            status: 'active',
                        };
                        return [4 /*yield*/, this.databaseService.getClient()
                                .from('peis')
                                .insert(peiData)
                                .select()
                                .single()];
                    case 5:
                        _a = _b.sent(), pei = _a.data, error = _a.error;
                        if (error) {
                            throw new Error("Error al guardar PEI: ".concat(error.message));
                        }
                        return [2 /*return*/, pei];
                }
            });
        });
    };
    PeiGeneratorService.prototype.generateSmartObjectives = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        prompt = "\n    Genera 3-5 objetivos SMART (Espec\u00EDficos, Medibles, Alcanzables, Relevantes y con Tiempo definido) \n    para un estudiante con las siguientes caracter\u00EDsticas:\n    - Edad: ".concat(dto.age, " a\u00F1os\n    - Nivel acad\u00E9mico: ").concat(dto.academicLevel, "\n    - Diagn\u00F3stico: ").concat(dto.diagnosis, "\n    - Fortalezas: ").concat(((_a = dto.strengths) === null || _a === void 0 ? void 0 : _a.join(', ')) || 'No especificadas', "\n    - \u00C1reas de mejora: ").concat(((_b = dto.areasToImprove) === null || _b === void 0 ? void 0 : _b.join(', ')) || 'No especificadas', "\n    - Intereses: ").concat(((_c = dto.interests) === null || _c === void 0 ? void 0 : _c.join(', ')) || 'No especificados', "\n    \n    Formato de respuesta: Array JSON de objetivos, cada uno con:\n    - description: Descripci\u00F3n del objetivo\n    - timeframe: Periodo para lograrlo (semanas/meses)\n    - evaluation_criteria: C\u00F3mo se medir\u00E1 el \u00E9xito\n    ");
                        return [4 /*yield*/, this.llmService.generateText(prompt)];
                    case 1:
                        response = _d.sent();
                        try {
                            return [2 /*return*/, JSON.parse(response)];
                        }
                        catch (e) {
                            console.error('Error parsing AI response:', e);
                            return [2 /*return*/, [
                                    {
                                        description: 'Mejorar habilidades de atención',
                                        timeframe: '3 meses',
                                        evaluation_criteria: 'Completar tareas sin distracciones por 15 minutos',
                                    },
                                ]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PeiGeneratorService.prototype.generateAdaptations = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "\n    Genera adaptaciones curriculares para un estudiante con las siguientes caracter\u00EDsticas:\n    - Edad: ".concat(dto.age, " a\u00F1os\n    - Nivel acad\u00E9mico: ").concat(dto.academicLevel, "\n    - Diagn\u00F3stico: ").concat(dto.diagnosis, "\n    \n    Formato de respuesta: Array JSON de adaptaciones, cada una con:\n    - subject: Asignatura\n    - adaptation_type: Tipo de adaptaci\u00F3n (metodol\u00F3gica, de contenido, de evaluaci\u00F3n)\n    - description: Descripci\u00F3n detallada\n    ");
                        return [4 /*yield*/, this.llmService.generateText(prompt)];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, JSON.parse(response)];
                        }
                        catch (e) {
                            console.error('Error parsing AI response:', e);
                            return [2 /*return*/, [
                                    {
                                        subject: 'Matemáticas',
                                        adaptation_type: 'Metodológica',
                                        description: 'Utilizar material concreto y visual para explicar conceptos abstractos',
                                    },
                                ]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PeiGeneratorService.prototype.generateEvaluationPlan = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var prompt, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "\n    Genera un plan de evaluaci\u00F3n y seguimiento para un estudiante con las siguientes caracter\u00EDsticas:\n    - Edad: ".concat(dto.age, " a\u00F1os\n    - Nivel acad\u00E9mico: ").concat(dto.academicLevel, "\n    - Diagn\u00F3stico: ").concat(dto.diagnosis, "\n    \n    Formato de respuesta: Array JSON con elementos del plan, cada uno con:\n    - evaluation_area: \u00C1rea a evaluar\n    - frequency: Frecuencia de evaluaci\u00F3n\n    - methods: M\u00E9todos de evaluaci\u00F3n\n    - responsible: Responsable del seguimiento\n    ");
                        return [4 /*yield*/, this.llmService.generateText(prompt)];
                    case 1:
                        response = _a.sent();
                        try {
                            return [2 /*return*/, JSON.parse(response)];
                        }
                        catch (e) {
                            console.error('Error parsing AI response:', e);
                            return [2 /*return*/, [
                                    {
                                        evaluation_area: 'Progreso académico',
                                        frequency: 'Mensual',
                                        methods: 'Revisión de tareas y evaluaciones',
                                        responsible: 'Profesor y orientador',
                                    },
                                ]];
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    PeiGeneratorService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [database_service_1.DatabaseService,
            llm_service_1.LlmService])
    ], PeiGeneratorService);
    return PeiGeneratorService;
}());
exports.PeiGeneratorService = PeiGeneratorService;
