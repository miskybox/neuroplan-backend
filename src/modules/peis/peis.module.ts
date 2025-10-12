import { Module } from '@nestjs/common';
import { PeisController } from './peis.controller';
import { PeisService } from './peis.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [PeisController],
  providers: [PeisService],
  exports: [PeisService],
})
export class PeisModule {}
