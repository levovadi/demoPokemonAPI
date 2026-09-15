import type { StorageClient } from '../../../../core/storage/StorageClient';
import type { Pokemon } from '../../domain/entities/Pokemon';
import type { PokemonDetail } from '../../domain/entities/PokemonDetail';

export interface CachedEntry<T> {
  data: T;
  lastUpdatedAt: Date;
  totalCount: number | null;
}

interface CacheEnvelope<T> {
  data: T;
  lastUpdatedAt: string;
  totalCount?: number | null;
}

const LIST_KEY = 'pokemon.list.v1';

export class PokemonLocalDataSource {
  constructor(private readonly storage: StorageClient) {}

  getList(): Promise<CachedEntry<Pokemon[]> | null> {
    return this.read<Pokemon[]>(LIST_KEY);
  }

  saveList(
    data: Pokemon[],
    lastUpdatedAt: Date,
    totalCount: number,
  ): Promise<void> {
    return this.write(LIST_KEY, data, lastUpdatedAt, totalCount);
  }

  getDetail(id: number): Promise<CachedEntry<PokemonDetail> | null> {
    return this.read<PokemonDetail>(this.detailKey(id));
  }

  saveDetail(data: PokemonDetail, lastUpdatedAt: Date): Promise<void> {
    return this.write(this.detailKey(data.id), data, lastUpdatedAt);
  }

  private detailKey(id: number): string {
    return `pokemon.detail.v1.${id}`;
  }

  private async read<T>(key: string): Promise<CachedEntry<T> | null> {
    const raw = await this.storage.getItem(key);

    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as CacheEnvelope<T>;

      if (!parsed.data || typeof parsed.lastUpdatedAt !== 'string') {
        return null;
      }

      return {
        data: parsed.data,
        lastUpdatedAt: new Date(parsed.lastUpdatedAt),
        totalCount:
          typeof parsed.totalCount === 'number' ? parsed.totalCount : null,
      };
    } catch {
      return null;
    }
  }

  private async write<T>(
    key: string,
    data: T,
    lastUpdatedAt: Date,
    totalCount?: number,
  ): Promise<void> {
    const envelope: CacheEnvelope<T> = {
      data,
      lastUpdatedAt: lastUpdatedAt.toISOString(),
      totalCount: totalCount ?? null,
    };

    await this.storage.setItem(key, JSON.stringify(envelope));
  }
}
