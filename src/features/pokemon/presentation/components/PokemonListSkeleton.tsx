import { StyleSheet, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';
import { SkeletonBox } from './SkeletonBox';

export function PokemonListSkeleton() {
  return (
    <View style={styles.grid}>
      {Array.from({ length: 6 }, (_, index) => (
        <View key={index} style={styles.card}>
          <SkeletonBox height={96} width={96} borderRadius={48} />
          <SkeletonBox height={16} width="70%" style={styles.name} />
          <SkeletonBox height={12} width="40%" />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  card: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  name: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
});
