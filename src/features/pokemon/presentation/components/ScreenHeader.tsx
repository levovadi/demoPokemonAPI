import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { theme } from '../../../../core/theme/theme';
import { LastUpdatedLabel } from './LastUpdatedLabel';

type ScreenHeaderProps = {
  title: string;
  lastUpdatedAt: Date | null;
  onRefresh: () => void;
  refreshing: boolean;
  onBack?: () => void;
};

export function ScreenHeader({
  title,
  lastUpdatedAt,
  onRefresh,
  refreshing,
  onBack,
}: ScreenHeaderProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.left}>
          {onBack ? (
            <Pressable
              onPress={onBack}
              accessibilityRole="button"
              accessibilityLabel="Volver al listado"
              hitSlop={8}
              style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
            >
              <Text style={styles.backText}>←</Text>
            </Pressable>
          ) : null}
          <View style={styles.titles}>
            <Text
              style={styles.title}
              accessibilityRole="header"
              numberOfLines={1}
            >
              {title}
            </Text>
            <LastUpdatedLabel date={lastUpdatedAt} />
          </View>
        </View>
        <Pressable
          onPress={onRefresh}
          disabled={refreshing}
          accessibilityRole="button"
          accessibilityLabel="Actualizar datos"
          style={({ pressed }) => [
            styles.refreshButton,
            pressed && styles.pressed,
            refreshing && styles.disabled,
          ]}
        >
          {refreshing ? (
            <ActivityIndicator color={theme.colors.surface} size="small" />
          ) : (
            <Text style={styles.refreshText}>Actualizar</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing.md,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  titles: {
    flex: 1,
  },
  title: {
    color: theme.colors.surface,
    fontSize: theme.typography.title,
    fontWeight: '800',
    flexShrink: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: theme.colors.surface,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  refreshButton: {
    backgroundColor: theme.colors.primaryDark,
    borderRadius: theme.radius.pill,
    paddingHorizontal: theme.spacing.md,
    minHeight: 40,
    minWidth: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshText: {
    color: theme.colors.surface,
    fontWeight: '700',
    fontSize: theme.typography.caption,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.7,
  },
});
