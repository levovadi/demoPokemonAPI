import { memo, useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { formatPokemonName, formatPokemonNumber } from '../../../../core/format/pokemon';
import { theme } from '../../../../core/theme/theme';
import type { Pokemon } from '../../domain/entities/Pokemon';

type PokemonCardProps = {
  pokemon: Pokemon;
  onPress: (pokemon: Pokemon) => void;
};

export const PokemonCard = memo(function PokemonCard({
  pokemon,
  onPress,
}: PokemonCardProps) {
  const [failedOfficialArt, setFailedOfficialArt] = useState(false);
  const imageUri = failedOfficialArt ? pokemon.spriteUrl : pokemon.imageUrl;
  const displayName = formatPokemonName(pokemon.name);

  useEffect(() => {
    setFailedOfficialArt(false);
  }, [pokemon.id]);

  return (
    <Pressable
      onPress={() => onPress(pokemon)}
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${displayName}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
          onError={() => {
            if (pokemon.spriteUrl !== imageUri) {
              setFailedOfficialArt(true);
            }
          }}
        />
      </View>
      <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
      <Text style={styles.name} numberOfLines={1}>
        {displayName}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    alignItems: 'center',
    margin: theme.spacing.sm,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    minHeight: 176,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  imageWrap: {
    width: 96,
    height: 96,
    marginBottom: theme.spacing.sm,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  number: {
    fontSize: theme.typography.caption,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing.xs,
  },
  name: {
    fontSize: theme.typography.body,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
