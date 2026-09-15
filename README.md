# Pokédex — Assessment técnico React Native

Aplicación móvil que consulta [PokéAPI](https://pokeapi.co/) para mostrar los primeros 20 Pokémon y su detalle, con **Clean Architecture**, persistencia local y una interfaz nativa (sin librerías de UI).

## Cómo ejecutar

```bash
npm install
npx expo start
```

Luego abre el proyecto en:

- iOS: `i` o Expo Go
- Android: `a` o Expo Go
- Web: `w`

Requisitos: Node.js 18+, npm y Expo Go (o un simulador/emulador).

## Arquitectura

La solución sigue **Clean Architecture** por feature. El dominio no conoce React Native, Fetch ni el almacenamiento. La UI solo habla con casos de uso.

```
src/
├── core/                         # Infraestructura compartida
│   ├── di/                       # Composition root / inyección de dependencias
│   ├── errors/                   # Errores de aplicación y mensajes al usuario
│   ├── network/                  # Contrato HTTP + cliente Fetch nativo
│   ├── storage/                  # Contrato de persistencia + wrapper localStorage
│   ├── format/                   # Formateo de fechas y datos de Pokémon
│   └── theme/                    # Tokens visuales
└── features/
    └── pokemon/
        ├── data/                 # DTOs, mapeadores, datasources, repositorio
        ├── domain/               # Entidades, contratos y casos de uso
        └── presentation/         # Hooks (ViewModels), pantallas y componentes
```

### Flujo de dependencias

`Presentation → Domain ← Data`

- **Domain**: reglas de negocio puras (`GetPokemonListUseCase`, `GetPokemonDetailUseCase`, `PokemonRepository`).
- **Data**: implementa el contrato del repositorio, traduce DTOs de PokéAPI a entidades y coordina cache vs red.
- **Presentation**: ViewModels (`usePokemonList`, `usePokemonDetail`) y pantallas. No hacen `fetch` ni leen storage.

La inyección de dependencias ocurre una sola vez en `createAppContainer()` y se expone a React con `AppDependenciesProvider`. Los hooks reciben el caso de uso por parámetro, lo que permite probarlos sin acoplarlos al contexto.

### Principios SOLID aplicados

- **S**: cada clase tiene una responsabilidad (HTTP, storage, mapeo, caso de uso, UI).
- **O**: un nuevo datasource o cliente HTTP se agrega implementando el contrato, sin reescribir casos de uso.
- **L**: `PokemonRepositoryImpl` es intercambiable por cualquier otra implementación del contrato.
- **I**: contratos pequeños (`HttpClient`, `StorageClient`, `PokemonRepository`).
- **D**: dominio depende de abstracciones; las implementaciones se inyectan en el composition root.

## Persistencia local

Se cachea el listado, cada detalle y las **imágenes** por separado:

| Clave / recurso | Contenido |
| --- | --- |
| `pokemon.list.v1` | Primeros 20 Pokémon + `lastUpdatedAt` |
| `pokemon.detail.v1.{id}` | Detalle del Pokémon + `lastUpdatedAt` |
| `pokemon-images/artwork-{id}.png` | Artwork oficial en disco |
| `pokemon-images/sprite-{id}.png` | Sprite de respaldo en disco |

Estrategia:

1. Si ya hay datos locales, **no se llama a la API** al entrar al listado o al detalle.
2. El botón **Actualizar** (y el pull-to-refresh del listado) fuerza una nueva consulta de red, descarga las imágenes y reemplaza el cache.
3. El encabezado muestra `Última actualización de datos dd/mm/aaaa hh:mm`.
4. Si la red falla y existe cache, se muestran los datos **y las imágenes** guardadas, con un aviso. Eso cubre una experiencia **offline parcial**.

Las imágenes se guardan en el directorio de documentos de la app (`expo-file-system`). Antes solo se persistían las URLs remotas, así que sin internet el listado aparecía sin sprites.

Implementación de storage: wrapper `NativeStorage` sobre `globalThis.localStorage`. En web usa el `localStorage` del navegador. En iOS/Android, Expo SDK provee el polyfill `expo-sqlite/localStorage/install` (incluido en `index.ts`). La interfaz es asíncrona, equivalente a AsyncStorage, para poder sustituir el backend de persistencia sin tocar dominio ni UI.

## Navegación

No se usa React Navigation. Hay un navigator propio de dos rutas (`list` / `detail`) para cumplir la restricción de no agregar librerías externas. Es suficiente para el alcance del challenge y mantiene el flujo lineal listado → detalle → atrás.

Comprobación de tipos:

```bash
npm run typecheck
```

## Librerías

| Paquete | Motivo |
| --- | --- |
| `expo`, `react`, `react-native`, `typescript` | Plataforma del proyecto |
| `expo-status-bar` | Barra de estado del template Expo |
| `expo-sqlite` | Polyfill oficial de `localStorage` en iOS/Android |
| `expo-file-system` | Cache de imágenes en disco para uso offline |
| `react-dom`, `react-native-web`, `@expo/metro-runtime` | Runtime de Expo para previsualizar en web |

No se usan Axios, Redux, React Query, librerías de UI ni skeleton de terceros. El cliente HTTP es `fetch`. El skeleton usa `Animated` de React Native. La navegación es propia (dos pantallas), sin React Navigation.

## UX / bonus implementados

- `FlatList` con paginación incremental de 20 en 20 (`offset` + `limit` de PokéAPI).
- Estados de carga (skeleton nativo), error, vacío y aviso de datos en cache.
- `FlatList` (virtualización) y `React.memo` en las cards.
- Layout adaptable: 2 columnas en móvil, 3 en tablet.
- Accesibilidad: roles, labels y áreas táctiles mínimas de 44pt.
- Timeout de red (15s) y errores con mensajes en español.
- Tipos, habilidades, estadísticas, peso, altura y experiencia base en el detalle.

## Decisiones y trade-offs

- El listado de PokéAPI no trae imagen: el ID se extrae de la URL y se arma el artwork oficial. Si falla, se usa el sprite básico.
- Cache-first es intencional: prioriza rapidez y menos llamadas. El usuario controla cuándo refrescar.
- La paginación es incremental: el cache guarda lo ya cargado y `LoadMorePokemonUseCase` pide los siguientes 20 (`offset = listado actual`).

## Pendientes / mejoras futuras

- Pruebas unitarias de mapeadores y casos de uso (Jest / RNTL).
- Búsqueda y filtro por tipo.
- CI con `tsc --noEmit` en cada push.
