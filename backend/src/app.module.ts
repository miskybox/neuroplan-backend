import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from './common/http/http.module';
import { PeisModule } from './modules/peis/peis.module';
import { AwsModule } from './modules/aws/aws.module';
import { AuthModule } from './modules/auth/auth.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SupabaseModule } from './modules/supabase/supabase.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ExtractModule } from './extract/extract.module';
import { AppController } from './app.controller';
import { StudentsModule } from './modules/students/students.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Módulos core
    HttpModule,
    
    // Autenticación y seguridad
    AuthModule,

    // Módulos funcionales
    PeisModule,
    
    // Módulo de uploads y gestión de archivos
    UploadsModule,
    
    // Módulo de extracción y análisis
    ExtractModule,
    
    // Módulo de almacenamiento (AWS S3)
    AwsModule,
    
  // Módulos de interfaz
  DashboardModule,
  NotificationsModule,

  // Módulo de estudiantes
  StudentsModule,

  // Base de datos
  SupabaseModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}