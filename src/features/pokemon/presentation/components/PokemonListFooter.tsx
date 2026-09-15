import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';

type PokemonListFooterProps = {
  loadingMore: boolean;
  hasMore: boolean;
};

export function PokemonListFooter({ loadingMore, hasMore }: PokemonListFooterProps) {
  if (loadingMore) {
    return (
      <View
        style={styles.container}
        accessibilityRole="progressbar"
        accessibilityLabel="Cargando más Pokémon"
      >
        <ActivityIndicator color={theme.colors.primary} />
        <Text style={styles.label}>Cargando más Pokémon...</Text>
      </View>
    );
  }

  if (!hasMore) {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>No hay más Pokémon para mostrar</Text>
      </View>
    );
  }

  return <View style={styles.spacer} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  label: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption,
  },
  spacer: {
    height: theme.spacing.lg,
  },
});
