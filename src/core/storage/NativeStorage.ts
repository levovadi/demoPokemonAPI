import { AppError } from '../errors/AppError';
import type { StorageClient } from './StorageClient';

export class NativeStorage implements StorageClient {
  async getItem(key: string): Promise<string | null> {
    try {
      return this.getLocalStorage().getItem(key);
    } catch (error) {
      throw new AppError(
        'No se pudo leer el almacenamiento local.',
        'STORAGE',
        error,
      );
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      this.getLocalStorage().setItem(key, value);
    } catch (error) {
      throw new AppError(
        'No se pudo guardar la información de forma local.',
        'STORAGE',
        error,
      );
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      this.getLocalStorage().removeItem(key);
    } catch (error) {
      throw new AppError(
        'No se pudo eliminar la información local.',
        'STORAGE',
        error,
      );
    }
  }

  private getLocalStorage(): Storage {
    const storage = globalThis.localStorage;

    if (!storage) {
      throw new AppError(
        'El almacenamiento local no está disponible en este entorno.',
        'STORAGE',
      );
    }

    return storage;
  }
}
