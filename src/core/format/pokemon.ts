export function formatPokemonName(name: string): string {
  if (name.length === 0) {
    return name;
  }

  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function formatPokemonNumber(id: number): string {
  return `#${String(id).padStart(3, '0')}`;
}

export function formatMeters(value: number): string {
  return `${value.toFixed(1)} m`;
}

export function formatKilograms(value: number): string {
  return `${value.toFixed(1)} kg`;
}
