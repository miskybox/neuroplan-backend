"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AwsModule = void 0;
var common_1 = require("@nestjs/common");
var services_1 = require("./services");
var aws_elevenlabs_service_1 = require("./services/aws-elevenlabs.service");
var aws_n8n_service_1 = require("./services/aws-n8n.service");
var aws_controller_1 = require("./aws.controller");
var AwsModule = /** @class */ (function () {
    function AwsModule() {
    }
    AwsModule = __decorate([
        (0, common_1.Module)({
            controllers: [aws_controller_1.AwsController],
            providers: [
                services_1.AwsBedrockService,
                services_1.AwsTextractService,
                services_1.AwsComprehendService,
                services_1.AwsS3Service,
                services_1.AwsPollyService,
                aws_elevenlabs_service_1.AwsElevenlabsService,
                aws_n8n_service_1.AwsN8nService,
            ],
            exports: [
                services_1.AwsBedrockService,
                services_1.AwsTextractService,
                services_1.AwsComprehendService,
                services_1.AwsS3Service,
                services_1.AwsPollyService,
                aws_elevenlabs_service_1.AwsElevenlabsService,
                aws_n8n_service_1.AwsN8nService,
            ],
        })
    ], AwsModule);
    return AwsModule;
}());
exports.AwsModule = AwsModule;
