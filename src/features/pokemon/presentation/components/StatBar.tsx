import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';
import { getStatColor, getStatLabel } from '../constants/pokemonLabels';

const MAX_STAT_VALUE = 255;

type StatBarProps = {
  name: string;
  value: number;
};

export function StatBar({ name, value }: StatBarProps) {
  const ratio = Math.min(value / MAX_STAT_VALUE, 1);
  const label = getStatLabel(name);

  return (
    <View
      style={styles.row}
      accessibilityLabel={`${label}: ${value}`}
    >
      <Text style={styles.name}>{label}</Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${Math.round(ratio * 100)}%`,
              backgroundColor: getStatColor(name),
            },
          ]}
        />
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    width: 88,
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    fontWeight: '600',
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.border,
    overflow: 'hidden',
    marginHorizontal: theme.spacing.sm,
  },
  fill: {
    height: '100%',
    borderRadius: theme.radius.pill,
  },
  value: {
    width: 32,
    textAlign: 'right',
    fontSize: theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
