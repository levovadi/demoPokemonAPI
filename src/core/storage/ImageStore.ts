export interface ImageStore {
  getCachedUri(fileName: string): Promise<string | null>;
  cacheFromUrl(fileName: string, remoteUrl: string): Promise<string>;
}
