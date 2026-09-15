import { AppError } from '../../../../core/errors/AppError';
import type { Pokemon } from '../../domain/entities/Pokemon';
import type { PokemonDetail } from '../../domain/entities/PokemonDetail';
import type { PokemonDetailDto } from './PokemonDetailDto';
import type { PokemonListItemDto } from './PokemonListDto';

export function mapListItemToPokemon(dto: PokemonListItemDto): Pokemon {
  const id = extractPokemonId(dto.url);

  return {
    id,
    name: dto.name,
    imageUrl: officialArtworkUrl(id),
    spriteUrl: spriteUrl(id),
  };
}

export function mapDetailDtoToPokemonDetail(dto: PokemonDetailDto): PokemonDetail {
  return {
    id: dto.id,
    name: dto.name,
    imageUrl: dto.sprites.other?.['official-artwork']?.front_default ?? officialArtworkUrl(dto.id),
    spriteUrl: dto.sprites.front_default ?? spriteUrl(dto.id),
    types: [...dto.types]
      .sort((left, right) => left.slot - right.slot)
      .map((item) => item.type.name),
    abilities: dto.abilities.map((item) => ({
      name: item.ability.name,
      isHidden: item.is_hidden,
    })),
    stats: dto.stats.map((item) => ({
      name: item.stat.name,
      value: item.base_stat,
    })),
    heightMeters: dto.height / 10,
    weightKilograms: dto.weight / 10,
    baseExperience: dto.base_experience ?? 0,
  };
}

function extractPokemonId(url: string): number {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  const id = match?.[1] ? Number(match[1]) : NaN;

  if (!Number.isInteger(id)) {
    throw new AppError('La respuesta de PokéAPI no contiene un identificador válido.');
  }

  return id;
}

function officialArtworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}
