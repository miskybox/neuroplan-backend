import { Module } from '@nestjs/common';
import {
  AwsBedrockService,
  AwsTextractService,
  AwsComprehendService,
  AwsS3Service,
  AwsPollyService,
} from './services';
import { AwsController } from './aws.controller';

@Module({
  controllers: [AwsController],
  providers: [
    AwsBedrockService,
    AwsTextractService,
    AwsComprehendService,
    AwsS3Service,
    AwsPollyService,
  ],
  exports: [
    AwsBedrockService,
    AwsTextractService,
    AwsComprehendService,
    AwsS3Service,
    AwsPollyService,
  ],
})
export class AwsModule {}
