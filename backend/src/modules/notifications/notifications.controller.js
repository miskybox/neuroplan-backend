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
exports.NotificationsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var roles_guard_1 = require("../auth/guards/roles.guard");
var roles_decorator_1 = require("../auth/decorators/roles.decorator");
var current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
var notifications_service_1 = require("./notifications.service");
var NotificationsController = /** @class */ (function () {
    function NotificationsController(notificationsService) {
        this.notificationsService = notificationsService;
    }
    NotificationsController.prototype.getNotifications = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notificationsService.getUserNotifications(user.id)];
            });
        });
    };
    NotificationsController.prototype.sendNotification = function (notificationData, user) {
        return __awaiter(this, void 0, void 0, function () {
            var results;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.all(notificationData.userIds.map(function (userId) {
                            return _this.notificationsService.sendNotification({
                                userId: userId,
                                type: notificationData.type,
                                title: notificationData.title,
                                message: notificationData.message,
                                senderId: user.id,
                            });
                        }))];
                    case 1:
                        results = _a.sent();
                        return [2 /*return*/, { success: true, sent: results.length }];
                }
            });
        });
    };
    NotificationsController.prototype.markAsRead = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notificationsService.markAsRead(id, user.id)];
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: '📧 Obtener notificaciones',
            description: 'Obtiene las notificaciones del usuario actual',
        }),
        (0, swagger_1.ApiResponse)({
            status: 200,
            description: 'Lista de notificaciones',
            schema: {
                example: [
                    {
                        id: 'clxxxxx',
                        type: 'PEI_APPROVED',
                        title: 'PEI Aprobado',
                        message: 'El PEI de María García ha sido aprobado',
                        read: false,
                        createdAt: '2025-10-11T15:00:00.000Z',
                    },
                ],
            },
        }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], NotificationsController.prototype, "getNotifications", null);
    __decorate([
        (0, common_1.Post)('send'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR'),
        (0, swagger_1.ApiOperation)({
            summary: '📤 Enviar notificación',
            description: 'Envía una notificación a usuarios específicos',
        }),
        (0, swagger_1.ApiResponse)({
            status: 201,
            description: 'Notificación enviada correctamente',
        }),
        __param(0, (0, common_1.Body)()),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], NotificationsController.prototype, "sendNotification", null);
    __decorate([
        (0, common_1.Post)(':id/mark-read'),
        (0, roles_decorator_1.Roles)('ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO', 'FAMILIA'),
        (0, swagger_1.ApiOperation)({
            summary: '✅ Marcar notificación como leída',
            description: 'Marca una notificación específica como leída',
        }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], NotificationsController.prototype, "markAsRead", null);
    NotificationsController = __decorate([
        (0, swagger_1.ApiTags)('Notifications'),
        (0, swagger_1.ApiBearerAuth)(),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
        (0, common_1.Controller)('notifications'),
        __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
    ], NotificationsController);
    return NotificationsController;
}());
exports.NotificationsController = NotificationsController;
