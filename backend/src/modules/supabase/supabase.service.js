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
exports.SupabaseService = void 0;
var common_1 = require("@nestjs/common");
var supabase_js_1 = require("@supabase/supabase-js");
var SupabaseService = /** @class */ (function () {
    function SupabaseService() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://your-project.supabase.co', process.env.SUPABASE_ANON_KEY || 'your-anon-key');
    }
    SupabaseService.prototype.getClient = function () {
        return this.supabase;
    };
    // Auth methods
    SupabaseService.prototype.signUp = function (email, password, userData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase.auth.signUp({
                            email: email,
                            password: password,
                            options: {
                                data: userData
                            }
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, { data: data, error: error }];
                }
            });
        });
    };
    SupabaseService.prototype.signIn = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase.auth.signInWithPassword({
                            email: email,
                            password: password
                        })];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, { data: data, error: error }];
                }
            });
        });
    };
    SupabaseService.prototype.signOut = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.supabase.auth.signOut()];
                    case 1:
                        error = (_a.sent()).error;
                        return [2 /*return*/, { error: error }];
                }
            });
        });
    };
    SupabaseService.prototype.getUser = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, user, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase.auth.getUser()];
                    case 1:
                        _a = _b.sent(), user = _a.data.user, error = _a.error;
                        return [2 /*return*/, { user: user, error: error }];
                }
            });
        });
    };
    // Database methods
    SupabaseService.prototype.from = function (table) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.supabase.from(table)];
            });
        });
    };
    // Storage methods
    SupabaseService.prototype.uploadFile = function (bucket, path, file, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase.storage
                            .from(bucket)
                            .upload(path, file, options)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, { data: data, error: error }];
                }
            });
        });
    };
    SupabaseService.prototype.downloadFile = function (bucket, path) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.supabase.storage
                            .from(bucket)
                            .download(path)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        return [2 /*return*/, { data: data, error: error }];
                }
            });
        });
    };
    SupabaseService.prototype.getPublicUrl = function (bucket, path) {
        return __awaiter(this, void 0, void 0, function () {
            var data;
            return __generator(this, function (_a) {
                data = this.supabase.storage
                    .from(bucket)
                    .getPublicUrl(path).data;
                return [2 /*return*/, data];
            });
        });
    };
    SupabaseService = __decorate([
        (0, common_1.Injectable)(),
        __metadata("design:paramtypes", [])
    ], SupabaseService);
    return SupabaseService;
}());
exports.SupabaseService = SupabaseService;
