import { POKEMON_LIST_LIMIT } from '../../../../core/network/constants';
import type { HttpClient } from '../../../../core/network/HttpClient';
import type { PokemonDetailDto } from '../models/PokemonDetailDto';
import type { PokemonListDto } from '../models/PokemonListDto';

export class PokemonRemoteDataSource {
  constructor(private readonly httpClient: HttpClient) {}

  fetchList(
    limit: number = POKEMON_LIST_LIMIT,
    offset: number = 0,
  ): Promise<PokemonListDto> {
    return this.httpClient.get<PokemonListDto>(
      `/pokemon?limit=${limit}&offset=${offset}`,
    );
  }

  fetchDetail(id: number): Promise<PokemonDetailDto> {
    return this.httpClient.get<PokemonDetailDto>(`/pokemon/${id}`);
  }
}
