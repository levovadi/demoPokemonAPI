export interface HttpClient {
  get<T>(path: string): Promise<T>;
}
