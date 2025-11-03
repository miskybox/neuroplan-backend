"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractModule = void 0;
var common_1 = require("@nestjs/common");
var extract_service_1 = require("./extract.service");
var document_analyzer_service_1 = require("./document-analyzer.service");
var document_analyzer_controller_1 = require("./document-analyzer.controller");
var llm_module_1 = require("../llm/llm.module");
var ExtractModule = /** @class */ (function () {
    function ExtractModule() {
    }
    ExtractModule = __decorate([
        (0, common_1.Module)({
            imports: [llm_module_1.LlmModule],
            controllers: [document_analyzer_controller_1.DocumentAnalyzerController],
            providers: [extract_service_1.ExtractService, document_analyzer_service_1.DocumentAnalyzerService],
            exports: [extract_service_1.ExtractService, document_analyzer_service_1.DocumentAnalyzerService],
        })
    ], ExtractModule);
    return ExtractModule;
}());
exports.ExtractModule = ExtractModule;
