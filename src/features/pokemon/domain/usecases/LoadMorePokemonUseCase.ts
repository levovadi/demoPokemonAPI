import type { PokemonListResult } from '../entities/PokemonResult';
import type { PokemonRepository } from '../repositories/PokemonRepository';

export class LoadMorePokemonUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(): Promise<PokemonListResult> {
    return this.repository.loadMore();
  }
}
