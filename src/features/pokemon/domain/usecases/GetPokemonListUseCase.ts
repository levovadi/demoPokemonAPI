import type { PokemonListResult } from '../entities/PokemonResult';
import type { PokemonRepository } from '../repositories/PokemonRepository';

export interface GetPokemonListParams {
  forceRefresh?: boolean;
}

export class GetPokemonListUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(params: GetPokemonListParams = {}): Promise<PokemonListResult> {
    return this.repository.getList(params.forceRefresh === true);
  }
}
