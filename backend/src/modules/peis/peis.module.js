"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PeisModule = void 0;
var common_1 = require("@nestjs/common");
var peis_controller_1 = require("./peis.controller");
var peis_service_1 = require("./peis.service");
var pei_stream_service_1 = require("./pei-stream.service");
var pei_generator_service_1 = require("./pei-generator.service");
var llm_module_1 = require("../../llm/llm.module");
var auth_module_1 = require("../auth/auth.module");
var supabase_module_1 = require("../supabase/supabase.module");
var PeisModule = /** @class */ (function () {
    function PeisModule() {
    }
    PeisModule = __decorate([
        (0, common_1.Module)({
            imports: [llm_module_1.LlmModule, auth_module_1.AuthModule, supabase_module_1.SupabaseModule],
            controllers: [peis_controller_1.PeisController],
            providers: [peis_service_1.PeisService, pei_stream_service_1.PeiStreamService, pei_generator_service_1.PeiGeneratorService],
            exports: [peis_service_1.PeisService, pei_generator_service_1.PeiGeneratorService],
        })
    ], PeisModule);
    return PeisModule;
}());
exports.PeisModule = PeisModule;
