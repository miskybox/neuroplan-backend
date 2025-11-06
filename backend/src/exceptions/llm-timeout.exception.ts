import { HttpException, HttpStatus } from "@nestjs/common";

export class LLMTimeoutException extends HttpException {
  constructor(modelName: string, timeoutSeconds: number) {
    super(
      {
        statusCode: HttpStatus.REQUEST_TIMEOUT,
        message: `El modelo ${modelName} no respondió en ${timeoutSeconds}s`,
        error: "LLM_TIMEOUT",
      },
      HttpStatus.REQUEST_TIMEOUT
    );
  }
}
