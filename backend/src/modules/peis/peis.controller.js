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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.PeisController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var rxjs_1 = require("rxjs");
var peis_service_1 = require("./peis.service");
var pei_stream_service_1 = require("./pei-stream.service");
var pei_generator_service_1 = require("./pei-generator.service");
var generate_pei_dto_1 = require("./dto/generate-pei.dto");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
var PeisController = /** @class */ (function () {
    function PeisController(peisService, peiStreamService, peiGeneratorService) {
        this.peisService = peisService;
        this.peiStreamService = peiStreamService;
        this.peiGeneratorService = peiGeneratorService;
    }
    PeisController.prototype.generatePei = function (generatePeiDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, pei, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        userId = user.id || user.userId;
                        return [4 /*yield*/, this.peiGeneratorService.generatePei(generatePeiDto, userId)];
                    case 1:
                        pei = _a.sent();
                        return [2 /*return*/, {
                                success: true,
                                pei: pei,
                                message: 'PEI generado correctamente',
                            }];
                    case 2:
                        error_1 = _a.sent();
                        throw new common_1.BadRequestException("Error al generar PEI: ".concat(error_1.message));
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PeisController.prototype.generatePeiFromDiagnosis = function (diagnosisData, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Llama a generatePEI del servicio
                return [2 /*return*/, this.peisService.generatePEI(diagnosisData)];
            });
        });
    };
    PeisController.prototype.getAllPeis = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Llama a getPEIsByUser del servicio
                return [2 /*return*/, this.peisService.getPEIsByUser(user.id)];
            });
        });
    };
    PeisController.prototype.getPeiById = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var pei, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.peisService.getPEIById(id)];
                    case 1:
                        pei = _a.sent();
                        if (!pei)
                            throw new common_1.NotFoundException('PEI no encontrado');
                        return [2 /*return*/, pei];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.NotFoundException(error_2.message || 'PEI no encontrado');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    PeisController.prototype.updatePeiStatus = function (id, body) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!body.status) {
                    throw new common_1.BadRequestException('Estado requerido');
                }
                // No existe updatePeiStatus, se usa updatePEI
                return [2 /*return*/, this.peisService.updatePEI(id, { status: body.status })];
            });
        });
    };
    PeisController.prototype.downloadPeiPdf = function (id, res) {
        return __awaiter(this, void 0, void 0, function () {
            var pei, exportData, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.peisService.getPEIById(id)];
                    case 1:
                        pei = _a.sent();
                        if (!pei)
                            throw new common_1.NotFoundException('PEI no encontrado');
                        return [4 /*yield*/, this.peisService.exportPEI(id, 'pdf')];
                    case 2:
                        exportData = _a.sent();
                        // Redirige a la URL mock
                        return [2 /*return*/, res.redirect(exportData.downloadUrl)];
                    case 3:
                        error_3 = _a.sent();
                        throw new common_1.NotFoundException(error_3.message || 'PEI no encontrado');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PeisController.prototype.getPeisByStudent = function (studentId, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.peisService.getPEIsByStudent(studentId)];
            });
        });
    };
    PeisController.prototype.generatePeiAudio = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.peisService.generatePeiAudio(id, user.id)];
            });
        });
    };
    PeisController.prototype.generatePeiWithProgress = function (body, user) {
        return __awaiter(this, void 0, void 0, function () {
            var streamId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.peiStreamService.generatePeiWithProgress(body.studentId, body.reportId, body.diagnosis)];
                    case 1:
                        streamId = _a.sent();
                        return [2 /*return*/, {
                                streamId: streamId,
                                message: 'PEI generation started. Use the stream ID to listen for progress updates.',
                            }];
                }
            });
        });
    };
    PeisController.prototype.streamProgress = function (streamId) {
        var _this = this;
        return new rxjs_1.Observable(function (observer) {
            var onProgress = function (data) {
                if (data.streamId === streamId) {
                    observer.next({
                        data: JSON.stringify(data),
                        type: 'progress',
                    });
                }
            };
            var onCompleted = function (data) {
                if (data.streamId === streamId) {
                    observer.next({
                        data: JSON.stringify(data),
                        type: 'completed',
                    });
                    observer.complete();
                }
            };
            var onCancelled = function (data) {
                if (data.streamId === streamId) {
                    observer.next({
                        data: JSON.stringify(data),
                        type: 'cancelled',
                    });
                    observer.complete();
                }
            };
            _this.peiStreamService.on('progress', onProgress);
            _this.peiStreamService.on('completed', onCompleted);
            _this.peiStreamService.on('cancelled', onCancelled);
            // Cleanup on unsubscribe
            return function () {
                _this.peiStreamService.off('progress', onProgress);
                _this.peiStreamService.off('completed', onCompleted);
                _this.peiStreamService.off('cancelled', onCancelled);
            };
        });
    };
    PeisController.prototype.cancelGeneration = function (streamId) {
        var cancelled = this.peiStreamService.cancelStream(streamId);
        if (!cancelled) {
            throw new common_1.NotFoundException('Stream not found or already completed');
        }
        return {
            message: 'PEI generation cancelled successfully',
            streamId: streamId,
        };
    };
    PeisController.prototype.getActiveStreams = function () {
        var activeStreams = this.peiStreamService.getActiveStreams();
        return {
            activeStreams: activeStreams,
            count: activeStreams.length,
        };
    };
    PeisController.prototype.testEndpoint = function () {
        return {
            message: 'PEI service is working!',
            timestamp: new Date().toISOString(),
            status: 'ok'
        };
    };
    __decorate([
        (0, common_1.Post)('generate'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '🧠 Generate PEI using AI',
            description: "\n**Frontend endpoint** - Generates a complete PEI using AI based on student information.\n\n**Simplified flow:**\n1. \uD83E\uDDE0 Receives student data and diagnosis\n2. \uD83D\uDCCB Generates personalized SMART objectives with AI\n3. \uD83C\uDFAF Creates specific curricular adaptations\n4. \uD83D\uDCCA Defines evaluation and monitoring plan\n\n**Result:** Complete PEI in seconds.\n\n**Frontend usage:** This is the main endpoint for PEI generation."
        }),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [generate_pei_dto_1.GeneratePeiDto, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "generatePei", null);
    __decorate([
        (0, common_1.Post)('generate-from-diagnosis'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '🧠 Generate PEI from direct diagnosis',
            description: "\n**Frontend endpoint** - Generates a complete PEI from direct diagnosis without needing to upload a report.\n\n**Simplified flow:**\n1. \uD83E\uDDE0 Receives diagnosis data directly\n2. \uD83D\uDCCB Generates personalized SMART objectives with Claude AI\n3. \uD83C\uDFAF Creates specific curricular adaptations\n4. \uD83D\uDCCA Defines evaluation and monitoring plan\n\n**Result:** Complete PEI in seconds.\n\n**Frontend usage:** This is the endpoint you need for the demo.\n    ",
        }),
        (0, swagger_1.ApiResponse)({
            status: 201,
            description: 'PEI generated successfully from diagnosis',
            schema: {
                example: {
                    id: 'clxxxxx',
                    version: 1,
                    summary: 'Plan Educativo Individualizado para Ana Pérez...',
                    diagnosis: 'Dislexia moderada',
                    objectives: [
                        'Mejorar velocidad lectora de 60 a 90 palabras/min en 6 meses',
                        'Incrementar comprensión lectora del percentil 25 al 40',
                    ],
                    adaptations: {
                        lengua: 'Tiempo adicional 50%, tipografía OpenDyslexic',
                        matematicas: 'Calculadora permitida, problemas con visuales',
                    },
                    strategies: [
                        'Método Orton-Gillingham multisensorial',
                        'Text-to-speech para textos largos',
                    ],
                    status: 'DRAFT',
                    createdAt: '2025-10-12T10:30:00.000Z',
                    studentId: 'clxxxxx',
                },
            },
        }),
        (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid data' }),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "generatePeiFromDiagnosis", null);
    __decorate([
        (0, common_1.Get)(),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: 'Listar todos los PEIs',
            description: 'Obtiene todos los PEIs con información del estudiante y recursos asociados',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Lista de PEIs',
            schema: {
                example: [
                    {
                        id: 'clxxxxx',
                        version: 1,
                        summary: 'Plan para María García López...',
                        status: 'ACTIVE',
                        createdAt: '2025-10-11T14:35:00.000Z',
                        student: {
                            id: 'clxxxxx',
                            name: 'María',
                            lastName: 'García López',
                            grade: '6º Primaria',
                        },
                        audioFiles: [
                            {
                                id: 'clxxxxx',
                                type: 'SUMMARY',
                                duration: 45,
                                language: 'es',
                            },
                        ],
                        resourceLinks: [
                            {
                                id: 'clxxxxx',
                                title: 'Apps para TDAH infantil',
                                category: 'app',
                                relevance: 0.95,
                            },
                        ],
                    },
                ],
            },
        }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "getAllPeis", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: 'Obtener PEI específico',
            description: "\nObtiene un PEI completo con todos sus datos estructurados.\n\n**Incluye:**\n- \uD83D\uDCC4 Resumen ejecutivo y diagn\u00F3stico\n- \uD83C\uDFAF Objetivos SMART detallados \n- \uD83D\uDD27 Adaptaciones curriculares\n- \uD83D\uDCCA Criterios de evaluaci\u00F3n\n- \uD83D\uDDD3\uFE0F Planificaci\u00F3n temporal\n- \uD83D\uDD0A S\u00EDntesis de voz (AWS Polly)\n- \uD83D\uDCDA Recursos educativos integrados\n- \uD83D\uDCF1 Acceso multiplataforma\n    ",
        }),
        (0, swagger_1.ApiParam)({
            name: 'id',
            description: 'ID único del PEI',
            example: 'clxxxxx',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'PEI completo con datos estructurados',
            schema: {
                example: {
                    id: 'clxxxxx',
                    summary: 'Plan Educativo Individualizado para María García López...',
                    diagnosis: 'Diagnóstico principal: TDAH combinado moderado...',
                    objectives: [
                        {
                            id: 'obj-1',
                            title: 'Mejorar atención sostenida',
                            description: 'Aumentar el tiempo de concentración...',
                            area: 'cognitive',
                            timeframe: 'medium',
                            criteria: ['Mantiene atención 15 minutos mínimo'],
                            strategies: ['Técnicas de mindfulness adaptadas'],
                        },
                    ],
                    adaptations: [
                        {
                            type: 'access',
                            description: 'Tiempo adicional en evaluaciones (25% extra)',
                            subject: 'todas',
                            implementation: 'Aplicar en todas las pruebas',
                        },
                    ],
                    student: {
                        name: 'María',
                        lastName: 'García López',
                        grade: '6º Primaria',
                    },
                    audioFiles: [],
                    resourceLinks: [],
                },
            },
        }),
        (0, swagger_1.ApiResponse)({ status: 404, description: 'PEI no encontrado' }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "getPeiById", null);
    __decorate([
        (0, common_1.Patch)(':id/status'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: 'Actualizar estado del PEI',
            description: "\nCambia el estado de un PEI en el workflow de aprobaci\u00F3n.\n\n**Estados disponibles:**\n- \uD83D\uDFE1 **DRAFT**: Borrador inicial\n- \uD83D\uDD35 **REVIEW**: En revisi\u00F3n por equipo educativo\n- \uD83D\uDFE2 **APPROVED**: Aprobado oficialmente\n- \u2705 **ACTIVE**: Activo y en implementaci\u00F3n\n- \uD83D\uDCE6 **ARCHIVED**: Archivado/completado\n\n**Flujo t\u00EDpico:** DRAFT \u2192 REVIEW \u2192 APPROVED \u2192 ACTIVE \u2192 ARCHIVED\n    ",
        }),
        (0, swagger_1.ApiParam)({
            name: 'id',
            description: 'ID único del PEI',
            example: 'clxxxxx',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Estado actualizado correctamente',
            schema: {
                example: {
                    id: 'clxxxxx',
                    status: 'APPROVED',
                    approvedAt: '2025-10-11T15:00:00.000Z',
                    updatedAt: '2025-10-11T15:00:00.000Z',
                },
            },
        }),
        (0, swagger_1.ApiResponse)({ status: 400, description: 'Estado no válido' }),
        (0, swagger_1.ApiResponse)({ status: 404, description: 'PEI no encontrado' }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "updatePeiStatus", null);
    __decorate([
        (0, common_1.Get)(':id/pdf'),
        (0, swagger_1.ApiOperation)({
            summary: '📄 Descargar PEI en PDF',
            description: "\nGenera y descarga el PEI en formato PDF oficial para:\n- \uD83D\uDCCB Documentaci\u00F3n oficial del centro\n- \uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66 Entrega a familias\n- \uD83C\uDFDB\uFE0F Inspecci\u00F3n educativa\n- \uD83D\uDCBE Archivo permanente\n\n**Formato:** PDF/A-1b (est\u00E1ndar documental)\n**Contenido:** PEI completo con firma digital\n    ",
        }),
        (0, swagger_1.ApiParam)({
            name: 'id',
            description: 'ID único del PEI',
            example: 'clxxxxx',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Archivo PDF del PEI',
            headers: {
                'Content-Type': {
                    description: 'application/pdf',
                    schema: { type: 'string' },
                },
                'Content-Disposition': {
                    description: 'attachment; filename="PEI_Maria_Garcia.pdf"',
                    schema: { type: 'string' },
                },
            },
        }),
        (0, swagger_1.ApiResponse)({ status: 404, description: 'PEI no encontrado' }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "downloadPeiPdf", null);
    __decorate([
        (0, common_1.Get)('student/:studentId'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: 'Obtener PEIs de un estudiante específico',
            description: 'Obtiene todos los PEIs asociados a un estudiante específico',
        }),
        (0, swagger_1.ApiParam)({
            name: 'studentId',
            description: 'ID del estudiante',
            example: 'clxxxxx',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Lista de PEIs del estudiante',
        }),
        __param(0, (0, common_1.Param)('studentId')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "getPeisByStudent", null);
    __decorate([
        (0, common_1.Post)(':id/audio'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: '🔊 Generar audio del PEI',
            description: 'Convierte el PEI a audio usando AWS Polly para accesibilidad',
        }),
        (0, swagger_1.ApiParam)({
            name: 'id',
            description: 'ID único del PEI',
            example: 'clxxxxx',
        }),
        (0, swagger_1.ApiResponse)({
            status: 201,
            description: 'Audio generado correctamente',
            schema: {
                example: {
                    id: 'clxxxxx',
                    url: 'https://s3.amazonaws.com/neuroplan-audio/pei-123.mp3',
                    duration: 180,
                    language: 'es',
                    voice: 'Conchita',
                    createdAt: '2025-10-11T15:00:00.000Z',
                },
            },
        }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "generatePeiAudio", null);
    __decorate([
        (0, common_1.Post)('generate-with-progress'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '🚀 Generate PEI with real-time progress',
            description: 'Generates a PEI with Server-Sent Events (SSE) for real-time progress updates',
        }),
        (0, swagger_1.ApiResponse)({
            status: 201,
            description: 'PEI generation started with stream ID',
            schema: {
                example: {
                    streamId: 'pei_student123_1703500800000',
                    message: 'PEI generation started. Use the stream ID to listen for progress updates.',
                },
            },
        }),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], PeisController.prototype, "generatePeiWithProgress", null);
    __decorate([
        (0, common_1.Get)('progress/:streamId'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, common_1.Sse)(),
        (0, swagger_1.ApiOperation)({
            summary: '📡 Listen to PEI generation progress',
            description: 'Server-Sent Events endpoint to receive real-time progress updates during PEI generation',
        }),
        (0, swagger_1.ApiParam)({
            name: 'streamId',
            description: 'Stream ID returned from generate-with-progress endpoint',
            example: 'pei_student123_1703500800000',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Real-time progress updates via SSE',
            content: {
                'text/event-stream': {
                    schema: {
                        type: 'string',
                        example: 'data: {"step":"analyzing","progress":10,"message":"Analizando información del estudiante..."}\n\n',
                    },
                },
            },
        }),
        __param(0, (0, common_1.Param)('streamId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", rxjs_1.Observable)
    ], PeisController.prototype, "streamProgress", null);
    __decorate([
        (0, common_1.Post)('cancel/:streamId'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '❌ Cancel PEI generation',
            description: 'Cancels an ongoing PEI generation process',
        }),
        (0, swagger_1.ApiParam)({
            name: 'streamId',
            description: 'Stream ID to cancel',
            example: 'pei_student123_1703500800000',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'PEI generation cancelled successfully',
        }),
        (0, swagger_1.ApiResponse)({
            status: 404,
            description: 'Stream not found or already completed',
        }),
        __param(0, (0, common_1.Param)('streamId')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", void 0)
    ], PeisController.prototype, "cancelGeneration", null);
    __decorate([
        (0, common_1.Get)('active-streams'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '📊 Get active PEI generation streams',
            description: 'Returns a list of currently active PEI generation streams',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'List of active streams',
            schema: {
                example: {
                    activeStreams: [
                        'pei_student123_1703500800000',
                        'pei_student456_1703500900000',
                    ],
                    count: 2,
                },
            },
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PeisController.prototype, "getActiveStreams", null);
    __decorate([
        (0, common_1.Get)('test'),
        (0, swagger_1.ApiOperation)({
            summary: '🧪 Test endpoint (no auth required)',
            description: 'Simple test endpoint to verify the service is working',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Test response',
            schema: {
                example: {
                    message: 'PEI service is working!',
                    timestamp: '2025-10-25T18:15:00.000Z',
                    status: 'ok'
                },
            },
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], PeisController.prototype, "testEndpoint", null);
    PeisController = __decorate([
        (0, swagger_1.ApiTags)('peis'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, common_1.Controller)('peis'),
        __metadata("design:paramtypes", [peis_service_1.PeisService,
            pei_stream_service_1.PeiStreamService,
            pei_generator_service_1.PeiGeneratorService])
    ], PeisController);
    return PeisController;
}());
exports.PeisController = PeisController;
