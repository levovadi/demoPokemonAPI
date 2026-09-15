import { useCallback, useEffect, useRef, useState } from 'react';
import { toUserMessage } from '../../../../core/errors/AppError';
import type { Pokemon } from '../../domain/entities/Pokemon';
import type { GetPokemonListUseCase } from '../../domain/usecases/GetPokemonListUseCase';
import type { LoadMorePokemonUseCase } from '../../domain/usecases/LoadMorePokemonUseCase';

export const usePokemonList = (
  getPokemonListUseCase: GetPokemonListUseCase,
  loadMorePokemonUseCase: LoadMorePokemonUseCase,
) => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const loadingMoreRef = useRef(false);

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
        const result = await getPokemonListUseCase.execute({ forceRefresh });
        setPokemon(result.pokemon);
        setLastUpdatedAt(result.lastUpdatedAt);
        setWarning(result.warning);
        setHasMore(result.hasMore);
      } catch (err) {
        setError(toUserMessage(err));
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [getPokemonListUseCase],
  );

  const loadMore = useCallback(async () => {
    if (
      loadingMoreRef.current ||
      loading ||
      refreshing ||
      !hasMore ||
      pokemon.length === 0
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setWarning(null);

    try {
      const result = await loadMorePokemonUseCase.execute();
      setPokemon(result.pokemon);
      setHasMore(result.hasMore);
      setWarning(result.warning);
    } catch (err) {
      setWarning(toUserMessage(err));
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [hasMore, loadMorePokemonUseCase, loading, pokemon.length, refreshing]);

  useEffect(() => {
    void load(false);
  }, [load]);

  return {
    pokemon,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    warning,
    lastUpdatedAt,
    refresh: () => load(true),
    retry: () => load(false),
    loadMore,
  };
};
