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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpService = void 0;
var common_1 = require("@nestjs/common");
var axios_1 = __importDefault(require("axios"));
var axios_retry_1 = __importDefault(require("axios-retry"));
var HttpService = /** @class */ (function () {
    function HttpService() {
        var _this = this;
        this.logger = new common_1.Logger(HttpService_1.name);
        this.axiosInstance = axios_1.default.create({
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // Configurar retry automático con exponential backoff
        (0, axios_retry_1.default)(this.axiosInstance, {
            retries: 3,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: function (error) {
                var _a, _b;
                // Retry en errores de red o 5xx, pero no en 4xx (errores del cliente)
                return (axios_retry_1.default.isNetworkOrIdempotentRequestError(error) ||
                    ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status) !== null && _b !== void 0 ? _b : 0) >= 500);
            },
            onRetry: function (retryCount, error, requestConfig) {
                _this.logger.warn("Retrying request to ".concat(requestConfig.url, " (attempt ").concat(retryCount, "): ").concat(error.message));
            },
        });
        // Interceptor de request
        this.axiosInstance.interceptors.request.use(function (config) {
            var method = (config.method || 'GET').toUpperCase();
            _this.logger.debug("[HTTP Request] ".concat(method, " ").concat(config.url));
            return config;
        }, function (error) {
            _this.logger.error('[HTTP Request Error]', error);
            return Promise.reject(error);
        });
        // Interceptor de response
        this.axiosInstance.interceptors.response.use(function (response) {
            _this.logger.debug("[HTTP Response] ".concat(response.config.url, " - Status: ").concat(response.status));
            return response;
        }, function (error) {
            var _a, _b;
            var url = ((_a = error.config) === null || _a === void 0 ? void 0 : _a.url) || 'unknown';
            var status = ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) || 'no response';
            _this.logger.error("[HTTP Response Error] ".concat(url, " - Status: ").concat(status), error.message);
            return Promise.reject(error);
        });
    }
    HttpService_1 = HttpService;
    /**
     * GET request
     */
    HttpService.prototype.get = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.axiosInstance.get(url, config)];
            });
        });
    };
    /**
     * POST request
     */
    HttpService.prototype.post = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.axiosInstance.post(url, data, config)];
            });
        });
    };
    /**
     * PUT request
     */
    HttpService.prototype.put = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.axiosInstance.put(url, data, config)];
            });
        });
    };
    /**
     * DELETE request
     */
    HttpService.prototype.delete = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.axiosInstance.delete(url, config)];
            });
        });
    };
    /**
     * PATCH request
     */
    HttpService.prototype.patch = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.axiosInstance.patch(url, data, config)];
            });
        });
    };
    /**
     * Acceso directo a la instancia de axios (para casos avanzados)
     */
    HttpService.prototype.getAxiosInstance = function () {
        return this.axiosInstance;
    };
    var HttpService_1;
    HttpService = HttpService_1 = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;
