import { Module } from '@nestjs/common';
import { LinkupController } from './linkup.controller';
import { LinkupService } from './linkup.service';

@Module({
  controllers: [LinkupController],
  providers: [LinkupService],
  exports: [LinkupService],
})
export class LinkupModule {}