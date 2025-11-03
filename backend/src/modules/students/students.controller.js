"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.StudentsController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
var database_service_1 = require("../supabase/database.service");
var StudentsController = /** @class */ (function () {
    function StudentsController(databaseService) {
        this.databaseService = databaseService;
    }
    StudentsController.prototype.findAll = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, students, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = user.id || user.userId;
                        return [4 /*yield*/, this.databaseService.getStudentsByUser(userId)];
                    case 1:
                        _a = _b.sent(), students = _a.data, error = _a.error;
                        if (error)
                            throw new common_1.BadRequestException(error.message);
                        return [2 /*return*/, {
                                success: true,
                                students: students,
                                count: students.length,
                            }];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error getting students:', error_1);
                        throw new common_1.BadRequestException('Error al obtener estudiantes: ' + error_1.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentsController.prototype.findOne = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = user.id || user.userId;
                        return [4 /*yield*/, this.databaseService.getClient()
                                .from('students')
                                .select('*')
                                .eq('id', id)
                                .eq('created_by', userId)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw new common_1.BadRequestException(error.message);
                        if (!data)
                            throw new common_1.NotFoundException('Estudiante no encontrado');
                        return [2 /*return*/, { success: true, student: data }];
                }
            });
        });
    };
    StudentsController.prototype.create = function (user, studentDto) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, newStudent, _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        userId = user.id || user.userId;
                        newStudent = __assign(__assign({}, studentDto), { created_by: userId, created_at: new Date().toISOString() });
                        return [4 /*yield*/, this.databaseService.createStudent(newStudent)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw new common_1.BadRequestException(error.message);
                        return [2 /*return*/, {
                                success: true,
                                student: data,
                                message: 'Estudiante creado correctamente',
                            }];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error creating student:', error_2);
                        throw new common_1.BadRequestException('Error al crear estudiante: ' + error_2.message);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    StudentsController.prototype.update = function (id, studentDto, user) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, existingStudent, _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = user.id || user.userId;
                        return [4 /*yield*/, this.databaseService.getClient()
                                .from('students')
                                .select('*')
                                .eq('id', id)
                                .eq('created_by', userId)
                                .single()];
                    case 1:
                        existingStudent = (_b.sent()).data;
                        if (!existingStudent) {
                            throw new common_1.NotFoundException('Estudiante no encontrado');
                        }
                        return [4 /*yield*/, this.databaseService.getClient()
                                .from('students')
                                .update(__assign(__assign({}, studentDto), { updated_at: new Date().toISOString() }))
                                .eq('id', id)
                                .eq('created_by', userId)
                                .select()
                                .single()];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error)
                            throw new common_1.BadRequestException(error.message);
                        return [2 /*return*/, {
                                success: true,
                                student: data,
                                message: 'Estudiante actualizado correctamente',
                            }];
                }
            });
        });
    };
    StudentsController.prototype.remove = function (id, user) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, existingStudent, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = user.id || user.userId;
                        return [4 /*yield*/, this.databaseService.getClient()
                                .from('students')
                                .select('*')
                                .eq('id', id)
                                .eq('created_by', userId)
                                .single()];
                    case 1:
                        existingStudent = (_a.sent()).data;
                        if (!existingStudent) {
                            throw new common_1.NotFoundException('Estudiante no encontrado');
                        }
                        return [4 /*yield*/, this.databaseService.getClient()
                                .from('students')
                                .delete()
                                .eq('id', id)
                                .eq('created_by', userId)];
                    case 2:
                        error = (_a.sent()).error;
                        if (error)
                            throw new common_1.BadRequestException(error.message);
                        return [2 /*return*/, {
                                success: true,
                                message: 'Estudiante eliminado correctamente',
                            }];
                }
            });
        });
    };
    __decorate([
        (0, common_1.Get)(),
        (0, swagger_1.ApiOperation)({
            summary: 'Listar estudiantes',
            description: 'Obtener lista de estudiantes del usuario autenticado',
        }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], StudentsController.prototype, "findAll", null);
    __decorate([
        (0, common_1.Get)(':id'),
        (0, swagger_1.ApiOperation)({
            summary: 'Obtener estudiante',
            description: 'Obtener detalles de un estudiante específico',
        }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], StudentsController.prototype, "findOne", null);
    __decorate([
        (0, common_1.Post)(),
        (0, swagger_1.ApiOperation)({
            summary: 'Crear estudiante',
            description: 'Crear un nuevo estudiante asociado al usuario autenticado',
        }),
        (0, swagger_1.ApiBody)({
            schema: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Juan Pérez' },
                    email: { type: 'string', example: 'juan@ejemplo.com' },
                    edad: { type: 'number', example: 10 },
                    curso: { type: 'string', example: '5º Primaria' },
                    diagnostico: { type: 'string', example: 'TDAH' },
                    necesidadesEspeciales: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Atención personalizada', 'Adaptaciones curriculares'],
                    },
                },
                required: ['name'],
            },
        }),
        __param(0, (0, current_user_decorator_1.CurrentUser)()),
        __param(1, (0, common_1.Body)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object, Object]),
        __metadata("design:returntype", Promise)
    ], StudentsController.prototype, "create", null);
    __decorate([
        (0, common_1.Put)(':id'),
        (0, swagger_1.ApiOperation)({
            summary: 'Actualizar estudiante',
            description: 'Actualizar datos de un estudiante existente',
        }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, common_1.Body)()),
        __param(2, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object, Object]),
        __metadata("design:returntype", Promise)
    ], StudentsController.prototype, "update", null);
    __decorate([
        (0, common_1.Delete)(':id'),
        (0, swagger_1.ApiOperation)({
            summary: 'Eliminar estudiante',
            description: 'Eliminar un estudiante existente',
        }),
        __param(0, (0, common_1.Param)('id')),
        __param(1, (0, current_user_decorator_1.CurrentUser)()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], StudentsController.prototype, "remove", null);
    StudentsController = __decorate([
        (0, swagger_1.ApiTags)('Students'),
        (0, common_1.Controller)('students'),
        (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
        (0, swagger_1.ApiBearerAuth)(),
        __metadata("design:paramtypes", [database_service_1.DatabaseService])
    ], StudentsController);
    return StudentsController;
}());
exports.StudentsController = StudentsController;
