import type { PokemonDetailResult, PokemonListResult } from '../entities/PokemonResult';

export interface PokemonRepository {
  getList(forceRefresh: boolean): Promise<PokemonListResult>;
  loadMore(): Promise<PokemonListResult>;
  getDetail(id: number, forceRefresh: boolean): Promise<PokemonDetailResult>;
}
