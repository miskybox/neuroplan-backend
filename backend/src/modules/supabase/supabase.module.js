"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseModule = void 0;
var common_1 = require("@nestjs/common");
var supabase_service_1 = require("./supabase.service");
var database_service_1 = require("./database.service");
var SupabaseModule = /** @class */ (function () {
    function SupabaseModule() {
    }
    SupabaseModule = __decorate([
        (0, common_1.Module)({
            providers: [supabase_service_1.SupabaseService, database_service_1.DatabaseService],
            exports: [supabase_service_1.SupabaseService, database_service_1.DatabaseService],
        })
    ], SupabaseModule);
    return SupabaseModule;
}());
exports.SupabaseModule = SupabaseModule;
