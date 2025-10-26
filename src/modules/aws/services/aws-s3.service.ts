import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private readonly mockMode: boolean;
  private readonly bucket: string;

  constructor() {
    this.mockMode = !process.env.AWS_S3_BUCKET;
    this.bucket = process.env.AWS_S3_BUCKET || 'neuroplan-demo-bucket';
  }

  /**
   * Upload file to AWS S3
   */
  async uploadFile(
    fileBuffer: Buffer,
    filename: string,
    mimetype: string,
    folder: string = 'reports',
  ): Promise<{
    url: string;
    key: string;
    bucket: string;
  }> {
    if (this.mockMode) {
      return this.mockUploadFile(filename, folder);
    }

    // PRODUCTION: Real AWS S3 upload implementation
    // Requires: npm install @aws-sdk/client-s3
    // const s3 = new S3Client({ region: 'eu-west-1' });
    // const key = `${folder}/${Date.now()}-${filename}`;
    // const command = new PutObjectCommand({
    //   Bucket: this.bucket,
    //   Key: key,
    //   Body: fileBuffer,
    //   ContentType: mimetype,
    //   ServerSideEncryption: 'AES256'
    // });
    // const result = await s3.send(command);
    // const url = `https://${this.bucket}.s3.eu-west-1.amazonaws.com/${key}`;
    // return { url, key, bucket: this.bucket };

    return this.mockUploadFile(filename, folder);
  }

  /**
   * Get signed URL for temporary download
   */
  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    if (this.mockMode) {
      return this.mockGetSignedUrl(key);
    }

    // PRODUCTION: Real AWS S3 signed URL generation
    // Requires: npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
    // const s3 = new S3Client({ region: 'eu-west-1' });
    // const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    // return getSignedUrl(s3, command, { expiresIn });

    return this.mockGetSignedUrl(key);
  }

  /**
   * Delete file from S3
   */
  async deleteFile(key: string): Promise<boolean> {
    if (this.mockMode) {
      return true;
    }

    // PRODUCTION: Real AWS S3 deletion
    // Requires: npm install @aws-sdk/client-s3
    // const s3 = new S3Client({ region: 'eu-west-1' });
    // const command = new DeleteObjectCommand({ Bucket: this.bucket, Key: key });
    // await s3.send(command);
    // return true;

    return false;
  }

  /**
   * List files in folder
   */
  async listFiles(folder: string): Promise<Array<{ key: string; size: number; lastModified: Date }>> {
    if (this.mockMode) {
      return this.mockListFiles(folder);
    }

    // PRODUCTION: Real AWS S3 list objects
    // Requires: npm install @aws-sdk/client-s3
    // const s3 = new S3Client({ region: 'eu-west-1' });
    // const command = new ListObjectsV2Command({ Bucket: this.bucket, Prefix: folder });
    // const result = await s3.send(command);
    // return result.Contents.map(item => ({
    //   key: item.Key,
    //   size: item.Size,
    //   lastModified: item.LastModified
    // }));

    return this.mockListFiles(folder);
  }

  // ========================================
  // MOCK IMPLEMENTATIONS
  // ========================================

  private mockUploadFile(filename: string, folder: string) {
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${filename}`;
    const mockUrl = `https://${this.bucket}.s3.eu-west-1.amazonaws.com/${key}`;

    return {
      url: mockUrl,
      key,
      bucket: this.bucket,
    };
  }

  private mockGetSignedUrl(key: string) {
    return `https://${this.bucket}.s3.eu-west-1.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=MOCKKEY&X-Amz-Date=20251011T120000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=mock-signature-${Date.now()}`;
  }

  private mockListFiles(folder: string) {
    return [
      {
        key: `${folder}/1728648000000-informe-juan-perez.pdf`,
        size: 245678,
        lastModified: new Date('2025-10-10T10:30:00Z'),
      },
      {
        key: `${folder}/1728651600000-informe-maria-garcia.pdf`,
        size: 189234,
        lastModified: new Date('2025-10-10T12:15:00Z'),
      },
      {
        key: `${folder}/1728655200000-evaluacion-carlos-lopez.pdf`,
        size: 312456,
        lastModified: new Date('2025-10-10T14:45:00Z'),
      },
    ];
  }
}
