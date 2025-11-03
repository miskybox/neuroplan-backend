"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.PeiStreamService = void 0;
var common_1 = require("@nestjs/common");
var node_events_1 = require("node:events");
var PeiStreamService = /** @class */ (function (_super) {
    __extends(PeiStreamService, _super);
    function PeiStreamService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.activeStreams = new Map();
        return _this;
    }
    /**
     * Generate PEI with real-time progress updates
     */
    PeiStreamService.prototype.generatePeiWithProgress = function (studentId, reportId, diagnosis) {
        return __awaiter(this, void 0, void 0, function () {
            var streamId;
            var _this = this;
            return __generator(this, function (_a) {
                streamId = "pei_".concat(studentId, "_").concat(Date.now());
                // Simulate PEI generation with progress updates (async)
                setImmediate(function () {
                    _this.simulatePeiGeneration(streamId, studentId, reportId, diagnosis);
                });
                return [2 /*return*/, streamId];
            });
        });
    };
    /**
     * Simulate PEI generation with realistic progress
     */
    PeiStreamService.prototype.simulatePeiGeneration = function (streamId, studentId, reportId, diagnosis) {
        return __awaiter(this, void 0, void 0, function () {
            var steps, _i, steps_1, step, peiResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        steps = [
                            { step: 'analyzing', progress: 10, message: 'Analizando información del estudiante...' },
                            { step: 'extracting', progress: 25, message: 'Extrayendo datos del informe médico...' },
                            { step: 'processing', progress: 40, message: 'Procesando información con IA...' },
                            { step: 'generating', progress: 60, message: 'Generando objetivos del PEI...' },
                            { step: 'adapting', progress: 75, message: 'Creando adaptaciones curriculares...' },
                            { step: 'strategies', progress: 85, message: 'Desarrollando estrategias de intervención...' },
                            { step: 'evaluation', progress: 95, message: 'Definiendo criterios de evaluación...' },
                            { step: 'finalizing', progress: 100, message: 'Finalizando PEI...' }
                        ];
                        _i = 0, steps_1 = steps;
                        _a.label = 1;
                    case 1:
                        if (!(_i < steps_1.length)) return [3 /*break*/, 4];
                        step = steps_1[_i];
                        // Emit progress update
                        this.emit('progress', {
                            streamId: streamId,
                            step: step.step,
                            progress: step.progress,
                            message: step.message,
                            timestamp: new Date().toISOString()
                        });
                        // Simulate processing time
                        return [4 /*yield*/, this.delay(1000 + Math.random() * 2000)];
                    case 2:
                        // Simulate processing time
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [4 /*yield*/, this.generateFinalPei(studentId, reportId, diagnosis)];
                    case 5:
                        peiResult = _a.sent();
                        // Emit completion
                        this.emit('completed', {
                            streamId: streamId,
                            result: peiResult,
                            timestamp: new Date().toISOString()
                        });
                        // Clean up
                        this.activeStreams.delete(streamId);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Generate the final PEI content
     */
    PeiStreamService.prototype.generateFinalPei = function (studentId, reportId, diagnosis) {
        return __awaiter(this, void 0, void 0, function () {
            var peiContent;
            return __generator(this, function (_a) {
                peiContent = {
                    studentId: studentId,
                    reportId: reportId,
                    diagnosis: diagnosis || 'Diagnóstico de ejemplo',
                    objectives: [
                        {
                            id: 'obj_1',
                            title: 'Mejora de la atención sostenida',
                            description: 'Desarrollar la capacidad de mantener la atención durante 15 minutos consecutivos',
                            priority: 'high',
                            timeline: '3 meses'
                        },
                        {
                            id: 'obj_2',
                            title: 'Desarrollo de habilidades sociales',
                            description: 'Fomentar la interacción positiva con compañeros',
                            priority: 'medium',
                            timeline: '6 meses'
                        }
                    ],
                    adaptations: [
                        {
                            type: 'curricular',
                            description: 'Adaptación de materiales con pictogramas',
                            implementation: 'En todas las asignaturas'
                        },
                        {
                            type: 'metodológica',
                            description: 'Uso de rutinas visuales',
                            implementation: 'Diariamente en el aula'
                        }
                    ],
                    strategies: [
                        {
                            area: 'Atención',
                            strategy: 'Técnica de la tortuga',
                            frequency: 'Diaria',
                            responsible: 'Tutor/a'
                        },
                        {
                            area: 'Social',
                            strategy: 'Grupos cooperativos',
                            frequency: 'Semanal',
                            responsible: 'Orientador/a'
                        }
                    ],
                    evaluation: {
                        criteria: [
                            'Observación directa del comportamiento',
                            'Registros de progreso semanales',
                            'Evaluación trimestral con la familia'
                        ],
                        tools: [
                            'Escala de observación',
                            'Registro anecdótico',
                            'Entrevista familiar'
                        ]
                    },
                    timeline: {
                        start: new Date().toISOString(),
                        reviews: [
                            { date: '2024-02-01', type: 'revisión trimestral' },
                            { date: '2024-05-01', type: 'evaluación intermedia' },
                            { date: '2024-08-01', type: 'evaluación final' }
                        ]
                    }
                };
                return [2 /*return*/, {
                        id: "pei_".concat(studentId, "_").concat(Date.now()),
                        studentId: studentId,
                        content: peiContent,
                        status: 'completed'
                    }];
            });
        });
    };
    /**
     * Get active streams
     */
    PeiStreamService.prototype.getActiveStreams = function () {
        return Array.from(this.activeStreams.keys());
    };
    /**
     * Cancel a stream
     */
    PeiStreamService.prototype.cancelStream = function (streamId) {
        if (this.activeStreams.has(streamId)) {
            clearTimeout(this.activeStreams.get(streamId));
            this.activeStreams.delete(streamId);
            this.emit('cancelled', { streamId: streamId, timestamp: new Date().toISOString() });
            return true;
        }
        return false;
    };
    /**
     * Utility function for delays
     */
    PeiStreamService.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    PeiStreamService = __decorate([
        (0, common_1.Injectable)()
    ], PeiStreamService);
    return PeiStreamService;
}(node_events_1.EventEmitter));
exports.PeiStreamService = PeiStreamService;
