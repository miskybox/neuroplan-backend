"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var path = __importStar(require("node:path"));
var fs = __importStar(require("node:fs"));
var AppController = /** @class */ (function () {
    function AppController() {
    }
    AppController.prototype.getRoot = function () {
        return {
            message: '🚀 NeuroPlan Backend API',
            version: '1.0.0',
            status: 'online',
            docs: '/api/docs',
            hackathonMode: process.env.HACKATHON_MODE !== 'false',
            timestamp: new Date().toISOString(),
        };
    };
    AppController.prototype.getHealth = function () {
        var _a;
        return {
            status: 'healthy',
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            database: 'connected',
            integrations: {
                aws: process.env.AWS_ACCESS_KEY_ID ? 'configured' : 'mock',
                claude: ((_a = process.env.CLAUDE_API_KEY) === null || _a === void 0 ? void 0 : _a.startsWith('sk-')) ? 'configured' : 'mock',
            },
            timestamp: new Date().toISOString(),
        };
    };
    AppController.prototype.getApiInfo = function () {
        return {
            name: 'NeuroPlan API',
            version: '1.0.0',
            description: 'API para generación automática de PEIs con IA',
            endpoints: {
                peis: '/api/peis',
                uploads: '/api/uploads',
                auth: '/auth',
                aws: '/aws',
                reports: '/api/reports',
            },
            documentation: '/api/docs',
            project: {
                name: 'NeuroPlan MVP',
                target: 'Ayuntamiento de Barcelona',
                technologies: ['NestJS', 'TypeScript', 'PostgreSQL', 'AWS', 'Prisma'],
            },
        };
    };
    AppController.prototype.serveUploadPage = function (res) {
        // Usar process.cwd() para obtener la raíz del proyecto
        var htmlPath = path.join(process.cwd(), 'upload.html');
        if (fs.existsSync(htmlPath)) {
            return res.sendFile(htmlPath);
        }
        else {
            return res.status(404).json({
                error: 'Página no encontrada',
                message: "El archivo upload.html no existe en: ".concat(htmlPath)
            });
        }
    };
    __decorate([
        (0, common_1.Get)(),
        (0, swagger_1.ApiOperation)({
            summary: 'Endpoint raíz',
            description: 'Verifica que el servidor está funcionando correctamente'
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Servidor operativo',
            schema: {
                example: {
                    message: '🚀 NeuroPlan Backend API',
                    version: '1.0.0',
                    status: 'online',
                    docs: '/api/docs',
                    hackathonMode: true
                }
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AppController.prototype, "getRoot", null);
    __decorate([
        (0, common_1.Get)('health'),
        (0, swagger_1.ApiOperation)({
            summary: 'Health Check',
            description: 'Endpoint para verificar el estado del servidor y servicios'
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Servidor saludable',
            schema: {
                example: {
                    status: 'healthy',
                    uptime: 123.45,
                    environment: 'development',
                    database: 'connected',
                    apis: {
                        claude: 'configured',
                        aws: 'configured',
                        prisma: 'connected',
                    },
                    timestamp: '2025-10-11T15:53:20.000Z'
                }
            }
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AppController.prototype, "getHealth", null);
    __decorate([
        (0, common_1.Get)('api'),
        (0, swagger_1.ApiOperation)({
            summary: 'Información de la API',
            description: 'Devuelve información general sobre los endpoints disponibles'
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Información de la API',
        }),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], AppController.prototype, "getApiInfo", null);
    __decorate([
        (0, common_1.Get)('upload'),
        (0, swagger_1.ApiOperation)({
            summary: 'Página de Upload',
            description: 'Sirve la página HTML para subir informes y generar PEIs'
        }),
        __param(0, (0, common_1.Res)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], AppController.prototype, "serveUploadPage", null);
    AppController = __decorate([
        (0, swagger_1.ApiTags)('health'),
        (0, common_1.Controller)()
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;
