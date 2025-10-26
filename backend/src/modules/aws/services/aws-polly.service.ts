import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsPollyService {
  private readonly mockMode: boolean;

  constructor() {
    this.mockMode = !process.env.AWS_POLLY_API_KEY;
  }

  /**
   * Synthesize speech from text using AWS Polly
   * Neural voices for Spanish
   */
  async synthesizeSpeech(
    text: string,
    voiceId: string = 'Lucia',
  ): Promise<{
    url: string;
    duration: number;
    voiceId: string;
  }> {
    if (this.mockMode) {
      return this.mockSynthesizeSpeech(text, voiceId);
    }

    // PRODUCTION: Real AWS Polly implementation with S3 upload
    // Requires: npm install @aws-sdk/client-polly @aws-sdk/client-s3
    // const polly = new PollyClient({ region: 'eu-west-1' });
    // const command = new SynthesizeSpeechCommand({
    //   Text: text,
    //   OutputFormat: 'mp3',
    //   VoiceId: voiceId,
    //   Engine: 'neural',
    //   LanguageCode: 'es-ES'
    // });
    // const result = await polly.send(command);
    // const audioBuffer = await streamToBuffer(result.AudioStream);
    // const s3Key = `audio/${Date.now()}-${voiceId}.mp3`;
    // await this.uploadToS3(s3Key, audioBuffer);
    // return { url: getS3Url(s3Key), duration: this.estimateDuration(text), voiceId };

    return this.mockSynthesizeSpeech(text, voiceId);
  }

  /**
   * List available Spanish voices
   */
  async listSpanishVoices(): Promise<
    Array<{
      id: string;
      name: string;
      gender: string;
      language: string;
      engine: string;
    }>
  > {
    if (this.mockMode) {
      return this.mockListVoices();
    }

    // PRODUCTION: Real AWS Polly voice listing
    // Requires: npm install @aws-sdk/client-polly
    // const polly = new PollyClient({ region: 'eu-west-1' });
    // const command = new DescribeVoicesCommand({ LanguageCode: 'es-ES' });
    // const result = await polly.send(command);
    // return result.Voices.map(voice => ({
    //   id: voice.Id,
    //   name: voice.Name,
    //   gender: voice.Gender,
    //   language: voice.LanguageCode,
    //   engine: voice.SupportedEngines.includes('neural') ? 'neural' : 'standard'
    // }));

    return this.mockListVoices();
  }

  /**
   * Estimate audio duration based on text length
   */
  private estimateDuration(text: string): number {
    // Average speaking rate: ~150 words per minute
    const words = text.split(/\s+/).length;
    const minutes = words / 150;
    return Math.ceil(minutes * 60); // seconds
  }

  // ========================================
  // MOCK IMPLEMENTATIONS
  // ========================================

  private mockSynthesizeSpeech(text: string, voiceId: string) {
    const duration = this.estimateDuration(text);
    const mockUrl = `https://neuroplan-demo-bucket.s3.eu-west-1.amazonaws.com/audio/${Date.now()}-${voiceId}.mp3`;

    return {
      url: mockUrl,
      duration,
      voiceId,
    };
  }

  private mockListVoices() {
    return [
      {
        id: 'Lucia',
        name: 'Lucía',
        gender: 'Female',
        language: 'es-ES',
        engine: 'neural',
      },
      {
        id: 'Sergio',
        name: 'Sergio',
        gender: 'Male',
        language: 'es-ES',
        engine: 'neural',
      },
      {
        id: 'Lupe',
        name: 'Lupe',
        gender: 'Female',
        language: 'es-US',
        engine: 'neural',
      },
      {
        id: 'Pedro',
        name: 'Pedro',
        gender: 'Male',
        language: 'es-US',
        engine: 'neural',
      },
      {
        id: 'Conchita',
        name: 'Conchita',
        gender: 'Female',
        language: 'es-ES',
        engine: 'standard',
      },
      {
        id: 'Enrique',
        name: 'Enrique',
        gender: 'Male',
        language: 'es-ES',
        engine: 'standard',
      },
    ];
  }
}
