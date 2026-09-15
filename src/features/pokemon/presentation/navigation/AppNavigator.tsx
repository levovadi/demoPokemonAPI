import { useState } from 'react';
import type { Pokemon } from '../../domain/entities/Pokemon';
import { PokemonDetailScreen } from '../screens/PokemonDetailScreen';
import { PokemonListScreen } from '../screens/PokemonListScreen';

type ListRoute = {
  name: 'list';
};

type DetailRoute = {
  name: 'detail';
  pokemonId: number;
  pokemonName: string;
};

type AppRoute = ListRoute | DetailRoute;

export function AppNavigator() {
  const [route, setRoute] = useState<AppRoute>({ name: 'list' });

  if (route.name === 'detail') {
    return (
      <PokemonDetailScreen
        pokemonId={route.pokemonId}
        pokemonName={route.pokemonName}
        onBack={() => setRoute({ name: 'list' })}
      />
    );
  }

  return (
    <PokemonListScreen
      onSelectPokemon={(pokemon: Pokemon) =>
        setRoute({
          name: 'detail',
          pokemonId: pokemon.id,
          pokemonName: pokemon.name,
        })
      }
    />
  );
}
