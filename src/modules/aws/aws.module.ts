import { Module } from '@nestjs/common';
import {
  AwsBedrockService,
  AwsTextractService,
  AwsComprehendService,
  AwsS3Service,
  AwsPollyService,
} from './services';
import { AwsElevenlabsService } from './services/aws-elevenlabs.service';
import { AwsN8nService } from './services/aws-n8n.service';
import { AwsController } from './aws.controller';

@Module({
  controllers: [AwsController],
  providers: [
    AwsBedrockService,
    AwsTextractService,
    AwsComprehendService,
    AwsS3Service,
    AwsPollyService,
    AwsElevenlabsService,
    AwsN8nService,
  ],
  exports: [
    AwsBedrockService,
    AwsTextractService,
    AwsComprehendService,
    AwsS3Service,
    AwsPollyService,
    AwsElevenlabsService,
    AwsN8nService,
  ],
})
export class AwsModule {}
