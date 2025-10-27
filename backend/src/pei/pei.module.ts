import { Module } from '@nestjs/common';
import { PeiController } from './pei.controller';
import { RenderModule } from '../render/render.module';

@Module({
  imports: [RenderModule],
  controllers: [PeiController],
})
export class PeiModule {}
