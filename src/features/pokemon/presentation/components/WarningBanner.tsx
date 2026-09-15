import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../../core/theme/theme';

type WarningBannerProps = {
  message: string | null;
};

export function WarningBanner({ message }: WarningBannerProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.banner} accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: theme.colors.warningBackground,
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
  },
  text: {
    color: theme.colors.warning,
    fontSize: theme.typography.caption,
  },
});
