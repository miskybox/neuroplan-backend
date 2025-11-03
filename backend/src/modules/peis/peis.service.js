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
exports.PeisService = void 0;
var common_1 = require("@nestjs/common");
var db_1 = require("../../db");
var PeisService = /** @class */ (function () {
    function PeisService() {
    }
    /**
     * Genera un PEI y lo guarda en la tabla `public.peis`
     * - Esquema real: id, user_id, student_id, pei(jsonb), pdf_key, created_at, updated_at
     * - Guardamos TODO el contenido dentro de `pei` (jsonb)
     */
    PeisService.prototype.generatePEI = function (diagnosisData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, student, studentError, peiPayload, userId, _b, data, error, error_1;
            var _c, _d, _e, _f, _g, _h, _j, _k, _l;
            return __generator(this, function (_m) {
                switch (_m.label) {
                    case 0:
                        _m.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, db_1.supabase
                                .from('students')
                                .select('*')
                                .eq('id', diagnosisData.studentId)
                                .single()];
                    case 1:
                        _a = _m.sent(), student = _a.data, studentError = _a.error;
                        if (studentError || !student) {
                            console.error('Error getting student:', studentError);
                            throw new Error('Estudiante no encontrado');
                        }
                        peiPayload = {
                            student: {
                                id: diagnosisData.studentId,
                                firstName: (_c = student.first_name) !== null && _c !== void 0 ? _c : '',
                                lastName: (_d = student.last_name) !== null && _d !== void 0 ? _d : '',
                                grade: (_e = student.grade) !== null && _e !== void 0 ? _e : null,
                            },
                            diagnosis: diagnosisData.diagnosis,
                            objectives: diagnosisData.objectives || [],
                            adaptations: diagnosisData.adaptations || [],
                            strategies: diagnosisData.strategies || [],
                            evaluation: diagnosisData.evaluation || [],
                            timeline: diagnosisData.timeline || [],
                            meta: {
                                generatedAt: new Date().toISOString(),
                                reportId: (_f = diagnosisData.reportId) !== null && _f !== void 0 ? _f : null,
                                // guarda otros metadatos aquí si lo necesitas
                            },
                            // campos opcionales que te pueden venir bien para vistas
                            summary: "Plan Educativo Individualizado para ".concat((_g = student.first_name) !== null && _g !== void 0 ? _g : '', " ").concat((_h = student.last_name) !== null && _h !== void 0 ? _h : '').trim(),
                            title: "PEI - ".concat((_j = student.first_name) !== null && _j !== void 0 ? _j : '', " ").concat((_k = student.last_name) !== null && _k !== void 0 ? _k : '').trim(),
                            status: 'DRAFT',
                        };
                        userId = (_l = student.created_by) !== null && _l !== void 0 ? _l : 'anon';
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .insert({
                                user_id: userId, // quién crea el PEI
                                student_id: diagnosisData.studentId, // estudiante asociado
                                pei: peiPayload, // JSONB completo
                                // pdf_key: null                           // lo rellenarás cuando subas el PDF a Storage
                            })
                                .select()
                                .single()];
                    case 2:
                        _b = _m.sent(), data = _b.data, error = _b.error;
                        if (error) {
                            console.error('Error inserting PEI:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                    case 3:
                        error_1 = _m.sent();
                        console.error('Error generating PEI:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Devuelve todos los PEIs de un estudiante (ordenados por fecha)
     */
    PeisService.prototype.getPEIsByStudent = function (studentId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .select('*')
                                .eq('student_id', studentId)
                                .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error getting PEIs by student:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error getting PEIs by student:', error_2);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Devuelve un PEI por ID
     */
    PeisService.prototype.getPEIById = function (peiId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .select('*')
                                .eq('id', peiId)
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error getting PEI:', error);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error getting PEI:', error_3);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Actualiza (parcialmente) un PEI
     * - Puedes actualizar `pei` completo o campos concretos dentro de ese JSON (desde el front)
     * - Para MVP, asumimos que nos envías un objeto con la nueva estructura del JSON
     */
    PeisService.prototype.updatePEI = function (peiId, updates) {
        return __awaiter(this, void 0, void 0, function () {
            var row, newPei, _a, data, error, error_4;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this.getPEIById(peiId)];
                    case 1:
                        row = _c.sent();
                        if (!row)
                            throw new Error('PEI no encontrado');
                        newPei = __assign(__assign(__assign({}, row.pei), ((updates === null || updates === void 0 ? void 0 : updates.pei) || updates)), { meta: __assign(__assign({}, (_b = row.pei) === null || _b === void 0 ? void 0 : _b.meta), { updatedAt: new Date().toISOString() }) });
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .update({ pei: newPei })
                                .eq('id', peiId)
                                .select()
                                .single()];
                    case 2:
                        _a = _c.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error updating PEI:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                    case 3:
                        error_4 = _c.sent();
                        console.error('Error updating PEI:', error_4);
                        throw error_4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Elimina un PEI
     */
    PeisService.prototype.deletePEI = function (peiId) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .delete()
                                .eq('id', peiId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('Error deleting PEI:', error);
                            throw error;
                        }
                        return [2 /*return*/, { success: true }];
                    case 2:
                        error_5 = _a.sent();
                        console.error('Error deleting PEI:', error_5);
                        throw error_5;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Devuelve los PEIs creados por un usuario
     */
    PeisService.prototype.getPEIsByUser = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_6;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .select('*')
                                .eq('user_id', userId)
                                .order('created_at', { ascending: false })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error getting PEIs by user:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        error_6 = _b.sent();
                        console.error('Error getting PEIs by user:', error_6);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Búsqueda simple por término dentro de campos típicos del JSON
     * NOTA: Supabase permite filtrar por paths JSON con la sintaxis `pei->>campo`.
     * Aquí intento diagnosis/summary. Ajusta si usas otros nombres.
     */
    PeisService.prototype.searchPEIs = function (searchTerm, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var term, _a, data, error, error_7;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        term = searchTerm === null || searchTerm === void 0 ? void 0 : searchTerm.trim();
                        if (!term)
                            return [2 /*return*/, this.getPEIsByUser(userId)];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .select('*')
                                .eq('user_id', userId)
                                .or("pei->>summary.ilike.%".concat(term, "%,pei->>diagnosis.ilike.%").concat(term, "%"))
                                .order('created_at', { ascending: false })];
                    case 2:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error searching PEIs:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 3:
                        error_7 = _b.sent();
                        console.error('Error searching PEIs:', error_7);
                        return [2 /*return*/, []];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * (Mock) Genera "audio" de un PEI y lo registra en tabla auxiliar
     * Si no tienes `audio_files`, puedes simplemente devolver un objeto mock.
     */
    PeisService.prototype.generatePeiAudio = function (peiId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var pei;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPEIById(peiId)];
                    case 1:
                        pei = _a.sent();
                        if (!pei)
                            throw new Error('PEI no encontrado');
                        // Simulación sencilla para MVP
                        return [2 /*return*/, {
                                pei_id: peiId,
                                url: "https://mock-audio-url.com/pei-".concat(peiId, ".mp3"),
                                duration: 300,
                                language: 'es',
                                voice: 'es-ES-Standard-A',
                                created_at: new Date().toISOString(),
                                created_by: userId,
                            }];
                }
            });
        });
    };
    /**
     * (Mock) Devuelve "audios" asociados. Si no tienes tabla real, devuelve []
     */
    PeisService.prototype.getPeiAudio = function (peiId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // Para MVP sin tabla real:
                return [2 /*return*/, []];
            });
        });
    };
    /**
     * (Mock) Exporta un PEI a fichero y devuelve URL (para MVP)
     * En producción, usar RenderService + Storage (Supabase o S3)
     */
    PeisService.prototype.exportPEI = function (peiId_1) {
        return __awaiter(this, arguments, void 0, function (peiId, format) {
            var pei;
            if (format === void 0) { format = 'pdf'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPEIById(peiId)];
                    case 1:
                        pei = _a.sent();
                        if (!pei)
                            throw new Error('PEI no encontrado');
                        return [2 /*return*/, {
                                peiId: peiId,
                                format: format,
                                downloadUrl: "https://mock-export-url.com/pei-".concat(peiId, ".").concat(format),
                                generatedAt: new Date().toISOString(),
                            }];
                }
            });
        });
    };
    /**
     * Duplica un PEI (crea nueva fila con el JSON actualizado)
     */
    PeisService.prototype.duplicatePEI = function (peiId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var original, newPeiJson, _a, data, error;
            var _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0: return [4 /*yield*/, this.getPEIById(peiId)];
                    case 1:
                        original = _e.sent();
                        if (!original)
                            throw new Error('PEI no encontrado');
                        newPeiJson = __assign(__assign({}, original.pei), { title: "".concat((_c = (_b = original.pei) === null || _b === void 0 ? void 0 : _b.title) !== null && _c !== void 0 ? _c : 'PEI', " (Copia)"), meta: __assign(__assign({}, (_d = original.pei) === null || _d === void 0 ? void 0 : _d.meta), { duplicatedFrom: peiId, duplicatedAt: new Date().toISOString() }), status: 'DRAFT' });
                        return [4 /*yield*/, db_1.supabase
                                .from('peis')
                                .insert({
                                user_id: userId,
                                student_id: original.student_id,
                                pei: newPeiJson,
                            })
                                .select()
                                .single()];
                    case 2:
                        _a = _e.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error duplicating PEI:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    PeisService = __decorate([
        (0, common_1.Injectable)()
    ], PeisService);
    return PeisService;
}());
exports.PeisService = PeisService;
