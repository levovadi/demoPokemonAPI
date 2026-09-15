import { useCallback, useEffect, useState } from 'react';
import { toUserMessage } from '../../../../core/errors/AppError';
import type { PokemonDetail } from '../../domain/entities/PokemonDetail';
import type { GetPokemonDetailUseCase } from '../../domain/usecases/GetPokemonDetailUseCase';

export const usePokemonDetail = (
  getPokemonDetailUseCase: GetPokemonDetailUseCase,
  pokemonId: number,
) => {
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);

  const load = useCallback(
    async (forceRefresh: boolean) => {
      if (forceRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);
      setWarning(null);

      try {
        const result = await getPokemonDetailUseCase.execute(pokemonId, {
          forceRefresh,
        });
        setPokemon(result.pokemon);
        setLastUpdatedAt(result.lastUpdatedAt);
        setWarning(result.warning);
      } catch (err) {
        setError(toUserMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getPokemonDetailUseCase, pokemonId],
  );

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    pokemon,
    loading,
    refreshing,
    error,
    warning,
    lastUpdatedAt,
    refresh: () => load(true),
    retry: () => load(false),
  };
};
