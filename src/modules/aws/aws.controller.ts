import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import {
  AwsBedrockService,
  AwsTextractService,
  AwsComprehendService,
  AwsS3Service,
  AwsPollyService,
} from './services';

@ApiTags('AWS Services')
@Controller('aws')
export class AwsController {
  constructor(
    private readonly textractService: AwsTextractService,
    private readonly comprehendService: AwsComprehendService,
    private readonly s3Service: AwsS3Service,
    private readonly pollyService: AwsPollyService,
    private readonly bedrockService: AwsBedrockService,
  ) {}

  // ========================================
  // AMAZON BEDROCK - LLM ORCHESTRATION (CRITICAL)
  // ========================================

  @Post('bedrock/invoke')
  @ApiOperation({
    summary: 'Invoke Claude via Amazon Bedrock',
    description: 'AWS way to use LLMs - Foundation model orchestration',
  })
  async invokeBedrock(
    @Body('prompt') prompt: string,
    @Body('maxTokens') maxTokens?: number,
  ) {
    const result = await this.bedrockService.invokeClaudeViaBedrock(prompt, {
      maxTokens: maxTokens || 2000,
      temperature: 0.7,
    });

    return {
      status: 'success',
      service: 'Amazon Bedrock',
      model: result.model,
      completion: result.completion,
      usage: result.usage,
      processing: {
        mode: process.env.AWS_BEDROCK_API_KEY ? 'real' : 'mock',
      },
    };
  }

  @Post('bedrock/generate-pei')
  @ApiOperation({
    summary: 'Generate PEI using Amazon Bedrock',
    description: 'Core NeuroPlan use case: PEI generation via Bedrock+Claude',
  })
  async generatePEIBedrock(
    @Body()
    reportData: {
      diagnosis: string[];
      symptoms: string[];
      strengths: string[];
      studentName: string;
      gradeLevel: string;
    },
  ) {
    const result = await this.bedrockService.generatePEIWithBedrock(reportData);

    return {
      status: 'success',
      service: 'Amazon Bedrock',
      model: result.model,
      pei: result.pei,
      processingTime: `${result.processingTime}ms`,
    };
  }

  @Post('bedrock/simplify-content')
  @ApiOperation({
    summary: 'Simplify educational content via Bedrock',
    description: 'AWS use case: Content simplification for adaptive learning',
  })
  async simplifyContent(
    @Body('content') content: string,
    @Body('targetLevel') targetLevel: string,
  ) {
    const result = await this.bedrockService.simplifyContent(
      content,
      targetLevel,
    );

    return {
      status: 'success',
      service: 'Amazon Bedrock',
      simplifiedContent: result.simplifiedContent,
      readabilityScore: result.readabilityScore,
    };
  }

  @Post('bedrock/tutor-chat')
  @ApiOperation({
    summary: 'Virtual tutor interaction via Bedrock',
    description: 'AWS use case: AI tutor for personalized learning',
  })
  async virtualTutorChat(
    @Body()
    data: {
      question: string;
      studentLevel: string;
      currentTopic: string;
      learningStyle: string;
    },
  ) {
    const result = await this.bedrockService.virtualTutorChat(data.question, {
      studentLevel: data.studentLevel,
      currentTopic: data.currentTopic,
      learningStyle: data.learningStyle,
    });

    return {
      status: 'success',
      service: 'Amazon Bedrock (Virtual Tutor)',
      answer: result.answer,
      suggestions: result.suggestions,
    };
  }

  @Get('bedrock/models')
  @ApiOperation({
    summary: 'List available Bedrock foundation models',
    description: 'Show Claude, Titan, Jurassic-2, and other models',
  })
  async listBedrockModels() {
    const models = await this.bedrockService.listBedrockModels();

    return {
      status: 'success',
      service: 'Amazon Bedrock',
      models,
      totalModels: models.length,
      region: process.env.AWS_REGION || 'eu-west-1',
    };
  }

  // ========================================
  // AWS TEXTRACT - OCR
  // ========================================

