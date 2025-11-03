"use strict";
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
exports.NotificationsService = void 0;
var common_1 = require("@nestjs/common");
var db_1 = require("../../db");
var NotificationsService = /** @class */ (function () {
    function NotificationsService() {
    }
    NotificationsService.prototype.getUserNotifications = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('notifications')
                                .select('*')
                                .eq('user_id', userId)
                                .order('created_at', { ascending: false })
                                .limit(50)];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error getting user notifications:', error);
                            return [2 /*return*/, []];
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        error_1 = _b.sent();
                        console.error('Error getting user notifications:', error_1);
                        return [2 /*return*/, []];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.sendNotification = function (notificationData) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_2;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('notifications')
                                .insert({
                                user_id: notificationData.userId,
                                type: notificationData.type,
                                title: notificationData.title,
                                message: notificationData.message,
                                sender_id: notificationData.senderId,
                                read: false,
                            })
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error sending notification:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                    case 2:
                        error_2 = _b.sent();
                        console.error('Error sending notification:', error_2);
                        throw error_2;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.markAsRead = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_3;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('notifications')
                                .update({ read: true })
                                .eq('id', notificationId)
                                .eq('user_id', userId)
                                .select()
                                .single()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error marking notification as read:', error);
                            throw error;
                        }
                        return [2 /*return*/, data];
                    case 2:
                        error_3 = _b.sent();
                        console.error('Error marking notification as read:', error_3);
                        throw error_3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.markAllAsRead = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, data, error, error_4;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('notifications')
                                .update({ read: true })
                                .eq('user_id', userId)
                                .eq('read', false)
                                .select()];
                    case 1:
                        _a = _b.sent(), data = _a.data, error = _a.error;
                        if (error) {
                            console.error('Error marking all notifications as read:', error);
                            throw error;
                        }
                        return [2 /*return*/, data || []];
                    case 2:
                        error_4 = _b.sent();
                        console.error('Error marking all notifications as read:', error_4);
                        throw error_4;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.getUnreadCount = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, count, error, error_5;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('notifications')
                                .select('count', { count: 'exact' })
                                .eq('user_id', userId)
                                .eq('read', false)];
                    case 1:
                        _a = _b.sent(), count = _a.count, error = _a.error;
                        if (error) {
                            console.error('Error getting unread count:', error);
                            return [2 /*return*/, 0];
                        }
                        return [2 /*return*/, count || 0];
                    case 2:
                        error_5 = _b.sent();
                        console.error('Error getting unread count:', error_5);
                        return [2 /*return*/, 0];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService.prototype.deleteNotification = function (notificationId, userId) {
        return __awaiter(this, void 0, void 0, function () {
            var error, error_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, db_1.supabase
                                .from('notifications')
                                .delete()
                                .eq('id', notificationId)
                                .eq('user_id', userId)];
                    case 1:
                        error = (_a.sent()).error;
                        if (error) {
                            console.error('Error deleting notification:', error);
                            throw error;
                        }
                        return [2 /*return*/, { success: true }];
                    case 2:
                        error_6 = _a.sent();
                        console.error('Error deleting notification:', error_6);
                        throw error_6;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService = __decorate([
        (0, common_1.Injectable)()
    ], NotificationsService);
    return NotificationsService;
}());
exports.NotificationsService = NotificationsService;
