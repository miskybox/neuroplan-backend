import { Module } from '@nestjs/common';
import { VonageController } from './vonage.controller';
import { VonageService } from './vonage.service';

@Module({
  controllers: [VonageController],
  providers: [VonageService],
  exports: [VonageService],
})
export class VonageModule {}
