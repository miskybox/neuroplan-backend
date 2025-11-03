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
exports.LlmService = void 0;
var common_1 = require("@nestjs/common");
var http_service_1 = require("../common/http/http.service");
var axios_1 = require("axios");
var SYSTEM_PROMPT = "Eres un asistente educativo. Devuelve EXCLUSIVAMENTE un JSON v\u00E1lido con las claves:\nmeta, student, assessment, goals, supports, plan.\nSi falta info, estima y marca \"(estimado)\". Sin texto extra.";
var LlmService = /** @class */ (function () {
    function LlmService(httpService) {
        this.httpService = httpService;
        this.logger = new common_1.Logger(LlmService_1.name);
    }
    LlmService_1 = LlmService;
    LlmService.prototype.generateText = function (prompt) {
        return __awaiter(this, void 0, void 0, function () {
            var body, baseUrl, response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        body = {
                            model: process.env.OLLAMA_MODEL || 'llama3.2:3b',
                            prompt: prompt,
                            stream: false,
                            options: { temperature: 0.2 }
                        };
                        baseUrl = process.env.OLLAMA_BASE_URL || process.env.OLLAMA_URL || 'http://localhost:11434';
                        if (process.env.NODE_ENV !== 'production') {
                            this.logger.debug('[LLM] Enviando solicitud a Ollama');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.httpService.post("".concat(baseUrl, "/api/generate"), body)];
                    case 2:
                        data = (_a.sent()).data;
                        response = data.response;
                        this.logger.debug('[LLM] Respuesta recibida de Ollama');
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        this.handleOllamaError(error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, response];
                }
            });
        });
    };
    LlmService.prototype.peiFromText = function (student_1, text_1) {
        return __awaiter(this, arguments, void 0, function (student, text, context) {
            var prompt, response;
            if (context === void 0) { context = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prompt = "".concat(SYSTEM_PROMPT, "\n\nPerfil del estudiante:\n").concat(JSON.stringify(student, null, 2), "\n\nTexto cl\u00EDnico:\n").concat(text, "\n\nContexto del centro:\n").concat(context, "\n\nDevuelve SOLO el JSON.");
                        return [4 /*yield*/, this.generateText(prompt)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, this.parseOllamaResponse(response)];
                }
            });
        });
    };
    LlmService.prototype.parseOllamaResponse = function (response) {
        var parsed;
        try {
            parsed = JSON.parse(response);
        }
        catch (_a) {
            // Intentar extraer JSON del texto
            var first = response.indexOf('{');
            var last = response.lastIndexOf('}');
            if (first >= 0 && last > first) {
                try {
                    parsed = JSON.parse(response.slice(first, last + 1));
                }
                catch (_b) {
                    this.logger.error('[LLM] No se pudo parsear JSON de la respuesta');
                    throw new common_1.BadRequestException('El modelo no devolvió JSON válido');
                }
            }
            else {
                this.logger.error('[LLM] No se encontró JSON en la respuesta');
                throw new common_1.BadRequestException('El modelo no devolvió JSON válido');
            }
        }
        // Validar estructura mínima
        if (!parsed || typeof parsed !== 'object' || !parsed.meta || !parsed.student) {
            this.logger.error('[LLM] JSON incompleto o inesperado');
            throw new common_1.BadRequestException('El modelo devolvió un JSON incompleto');
        }
        this.logger.debug('[LLM] JSON parseado correctamente');
        return parsed;
    };
    LlmService.prototype.handleOllamaError = function (error) {
        var _a, _b, _c;
        if (error instanceof axios_1.AxiosError) {
            var status_1 = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
            var message = ((_c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.data) === null || _c === void 0 ? void 0 : _c.message) || error.message;
            this.logger.error("[LLM] Error de Ollama (".concat(status_1, "): ").concat(message));
            if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
                throw new common_1.BadRequestException('No se pudo conectar con Ollama. Asegúrate de que esté corriendo en ' +
                    (process.env.OLLAMA_URL || 'http://localhost:11434'));
            }
            throw new common_1.BadRequestException("Error de Ollama: ".concat(message));
        }
        this.logger.error('[LLM] Error desconocido:', error);
        throw new common_1.BadRequestException('Error al comunicarse con Ollama');
    };
    var LlmService_1;
    LlmService = LlmService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [http_service_1.HttpService])
    ], LlmService);
    return LlmService;
}());
exports.LlmService = LlmService;
