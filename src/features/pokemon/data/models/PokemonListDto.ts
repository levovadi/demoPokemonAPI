export interface PokemonListItemDto {
  name: string;
  url: string;
}

export interface PokemonListDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItemDto[];
}
