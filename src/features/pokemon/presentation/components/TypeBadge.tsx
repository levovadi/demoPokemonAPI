import { StyleSheet, Text, View } from 'react-native';
import { getTypeColor, getTypeLabel } from '../constants/pokemonLabels';

type TypeBadgeProps = {
  type: string;
};

export function TypeBadge({ type }: TypeBadgeProps) {
  const label = getTypeLabel(type);

  return (
    <View
      style={[styles.badge, { backgroundColor: getTypeColor(type) }]}
      accessibilityLabel={`Tipo ${label}`}
    >
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 28,
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
