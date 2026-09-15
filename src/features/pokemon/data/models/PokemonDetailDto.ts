export interface NamedApiResourceDto {
  name: string;
  url: string;
}

export interface PokemonAbilityDto {
  is_hidden: boolean;
  slot: number;
  ability: NamedApiResourceDto;
}

export interface PokemonTypeDto {
  slot: number;
  type: NamedApiResourceDto;
}

export interface PokemonStatDto {
  base_stat: number;
  effort: number;
  stat: NamedApiResourceDto;
}

export interface PokemonSpritesDto {
  front_default: string | null;
  other?: {
    'official-artwork'?: {
      front_default: string | null;
    };
  };
}

export interface PokemonDetailDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: PokemonTypeDto[];
  abilities: PokemonAbilityDto[];
  stats: PokemonStatDto[];
  sprites: PokemonSpritesDto;
}
