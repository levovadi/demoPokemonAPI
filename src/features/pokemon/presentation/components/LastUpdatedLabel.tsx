import { StyleSheet, Text } from 'react-native';
import { formatLastUpdated } from '../../../../core/format/date';
import { theme } from '../../../../core/theme/theme';

type LastUpdatedLabelProps = {
  date: Date | null;
};

export function LastUpdatedLabel({ date }: LastUpdatedLabelProps) {
  if (!date) {
    return null;
  }

  const label = `Última actualización de datos ${formatLastUpdated(date)}`;

  return (
    <Text
      style={styles.label}
      accessibilityRole="text"
      accessibilityLabel={label}
    >
      {label}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: theme.typography.caption,
    marginTop: theme.spacing.xs,
  },
});
