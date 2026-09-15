import { useEffect, useRef } from 'react';
import {
  Animated,
  type DimensionValue,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { theme } from '../../../../core/theme/theme';

type SkeletonBoxProps = {
  height: DimensionValue;
  width: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBox({
  height,
  width,
  borderRadius = theme.radius.sm,
  style,
}: SkeletonBoxProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [opacity]);

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando contenido"
      style={[
        {
          height,
          width,
          borderRadius,
          backgroundColor: theme.colors.skeleton,
          opacity,
        },
        style,
      ]}
    />
  );
}
