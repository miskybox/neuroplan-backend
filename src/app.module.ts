import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PeisModule } from './modules/peis/peis.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { AwsModule } from './modules/aws/aws.module';
import { AuthModule } from './modules/auth/auth.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Módulos core
    PrismaModule,
    
    // Autenticación y seguridad
    AuthModule,

    // Módulos funcionales
    PeisModule,
    UploadsModule,
    
    // Módulo de almacenamiento (AWS S3)
    AwsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}