  @Post('textract/extract')
  @ApiOperation({
    summary: 'Extract text from document using AWS Textract',
    description: 'OCR processing for medical/educational reports',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async extractText(@UploadedFile() file: Express.Multer.File) {
    const result = await this.textractService.extractText(file.buffer);

    return {
      status: 'success',
      service: 'AWS Textract',
      extractedText: result.text,
      confidence: result.confidence,
      blocks: result.blocks,
      words: result.words,
      lines: result.lines,
      processing: {
        mode: process.env.AWS_TEXTRACT_API_KEY ? 'real' : 'mock',
        timestamp: new Date().toISOString(),
      },
    };
  }

  @Post('textract/analyze-document')
  @ApiOperation({
    summary: 'Advanced document analysis with forms and tables',
    description: 'Extract structured data from complex documents',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async analyzeDocument(@UploadedFile() file: Express.Multer.File) {
    const result = await this.textractService.analyzeDocument(file.buffer);

    return {
      status: 'success',
      service: 'AWS Textract (Analyze)',
      text: result.text,
      forms: result.forms,
      tables: result.tables,
      metadata: result.metadata,
    };
  }

  // ========================================
  // AWS COMPREHEND MEDICAL - NLP
  // ========================================

  @Post('comprehend/detect-entities')
  @ApiOperation({
    summary: 'Detect medical entities using AWS Comprehend Medical',
    description: 'Extract diagnoses, medications, symptoms from text',
  })
  async detectMedicalEntities(@Body('text') text: string) {
    const entities = await this.comprehendService.detectMedicalEntities(text);

    return {
      status: 'success',
      service: 'AWS Comprehend Medical',
      entities: {
        diagnoses: entities.diagnoses,
        medications: entities.medications,
        symptoms: entities.symptoms,
        procedures: entities.procedures,
        anatomy: entities.anatomy,
      },
      totalEntities: entities.total,
      processing: {
        mode: process.env.AWS_COMPREHEND_API_KEY ? 'real' : 'mock',
      },
    };
  }

  @Post('comprehend/detect-phi')
  @ApiOperation({
    summary: 'Detect Protected Health Information (PHI)',
    description: 'Identify sensitive patient data for privacy compliance',
  })
  async detectPHI(@Body('text') text: string) {
    const phi = await this.comprehendService.detectPHI(text);

    return {
      status: 'success',
      service: 'AWS Comprehend Medical (PHI)',
      phi: {
        names: phi.names,
        dates: phi.dates,
        locations: phi.locations,
        ids: phi.ids,
      },
      sensitiveDataDetected: phi.hasSensitiveData,
    };
  }

  // ========================================
  // AWS S3 - STORAGE
  // ========================================

  @Post('s3/upload')
  @ApiOperation({
    summary: 'Upload file to AWS S3',
    description: 'Store reports, PDFs, and generated documents',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadToS3(
    @UploadedFile() file: Express.Multer.File,
    @Body('folder') folder?: string,
  ) {
    const result = await this.s3Service.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      folder || 'reports',
    );

    return {
      status: 'success',
      service: 'AWS S3',
      url: result.url,
      key: result.key,
      bucket: result.bucket,
      size: file.size,
    };
  }

  @Get('s3/download/:key')
  @ApiOperation({
    summary: 'Get signed URL for file download',
    description: 'Generate temporary download link',
  })
  async getDownloadUrl(@Param('key') key: string) {
    const url = await this.s3Service.getSignedUrl(key);

    return {
      status: 'success',
      service: 'AWS S3',
      downloadUrl: url,
      expiresIn: '1 hour',
    };
  }

  // ========================================
  // AWS POLLY - TEXT-TO-SPEECH
  // ========================================

  @Post('polly/synthesize')
  @ApiOperation({
    summary: 'Convert text to speech using AWS Polly',
    description: 'Alternative TTS service with neural voices',
  })
  async synthesizeSpeech(
    @Body('text') text: string,
    @Body('voiceId') voiceId: string = 'Lucia',
  ) {
    const audio = await this.pollyService.synthesizeSpeech(text, voiceId);

    return {
      status: 'success',
      service: 'AWS Polly',
      audioFormat: 'mp3',
      voiceId,
      language: 'es-ES',
      audioUrl: audio.url, // Mock URL or real S3 URL
      duration: audio.duration,
    };
  }

  @Get('polly/voices')
  @ApiOperation({
    summary: 'List available Spanish voices',
    description: 'Get neural and standard voices for Spanish',
  })
  async listVoices() {
    const voices = await this.pollyService.listSpanishVoices();

    return {
      status: 'success',
      service: 'AWS Polly',
      voices,
      totalVoices: voices.length,
    };
  }

  // ========================================
  // INTEGRATION - COMPLETE FLOW
  // ========================================

  @Post('process-report')
  @ApiOperation({
    summary: 'Complete AWS pipeline for report processing',
    description: 'OCR → NLP → Storage → Analysis',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async processReport(@UploadedFile() file: Express.Multer.File) {
    // 1. Upload to S3
    const s3Result = await this.s3Service.uploadFile(
      file.buffer,
      file.originalname,
      file.mimetype,
      'clinical-reports',
    );

    // 2. Extract text with Textract
    const textResult = await this.textractService.extractText(file.buffer);

    // 3. Detect medical entities with Comprehend
    const entities = await this.comprehendService.detectMedicalEntities(
      textResult.text,
    );

    // 4. Detect PHI
    const phi = await this.comprehendService.detectPHI(textResult.text);

    return {
      status: 'success',
      pipeline: 'AWS Complete Processing',
      steps: {
        storage: {
          service: 'S3',
          url: s3Result.url,
          key: s3Result.key,
        },
        ocr: {
          service: 'Textract',
          confidence: textResult.confidence,
          wordsExtracted: textResult.words,
        },
        nlp: {
          service: 'Comprehend Medical',
          diagnoses: entities.diagnoses,
          medications: entities.medications,
          symptoms: entities.symptoms,
        },
        privacy: {
          service: 'Comprehend PHI',
          sensitiveDataDetected: phi.hasSensitiveData,
          phiTypes: Object.keys(phi).filter((k) => phi[k]?.length > 0),
        },
      },
      extractedText: textResult.text,
      medicalData: entities,
      timestamp: new Date().toISOString(),
    };
  }

  // ========================================
  // HEALTH CHECK
  // ========================================

  @Get('health')
  @ApiOperation({
    summary: 'Check AWS services status',
    description: 'Verify all AWS integrations',
  })
  async healthCheck() {
    return {
      status: 'operational',
      services: {
        bedrock: {
          enabled: true,
          mode: process.env.AWS_BEDROCK_API_KEY ? 'real' : 'mock',
          priority: 'CRITICAL',
          description: 'LLM orchestration (Claude via Bedrock)',
        },
        textract: {
          enabled: true,
          mode: process.env.AWS_TEXTRACT_API_KEY ? 'real' : 'mock',
          description: 'OCR for medical reports',
        },
        comprehend: {
          enabled: true,
          mode: process.env.AWS_COMPREHEND_API_KEY ? 'real' : 'mock',
          description: 'Medical NLP + PHI detection',
        },
        s3: {
          enabled: true,
          mode: process.env.AWS_S3_BUCKET ? 'real' : 'mock',
          description: 'Secure file storage',
        },
        polly: {
          enabled: true,
          mode: process.env.AWS_POLLY_API_KEY ? 'real' : 'mock',
          description: 'Text-to-speech (backup ElevenLabs)',
        },
      },
      architecture: {
        compute: 'AWS Lambda (serverless)',
        cdn: 'CloudFront',
        orchestration: 'Amazon Q CLI',
        future: 'Fire TV (Vega OS)',
      },
      region: process.env.AWS_REGION || 'eu-west-1',
      timestamp: new Date().toISOString(),
    };
  }
}
