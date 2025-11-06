import { Logger } from "@nestjs/common";

export async function handleAsync<T>(
  promise: Promise<T>,
  context?: string
): Promise<[T, null] | [null, Error]> {
  try {
    const data = await promise;
    return [data, null];
  } catch (error) {
    const logger = new Logger("AsyncHandler");
    logger.error(
      `Error en ${context || "operación async"}`,
      error instanceof Error ? error.stack : String(error)
    );
    return [null, error as Error];
  }
}
