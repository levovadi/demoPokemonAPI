import type { ImageStore } from '../../../../core/storage/ImageStore';
import type { Pokemon } from '../../domain/entities/Pokemon';
import type { PokemonDetail } from '../../domain/entities/PokemonDetail';

export class PokemonImageDataSource {
  constructor(private readonly imageStore: ImageStore) {}

  hydrate(pokemon: Pokemon): Promise<Pokemon> {
    return this.resolve(pokemon, false);
  }

  persist(pokemon: Pokemon): Promise<Pokemon> {
    return this.resolve(pokemon, true);
  }

  hydrateDetail(pokemon: PokemonDetail): Promise<PokemonDetail> {
    return this.resolve(pokemon, false);
  }

  persistDetail(pokemon: PokemonDetail): Promise<PokemonDetail> {
    return this.resolve(pokemon, true);
  }

  private async resolve<T extends Pokemon>(
    pokemon: T,
    downloadIfMissing: boolean,
  ): Promise<T> {
    const [imageUrl, spriteUrl] = await Promise.all([
      this.resolveImage(
        this.artworkFileName(pokemon.id),
        pokemon.imageUrl,
        downloadIfMissing,
      ),
      this.resolveImage(
        this.spriteFileName(pokemon.id),
        pokemon.spriteUrl,
        downloadIfMissing,
      ),
    ]);

    return {
      ...pokemon,
      imageUrl,
      spriteUrl,
    };
  }

  private async resolveImage(
    fileName: string,
    remoteUrl: string,
    downloadIfMissing: boolean,
  ): Promise<string> {
    const cached = await this.imageStore.getCachedUri(fileName);

    if (cached) {
      return cached;
    }

    if (!downloadIfMissing) {
      return remoteUrl;
    }

    try {
      return await this.imageStore.cacheFromUrl(fileName, remoteUrl);
    } catch {
      return remoteUrl;
    }
  }

  private artworkFileName(id: number): string {
    return `artwork-${id}.png`;
  }

  private spriteFileName(id: number): string {
    return `sprite-${id}.png`;
  }
}
