import { HttpException, HttpStatus } from "@nestjs/common";

export class PEIGenerationException extends HttpException {
  constructor(message: string, originalError?: Error) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message,
        error: "PEI_GENERATION_ERROR",
        details: originalError?.message,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
