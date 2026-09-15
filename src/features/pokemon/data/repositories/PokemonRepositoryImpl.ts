import { POKEMON_LIST_LIMIT } from '../../../../core/network/constants';
import { DataSource } from '../../domain/entities/DataSource';
import type { Pokemon } from '../../domain/entities/Pokemon';
import type { PokemonDetail } from '../../domain/entities/PokemonDetail';
import type {
  PokemonDetailResult,
  PokemonListResult,
} from '../../domain/entities/PokemonResult';
import type { PokemonRepository } from '../../domain/repositories/PokemonRepository';
import type { PokemonImageDataSource } from '../datasources/PokemonImageDataSource';
import type { PokemonLocalDataSource } from '../datasources/PokemonLocalDataSource';
import type { PokemonRemoteDataSource } from '../datasources/PokemonRemoteDataSource';
import type { PokemonListItemDto } from '../models/PokemonListDto';
import { mapDetailDtoToPokemonDetail, mapListItemToPokemon } from '../models/pokemonMappers';

const OFFLINE_WARNING =
  'No se pudo actualizar. Mostrando la última información guardada.';
const LOAD_MORE_WARNING =
  'No se pudo cargar más Pokémon. Revisa tu conexión.';

export class PokemonRepositoryImpl implements PokemonRepository {
  constructor(
    private readonly remoteDataSource: PokemonRemoteDataSource,
    private readonly localDataSource: PokemonLocalDataSource,
    private readonly imageDataSource: PokemonImageDataSource,
  ) {}

  async getList(forceRefresh: boolean): Promise<PokemonListResult> {
    const cached = await this.localDataSource.getList();

    if (!forceRefresh && cached && cached.data.length > 0) {
      return this.toListResult(
        await this.hydrateList(cached.data),
        cached.lastUpdatedAt,
        DataSource.Cache,
        null,
        cached.totalCount,
      );
    }

    try {
      const limit = forceRefresh && cached && cached.data.length > 0
        ? Math.max(POKEMON_LIST_LIMIT, cached.data.length)
        : POKEMON_LIST_LIMIT;
      const dto = await this.remoteDataSource.fetchList(limit, 0);
      const pokemon = await this.persistMappedList(dto.results);
      const lastUpdatedAt = new Date();

      await this.localDataSource.saveList(pokemon, lastUpdatedAt, dto.count);

      return this.toListResult(
        pokemon,
        lastUpdatedAt,
        DataSource.Network,
        null,
        dto.count,
      );
    } catch (error) {
      if (cached && cached.data.length > 0) {
        return this.toListResult(
          await this.hydrateList(cached.data),
          cached.lastUpdatedAt,
          DataSource.Cache,
          OFFLINE_WARNING,
          cached.totalCount,
        );
      }

      throw error;
    }
  }

  async loadMore(): Promise<PokemonListResult> {
    const cached = await this.localDataSource.getList();
    const current = cached?.data ?? [];
    const offset = current.length;

    if (cached?.totalCount != null && offset >= cached.totalCount) {
      return this.toListResult(
        await this.hydrateList(current),
        cached.lastUpdatedAt,
        DataSource.Cache,
        null,
        cached.totalCount,
      );
    }

    try {
      const dto = await this.remoteDataSource.fetchList(POKEMON_LIST_LIMIT, offset);
      const nextPage = await this.persistMappedList(dto.results);
      const pokemon = mergeUniquePokemon(current, nextPage);
      const lastUpdatedAt = cached?.lastUpdatedAt ?? new Date();

      await this.localDataSource.saveList(pokemon, lastUpdatedAt, dto.count);

      return this.toListResult(
        await this.hydrateList(pokemon),
        lastUpdatedAt,
        DataSource.Network,
        null,
        dto.count,
      );
    } catch (error) {
      if (current.length > 0 && cached) {
        return this.toListResult(
          await this.hydrateList(current),
          cached.lastUpdatedAt,
          DataSource.Cache,
          LOAD_MORE_WARNING,
          cached.totalCount,
        );
      }

      throw error;
    }
  }

  async getDetail(id: number, forceRefresh: boolean): Promise<PokemonDetailResult> {
    if (!forceRefresh) {
      const cached = await this.localDataSource.getDetail(id);

      if (cached) {
        return {
          pokemon: await this.imageDataSource.hydrateDetail(cached.data),
          lastUpdatedAt: cached.lastUpdatedAt,
          source: DataSource.Cache,
          warning: null,
        };
      }
    }

    try {
      const dto = await this.remoteDataSource.fetchDetail(id);
      const pokemon: PokemonDetail = await this.imageDataSource.persistDetail(
        mapDetailDtoToPokemonDetail(dto),
      );
      const lastUpdatedAt = new Date();

      await this.localDataSource.saveDetail(pokemon, lastUpdatedAt);

      return {
        pokemon,
        lastUpdatedAt,
        source: DataSource.Network,
        warning: null,
      };
    } catch (error) {
      const cached = await this.localDataSource.getDetail(id);

      if (cached) {
        return {
          pokemon: await this.imageDataSource.hydrateDetail(cached.data),
          lastUpdatedAt: cached.lastUpdatedAt,
          source: DataSource.Cache,
          warning: OFFLINE_WARNING,
        };
      }

      throw error;
    }
  }

  private persistMappedList(results: PokemonListItemDto[]): Promise<Pokemon[]> {
    return Promise.all(
      results.map((item) => this.imageDataSource.persist(mapListItemToPokemon(item))),
    );
  }

  private hydrateList(pokemon: Pokemon[]): Promise<Pokemon[]> {
    return Promise.all(pokemon.map((item) => this.imageDataSource.hydrate(item)));
  }

  private toListResult(
    pokemon: Pokemon[],
    lastUpdatedAt: Date | null,
    source: DataSource,
    warning: string | null,
    totalCount: number | null,
  ): PokemonListResult {
    return {
      pokemon,
      lastUpdatedAt,
      source,
      warning,
      hasMore: totalCount == null ? true : pokemon.length < totalCount,
    };
  }
}

function mergeUniquePokemon(current: Pokemon[], incoming: Pokemon[]): Pokemon[] {
  const byId = new Map<number, Pokemon>();

  for (const item of [...current, ...incoming]) {
    byId.set(item.id, item);
  }

  return Array.from(byId.values());
}
