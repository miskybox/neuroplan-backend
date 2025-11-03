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
exports.AuthService = void 0;
var common_1 = require("@nestjs/common");
var jwt_1 = require("@nestjs/jwt");
var db_1 = require("../../db");
var AuthService = /** @class */ (function () {
    function AuthService(jwtService) {
        this.jwtService = jwtService;
    }
    AuthService.prototype.register = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, uuidDemo, validRoles, centerId, role, _a, authData, authError, userData, dbUser, payload, accessToken, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 4, , 5]);
                        console.log('🔐 Registrando usuario con Supabase Auth');
                        return [4 /*yield*/, (0, db_1.getUserByEmail)(dto.email)];
                    case 1:
                        existingUser = _b.sent();
                        if (existingUser) {
                            throw new common_1.ConflictException('El email ya está registrado');
                        }
                        uuidDemo = '11111111-1111-1111-1111-111111111111';
                        validRoles = ['ADMIN', 'ORIENTADOR', 'PROFESOR', 'DIRECTOR_CENTRO'];
                        centerId = dto.centerId;
                        role = dto.role;
                        // Validar UUID simple (versión básica)
                        if (!/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i.test(centerId)) {
                            centerId = uuidDemo;
                        }
                        if (!validRoles.includes(role)) {
                            role = 'ADMIN';
                        }
                        return [4 /*yield*/, db_1.supabase.auth.signUp({
                                email: dto.email,
                                password: dto.password,
                                options: {
                                    emailRedirectTo: undefined, // No redirigir a confirmación
                                    data: {
                                        first_name: dto.firstName,
                                        last_name: dto.lastName,
                                        role: role,
                                        center_id: centerId,
                                    }
                                }
                            })];
                    case 2:
                        _a = _b.sent(), authData = _a.data, authError = _a.error;
                        if (authError) {
                            console.error('Error en Supabase Auth:', JSON.stringify(authError, null, 2));
                            throw new common_1.BadRequestException('Error al crear usuario: ' + authError.message);
                        }
                        if (!authData.user) {
                            console.error('Supabase Auth no devolvió usuario:', JSON.stringify(authData, null, 2));
                            throw new common_1.BadRequestException('No se pudo crear el usuario');
                        }
                        userData = {
                            email: dto.email,
                            role: role,
                            first_name: dto.firstName,
                            last_name: dto.lastName,
                            center_id: centerId,
                        };
                        return [4 /*yield*/, (0, db_1.createUser)(userData)];
                    case 3:
                        dbUser = _b.sent();
                        payload = {
                            sub: dbUser.id,
                            email: dbUser.email,
                            rol: dbUser.role,
                            centroId: dbUser.center_id,
                        };
                        accessToken = this.jwtService.sign(payload);
                        return [2 /*return*/, {
                                accessToken: accessToken,
                                user: {
                                    id: dbUser.id,
                                    email: dbUser.email,
                                    role: dbUser.role,
                                    firstName: dbUser.first_name,
                                    lastName: dbUser.last_name,
                                    centerId: dbUser.center_id,
                                },
                                authUser: authData.user, // Información adicional de Supabase Auth
                            }];
                    case 4:
                        error_1 = _b.sent();
                        console.error('Error en registro:', error_1);
                        if (error_1 instanceof common_1.ConflictException || error_1 instanceof common_1.BadRequestException) {
                            throw error_1;
                        }
                        throw new common_1.BadRequestException('Error interno del servidor');
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.login = function (dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, authData, authError, dbUser, payload, accessToken, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, , 4]);
                        console.log('🔐 Autenticando usuario con Supabase Auth');
                        return [4 /*yield*/, db_1.supabase.auth.signInWithPassword({
                                email: dto.email,
                                password: dto.password,
                            })];
                    case 1:
                        _a = _b.sent(), authData = _a.data, authError = _a.error;
                        if (authError) {
                            console.error('Error en Supabase Auth:', authError);
                            throw new common_1.UnauthorizedException('Credenciales inválidas');
                        }
                        if (!authData.user) {
                            throw new common_1.UnauthorizedException('Usuario no encontrado');
                        }
                        return [4 /*yield*/, (0, db_1.getUserByEmail)(dto.email)];
                    case 2:
                        dbUser = _b.sent();
                        if (!dbUser) {
                            throw new common_1.UnauthorizedException('Usuario no encontrado en la base de datos');
                        }
                        payload = {
                            sub: dbUser.id,
                            email: dbUser.email,
                            rol: dbUser.role,
                            centroId: dbUser.center_id,
                        };
                        accessToken = this.jwtService.sign(payload);
                        return [2 /*return*/, {
                                accessToken: accessToken,
                                user: {
                                    id: dbUser.id,
                                    email: dbUser.email,
                                    role: dbUser.role,
                                    firstName: dbUser.first_name,
                                    lastName: dbUser.last_name,
                                    centerId: dbUser.center_id,
                                },
                                authUser: authData.user, // Información adicional de Supabase Auth
                            }];
                    case 3:
                        error_2 = _b.sent();
                        console.error('Error en login:', error_2);
                        if (error_2 instanceof common_1.UnauthorizedException) {
                            throw error_2;
                        }
                        throw new common_1.UnauthorizedException('Error interno del servidor');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.validateUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, db_1.getUserById)(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Usuario no autorizado');
                        }
                        return [2 /*return*/, user];
                    case 2:
                        error_3 = _a.sent();
                        console.error('Error validando usuario:', error_3);
                        throw new common_1.UnauthorizedException('Usuario no autorizado');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.getMe = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var user, error_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, (0, db_1.getUserById)(userId)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Usuario no autorizado');
                        }
                        return [2 /*return*/, {
                                id: user.id,
                                email: user.email,
                                role: user.role,
                                firstName: user.first_name,
                                lastName: user.last_name,
                                centerId: user.center_id,
                                active: user.active,
                            }];
                    case 2:
                        error_4 = _a.sent();
                        console.error('Error obteniendo usuario:', error_4);
                        throw new common_1.UnauthorizedException('Usuario no autorizado');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Método para cerrar sesión
    AuthService.prototype.logout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase.auth.signOut()];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('Error cerrando sesión:', error);
                            throw new common_1.BadRequestException('Error al cerrar sesión');
                        }
                        return [2 /*return*/, { message: 'Sesión cerrada correctamente' }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error en logout:', error_5);
                        throw new common_1.BadRequestException('Error interno del servidor');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Método para verificar token de Supabase
    AuthService.prototype.verifySupabaseToken = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase.auth.getUser(token)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            throw new common_1.UnauthorizedException('Token inválido');
                        }
                        return [2 /*return*/, data.user];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Error verificando token:', error_6);
                        throw new common_1.UnauthorizedException('Token inválido');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [jwt_1.JwtService])
    ], AuthService);
    return AuthService;
}());
exports.AuthService = AuthService;
