import type { DataSource } from './DataSource';
import type { Pokemon } from './Pokemon';
import type { PokemonDetail } from './PokemonDetail';

export interface PokemonListResult {
  pokemon: Pokemon[];
  lastUpdatedAt: Date | null;
  source: DataSource;
  warning: string | null;
  hasMore: boolean;
}

export interface PokemonDetailResult {
  pokemon: PokemonDetail;
  lastUpdatedAt: Date | null;
  source: DataSource;
  warning: string | null;
}
