import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './modules/prisma/prisma.module';
import { PeisModule } from './modules/peis/peis.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ElevenLabsModule } from './modules/elevenlabs/elevenlabs.module';
import { LinkupModule } from './modules/linkup/linkup.module';
import { N8nModule } from './modules/n8n/n8n.module';

@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Módulos core
    PrismaModule,

    // Módulos funcionales
    PeisModule,
    UploadsModule,
    
    // Integraciones con sponsors (hackathon)
    ElevenLabsModule,
    LinkupModule,
    N8nModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}