import type { Pokemon } from './Pokemon';

export interface PokemonAbility {
  name: string;
  isHidden: boolean;
}

export interface PokemonStat {
  name: string;
  value: number;
}

export interface PokemonDetail extends Pokemon {
  types: string[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
  heightMeters: number;
  weightKilograms: number;
  baseExperience: number;
}
