export type AppErrorCode = 'NETWORK' | 'NOT_FOUND' | 'STORAGE' | 'UNKNOWN';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(
    message: string,
    code: AppErrorCode = 'UNKNOWN',
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = 'AppError';
    this.code = code;
  }
}

export function toUserMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return 'Ocurrió un error inesperado. Inténtalo de nuevo.';
}
