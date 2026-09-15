import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';

type EmptyStateProps = {
  title?: string;
  message?: string;
};

export function EmptyState({
  title = 'No hay Pokémon para mostrar',
  message = 'Cuando haya información disponible, aparecerá en este listado.',
}: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  message: {
    fontSize: theme.typography.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
  },
});
