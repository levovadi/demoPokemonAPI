import { AppError } from '../errors/AppError';
import { HTTP_TIMEOUT_MS } from './constants';
import type { HttpClient } from './HttpClient';

export class FetchHttpClient implements HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly timeoutMs: number = HTTP_TIMEOUT_MS,
  ) {}

  async get<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new AppError(
          response.status === 404
            ? 'No se encontró el Pokémon solicitado.'
            : 'El servidor no pudo completar la solicitud.',
          response.status === 404 ? 'NOT_FOUND' : 'NETWORK',
        );
      }

      return (await response.json()) as T;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        'No hay conexión a internet o el servicio no responde.',
        'NETWORK',
        error,
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
