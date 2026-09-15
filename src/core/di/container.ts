import { FetchHttpClient } from '../network/FetchHttpClient';
import { POKE_API_BASE_URL } from '../network/constants';
import type { HttpClient } from '../network/HttpClient';
import { NativeImageStore } from '../storage/NativeImageStore';
import { NativeStorage } from '../storage/NativeStorage';
import type { StorageClient } from '../storage/StorageClient';
import { PokemonImageDataSource } from '../../features/pokemon/data/datasources/PokemonImageDataSource';
import { PokemonLocalDataSource } from '../../features/pokemon/data/datasources/PokemonLocalDataSource';
import { PokemonRemoteDataSource } from '../../features/pokemon/data/datasources/PokemonRemoteDataSource';
import { PokemonRepositoryImpl } from '../../features/pokemon/data/repositories/PokemonRepositoryImpl';
import { GetPokemonDetailUseCase } from '../../features/pokemon/domain/usecases/GetPokemonDetailUseCase';
import { GetPokemonListUseCase } from '../../features/pokemon/domain/usecases/GetPokemonListUseCase';
import { LoadMorePokemonUseCase } from '../../features/pokemon/domain/usecases/LoadMorePokemonUseCase';

export interface AppContainer {
  getPokemonListUseCase: GetPokemonListUseCase;
  loadMorePokemonUseCase: LoadMorePokemonUseCase;
  getPokemonDetailUseCase: GetPokemonDetailUseCase;
}

export function createAppContainer(
  httpClient: HttpClient = new FetchHttpClient(POKE_API_BASE_URL),
  storage: StorageClient = new NativeStorage(),
): AppContainer {
  const remoteDataSource = new PokemonRemoteDataSource(httpClient);
  const localDataSource = new PokemonLocalDataSource(storage);
  const imageDataSource = new PokemonImageDataSource(new NativeImageStore(storage));
  const repository = new PokemonRepositoryImpl(
    remoteDataSource,
    localDataSource,
    imageDataSource,
  );

  return {
    getPokemonListUseCase: new GetPokemonListUseCase(repository),
    loadMorePokemonUseCase: new LoadMorePokemonUseCase(repository),
    getPokemonDetailUseCase: new GetPokemonDetailUseCase(repository),
  };
}
