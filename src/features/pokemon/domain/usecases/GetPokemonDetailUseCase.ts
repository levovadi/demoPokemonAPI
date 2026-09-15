import type { PokemonDetailResult } from '../entities/PokemonResult';
import type { PokemonRepository } from '../repositories/PokemonRepository';

export interface GetPokemonDetailParams {
  forceRefresh?: boolean;
}

export class GetPokemonDetailUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(
    id: number,
    params: GetPokemonDetailParams = {},
  ): Promise<PokemonDetailResult> {
    return this.repository.getDetail(id, params.forceRefresh === true);
  }
}
