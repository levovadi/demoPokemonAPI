import { useCallback, useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import { useAppDependencies } from '../../../../core/di/AppDependenciesContext';
import { theme } from '../../../../core/theme/theme';
import type { Pokemon } from '../../domain/entities/Pokemon';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { PokemonCard } from '../components/PokemonCard';
import { PokemonListFooter } from '../components/PokemonListFooter';
import { PokemonListSkeleton } from '../components/PokemonListSkeleton';
import { ScreenHeader } from '../components/ScreenHeader';
import { WarningBanner } from '../components/WarningBanner';
import { usePokemonList } from '../hooks/usePokemonList';

type PokemonListScreenProps = {
  onSelectPokemon: (pokemon: Pokemon) => void;
};

export function PokemonListScreen({ onSelectPokemon }: PokemonListScreenProps) {
  const { getPokemonListUseCase, loadMorePokemonUseCase } = useAppDependencies();
  const {
    pokemon,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    error,
    warning,
    lastUpdatedAt,
    refresh,
    retry,
    loadMore,
  } = usePokemonList(getPokemonListUseCase, loadMorePokemonUseCase);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);

  const columnCount = windowWidth >= 768 ? 3 : 2;

  const handleLayoutChange = useCallback(() => {
    setWindowWidth(Dimensions.get('window').width);
  }, []);

  const content = useMemo(() => {
    if (loading && pokemon.length === 0) {
      return <PokemonListSkeleton />;
    }

    if (error && pokemon.length === 0) {
      return <ErrorState message={error} onRetry={retry} />;
    }

    if (pokemon.length === 0) {
      return <EmptyState />;
    }

    return (
      <FlatList
        data={pokemon}
        key={columnCount}
        keyExtractor={(item) => String(item.id)}
        numColumns={columnCount}
        renderItem={({ item }) => (
          <PokemonCard pokemon={item} onPress={onSelectPokemon} />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.column}
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListFooterComponent={
          <PokemonListFooter loadingMore={loadingMore} hasMore={hasMore} />
        }
        extraData={`${loadingMore}-${hasMore}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
          />
        }
        accessibilityRole="list"
      />
    );
  }, [
    columnCount,
    error,
    hasMore,
    loadMore,
    loading,
    loadingMore,
    onSelectPokemon,
    pokemon,
    refresh,
    refreshing,
    retry,
  ]);

  return (
    <View style={styles.screen} onLayout={handleLayoutChange}>
      <ScreenHeader
        title="Pokédex"
        lastUpdatedAt={lastUpdatedAt}
        onRefresh={refresh}
        refreshing={refreshing}
      />
      <WarningBanner message={warning ?? (pokemon.length > 0 ? error : null)} />
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    paddingHorizontal: theme.spacing.sm,
    paddingBottom: theme.spacing.xxl,
    paddingTop: theme.spacing.sm,
  },
  column: {
    flex: 1,
  },
});
