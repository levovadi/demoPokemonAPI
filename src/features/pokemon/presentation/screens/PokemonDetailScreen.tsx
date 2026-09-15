import { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useAppDependencies } from '../../../../core/di/AppDependenciesContext';
import {
  formatKilograms,
  formatMeters,
  formatPokemonName,
  formatPokemonNumber,
} from '../../../../core/format/pokemon';
import { theme } from '../../../../core/theme/theme';
import { ErrorState } from '../components/ErrorState';
import { PokemonDetailSkeleton } from '../components/PokemonDetailSkeleton';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatBar } from '../components/StatBar';
import { TypeBadge } from '../components/TypeBadge';
import { WarningBanner } from '../components/WarningBanner';
import { usePokemonDetail } from '../hooks/usePokemonDetail';

type PokemonDetailScreenProps = {
  pokemonId: number;
  pokemonName: string;
  onBack: () => void;
};

export function PokemonDetailScreen({
  pokemonId,
  pokemonName,
  onBack,
}: PokemonDetailScreenProps) {
  const { getPokemonDetailUseCase } = useAppDependencies();
  const {
    pokemon,
    loading,
    refreshing,
    error,
    warning,
    lastUpdatedAt,
    refresh,
    retry,
  } = usePokemonDetail(getPokemonDetailUseCase, pokemonId);
  const [failedOfficialArt, setFailedOfficialArt] = useState(false);

  useEffect(() => {
    setFailedOfficialArt(false);
  }, [pokemonId]);

  const title = formatPokemonName(pokemon?.name ?? pokemonName);
  const imageUri = pokemon
    ? failedOfficialArt
      ? pokemon.spriteUrl
      : pokemon.imageUrl
    : null;

  return (
    <View style={styles.screen}>
      <ScreenHeader
        title={title}
        lastUpdatedAt={lastUpdatedAt}
        onRefresh={refresh}
        refreshing={refreshing}
        onBack={onBack}
      />
      <WarningBanner message={warning ?? (pokemon ? error : null)} />
      {loading && !pokemon ? <PokemonDetailSkeleton /> : null}
      {error && !pokemon ? <ErrorState message={error} onRetry={retry} /> : null}
      {pokemon ? (
        <ScrollView contentContainerStyle={styles.content}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.image}
              resizeMode="contain"
              accessibilityLabel={`Imagen de ${title}`}
              onError={() => {
                if (pokemon.spriteUrl !== imageUri) {
                  setFailedOfficialArt(true);
                }
              }}
            />
          ) : null}
          <Text style={styles.number}>{formatPokemonNumber(pokemon.id)}</Text>
          <View style={styles.types}>
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </View>
          <View style={styles.metrics}>
            <Metric label="Altura" value={formatMeters(pokemon.heightMeters)} />
            <Metric label="Peso" value={formatKilograms(pokemon.weightKilograms)} />
            <Metric label="Exp. base" value={String(pokemon.baseExperience)} />
          </View>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          {pokemon.abilities.map((ability) => (
            <Text key={ability.name} style={styles.ability}>
              {formatPokemonName(ability.name.replaceAll('-', ' '))}
              {ability.isHidden ? ' (oculta)' : ''}
            </Text>
          ))}
          <Text style={styles.sectionTitle}>Estadísticas</Text>
          {pokemon.stats.map((stat) => (
            <StatBar key={stat.name} name={stat.name} value={stat.value} />
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

type MetricProps = {
  label: string;
  value: string;
};

function Metric({ label, value }: MetricProps) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
    alignItems: 'center',
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: theme.spacing.md,
  },
  number: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.body,
    marginBottom: theme.spacing.md,
  },
  types: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  metrics: {
    flexDirection: 'row',
    width: '100%',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  metric: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    alignItems: 'center',
  },
  metricLabel: {
    color: theme.colors.textMuted,
    fontSize: theme.typography.caption,
    marginBottom: theme.spacing.xs,
  },
  metricValue: {
    color: theme.colors.text,
    fontSize: theme.typography.body,
    fontWeight: '700',
  },
  sectionTitle: {
    alignSelf: 'flex-start',
    fontSize: theme.typography.subtitle,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  ability: {
    alignSelf: 'flex-start',
    fontSize: theme.typography.body,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
});
