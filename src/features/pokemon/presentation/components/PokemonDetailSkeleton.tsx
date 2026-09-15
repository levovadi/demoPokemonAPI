import { StyleSheet, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';
import { SkeletonBox } from './SkeletonBox';

export function PokemonDetailSkeleton() {
  return (
    <View style={styles.container}>
      <SkeletonBox height={180} width={180} borderRadius={90} style={styles.image} />
      <SkeletonBox height={28} width="50%" />
      <SkeletonBox height={16} width="24%" style={styles.number} />
      <View style={styles.row}>
        <SkeletonBox height={28} width={80} borderRadius={theme.radius.pill} />
        <SkeletonBox height={28} width={80} borderRadius={theme.radius.pill} />
      </View>
      <View style={styles.metrics}>
        <SkeletonBox height={64} width="48%" borderRadius={theme.radius.md} />
        <SkeletonBox height={64} width="48%" borderRadius={theme.radius.md} />
      </View>
      <SkeletonBox height={18} width="40%" style={styles.section} />
      <SkeletonBox height={14} width="80%" />
      <SkeletonBox height={18} width="40%" style={styles.section} />
      <SkeletonBox height={12} width="100%" style={styles.stat} />
      <SkeletonBox height={12} width="100%" style={styles.stat} />
      <SkeletonBox height={12} width="100%" style={styles.stat} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  image: {
    marginBottom: theme.spacing.lg,
  },
  number: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  section: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  stat: {
    marginBottom: theme.spacing.md,
  },
});
