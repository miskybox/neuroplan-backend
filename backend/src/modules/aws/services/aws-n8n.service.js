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
exports.AwsN8nService = void 0;
var common_1 = require("@nestjs/common");
var http_service_1 = require("../../../common/http/http.service");
/**
 * N8N Service
 * Integración con N8N para automatización de workflows
 */
var AwsN8nService = /** @class */ (function () {
    function AwsN8nService(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(AwsN8nService_1.name);
        this.mockMode = !process.env.N8N_API_KEY;
        this.n8nUrl = process.env.N8N_URL || 'http://localhost:5678';
        this.apiKey = process.env.N8N_API_KEY || 'mock-key';
    }
    AwsN8nService_1 = AwsN8nService;
    /**
     * Ejecutar workflow de N8N
     */
    AwsN8nService.prototype.triggerWorkflow = function (workflowId_1, data_1) {
        return __awaiter(this, arguments, void 0, function (workflowId, data, options) {
            var result, error_1;
            if (options === void 0) { options = {}; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mockMode) {
                            return [2 /*return*/, this.mockTriggerWorkflow(workflowId, data)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpService.post("".concat(this.n8nUrl, "/api/v1/workflows/").concat(workflowId, "/execute"), {
                                data: data,
                                waitForCompletion: options.waitForCompletion || false,
                                timeout: options.timeout || 30000,
                            }, {
                                headers: {
                                    'X-N8N-API-KEY': this.apiKey,
                                },
                            })];
                    case 2:
                        result = (_a.sent()).data;
                        return [2 /*return*/, {
                                executionId: result.executionId,
                                status: result.status,
                                result: result.data,
                            }];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error('Error triggering N8N workflow:', error_1);
                        return [2 /*return*/, {
                                executionId: "mock-".concat(Date.now()),
                                status: 'error',
                                error: error_1 instanceof Error ? error_1.message : 'Unknown error',
                            }];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener historial de ejecuciones
     */
    AwsN8nService.prototype.getExecutions = function (workflowId_1) {
        return __awaiter(this, arguments, void 0, function (workflowId, limit) {
            var url, result, error_2;
            if (limit === void 0) { limit = 50; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mockMode) {
                            return [2 /*return*/, this.mockGetExecutions(workflowId, limit)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        url = workflowId
                            ? "".concat(this.n8nUrl, "/api/v1/executions?workflowId=").concat(workflowId, "&limit=").concat(limit)
                            : "".concat(this.n8nUrl, "/api/v1/executions?limit=").concat(limit);
                        return [4 /*yield*/, this.httpService.get(url, {
                                headers: {
                                    'X-N8N-API-KEY': this.apiKey,
                                },
                            })];
                    case 2:
                        result = (_a.sent()).data;
                        return [2 /*return*/, result.data.map(function (execution) { return ({
                                id: execution.id,
                                workflowId: execution.workflowId,
                                status: execution.status,
                                startedAt: execution.startedAt,
                                finishedAt: execution.finishedAt,
                                data: execution.data,
                            }); })];
                    case 3:
                        error_2 = _a.sent();
                        this.logger.error('Error getting N8N executions:', error_2);
                        return [2 /*return*/, this.mockGetExecutions(workflowId, limit)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Obtener estado de una ejecución específica
     */
    AwsN8nService.prototype.getExecutionStatus = function (executionId) {
        return __awaiter(this, void 0, void 0, function () {
            var result, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (this.mockMode) {
                            return [2 /*return*/, this.mockGetExecutionStatus(executionId)];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpService.get("".concat(this.n8nUrl, "/api/v1/executions/").concat(executionId), {
                                headers: {
                                    'X-N8N-API-KEY': this.apiKey,
                                },
                            })];
                    case 2:
                        result = (_a.sent()).data;
                        return [2 /*return*/, {
                                id: result.id,
                                status: result.status,
                                progress: result.progress || 0,
                                result: result.data,
                                error: result.error,
                            }];
                    case 3:
                        error_3 = _a.sent();
                        this.logger.error('Error getting execution status:', error_3);
                        return [2 /*return*/, this.mockGetExecutionStatus(executionId)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Enviar notificación automática
     */
    AwsN8nService.prototype.sendNotificationWorkflow = function (type, data) {
        return __awaiter(this, void 0, void 0, function () {
            var workflowId;
            return __generator(this, function (_a) {
                workflowId = this.getWorkflowIdByType(type);
                return [2 /*return*/, this.triggerWorkflow(workflowId, data, { waitForCompletion: true })];
            });
        });
    };
    /**
     * Generar reporte automático mensual
     */
    AwsN8nService.prototype.generateMonthlyReport = function (centerId, month, year) {
        return __awaiter(this, void 0, void 0, function () {
            var workflowId, result;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        workflowId = 'monthly-report-generator';
                        return [4 /*yield*/, this.triggerWorkflow(workflowId, {
                                centerId: centerId,
                                month: month,
                                year: year,
                            }, { waitForCompletion: true })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, {
                                executionId: result.executionId,
                                status: result.status,
                                reportUrl: (_a = result.result) === null || _a === void 0 ? void 0 : _a.reportUrl,
                            }];
                }
            });
        });
    };
    // Métodos mock para desarrollo
    AwsN8nService.prototype.mockTriggerWorkflow = function (workflowId, data) {
        return {
            executionId: "mock-".concat(Date.now()),
            status: 'success',
            result: {
                message: "Workflow ".concat(workflowId, " ejecutado correctamente"),
                data: data,
            },
        };
    };
    AwsN8nService.prototype.mockGetExecutions = function (workflowId, limit) {
        if (limit === void 0) { limit = 50; }
        var executions = [];
        for (var i = 0; i < Math.min(limit, 10); i++) {
            executions.push({
                id: "mock-exec-".concat(i),
                workflowId: workflowId || "workflow-".concat(i % 3),
                status: ['success', 'running', 'error'][i % 3],
                startedAt: new Date(Date.now() - i * 3600000).toISOString(),
                finishedAt: i % 3 !== 1 ? new Date(Date.now() - i * 3600000 + 300000).toISOString() : undefined,
                data: { mock: true, iteration: i },
            });
        }
        return executions;
    };
    AwsN8nService.prototype.mockGetExecutionStatus = function (executionId) {
        return {
            id: executionId,
            status: 'success',
            progress: 100,
            result: {
                message: 'Ejecución completada exitosamente',
                mock: true,
            },
        };
    };
    AwsN8nService.prototype.getWorkflowIdByType = function (type) {
        var workflowMap = {
            'PEI_APPROVED': 'pei-approval-notification',
            'PEI_CREATED': 'pei-creation-notification',
            'REPORT_PROCESSED': 'report-processing-notification',
            'REMINDER': 'reminder-notification',
        };
        return workflowMap[type] || 'default-notification';
    };
    var AwsN8nService_1;
    AwsN8nService = AwsN8nService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [http_service_1.HttpService])
    ], AwsN8nService);
    return AwsN8nService;
}());
exports.AwsN8nService = AwsN8nService;
