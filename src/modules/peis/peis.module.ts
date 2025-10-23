import { Module } from '@nestjs/common';
import { PeisController } from './peis.controller';
import { PeisService } from './peis.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [PeisController],
  providers: [PeisService],
  exports: [PeisService],
})
export class PeisModule {}
