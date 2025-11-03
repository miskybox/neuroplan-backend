"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var config_1 = require("@nestjs/config");
var http_module_1 = require("./common/http/http.module");
var peis_module_1 = require("./modules/peis/peis.module");
var aws_module_1 = require("./modules/aws/aws.module");
var auth_module_1 = require("./modules/auth/auth.module");
var dashboard_module_1 = require("./modules/dashboard/dashboard.module");
var notifications_module_1 = require("./modules/notifications/notifications.module");
var supabase_module_1 = require("./modules/supabase/supabase.module");
var uploads_module_1 = require("./modules/uploads/uploads.module");
var extract_module_1 = require("./extract/extract.module");
var app_controller_1 = require("./app.controller");
var students_module_1 = require("./modules/students/students.module");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        (0, common_1.Module)({
            imports: [
                // Configuración de variables de entorno
                config_1.ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                // Módulos core
                http_module_1.HttpModule,
                // Autenticación y seguridad
                auth_module_1.AuthModule,
                // Módulos funcionales
                peis_module_1.PeisModule,
                // Módulo de uploads y gestión de archivos
                uploads_module_1.UploadsModule,
                // Módulo de extracción y análisis
                extract_module_1.ExtractModule,
                // Módulo de almacenamiento (AWS S3)
                aws_module_1.AwsModule,
                // Módulos de interfaz
                dashboard_module_1.DashboardModule,
                notifications_module_1.NotificationsModule,
                // Módulo de estudiantes
                students_module_1.StudentsModule,
                // Base de datos
                supabase_module_1.SupabaseModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [],
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
