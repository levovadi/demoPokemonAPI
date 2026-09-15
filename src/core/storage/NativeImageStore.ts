import { Directory, File, Paths } from 'expo-file-system';
import type { ImageStore } from './ImageStore';
import type { StorageClient } from './StorageClient';

const IMAGE_FOLDER = 'pokemon-images';

export class NativeImageStore implements ImageStore {
  constructor(private readonly storage: StorageClient) {}

  async getCachedUri(fileName: string): Promise<string | null> {
    const fileUri = this.getFileUri(fileName);

    if (fileUri) {
      return fileUri;
    }

    return this.storage.getItem(this.dataUriKey(fileName));
  }

  async cacheFromUrl(fileName: string, remoteUrl: string): Promise<string> {
    const cached = await this.getCachedUri(fileName);

    if (cached) {
      return cached;
    }

    try {
      return await this.saveToFile(fileName, remoteUrl);
    } catch {
      return this.saveAsDataUri(fileName, remoteUrl);
    }
  }

  private getFileUri(fileName: string): string | null {
    try {
      const directory = this.getDirectory();

      if (!directory.exists) {
        return null;
      }

      const file = new File(directory, fileName);
      return file.exists ? file.uri : null;
    } catch {
      return null;
    }
  }

  private async saveToFile(fileName: string, remoteUrl: string): Promise<string> {
    const directory = this.getDirectory();

    if (!directory.exists) {
      directory.create({ idempotent: true });
    }

    const file = new File(directory, fileName);
    const downloaded = await File.downloadFileAsync(remoteUrl, file, {
      idempotent: true,
    });

    return downloaded.uri;
  }

  private async saveAsDataUri(fileName: string, remoteUrl: string): Promise<string> {
    const response = await fetch(remoteUrl);

    if (!response.ok) {
      throw new Error(`No se pudo descargar la imagen (${response.status}).`);
    }

    const dataUri = `data:image/png;base64,${arrayBufferToBase64(await response.arrayBuffer())}`;
    await this.storage.setItem(this.dataUriKey(fileName), dataUri);
    return dataUri;
  }

  private getDirectory(): Directory {
    return new Directory(Paths.document, IMAGE_FOLDER);
  }

  private dataUriKey(fileName: string): string {
    return `pokemon.image.v1.${fileName}`;
  }
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = '';

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}
