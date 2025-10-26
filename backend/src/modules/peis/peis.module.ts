import { Module } from '@nestjs/common';
import { PeisController } from './peis.controller';
import { PeisService } from './peis.service';
import { PeiStreamService } from './pei-stream.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PeisController],
  providers: [PeisService, PeiStreamService],
  exports: [PeisService, PeiStreamService],
})
export class PeisModule {}
