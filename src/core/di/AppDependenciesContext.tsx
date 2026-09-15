import { createContext, useContext, type ReactNode } from 'react';
import type { AppContainer } from './container';

const AppDependenciesContext = createContext<AppContainer | null>(null);

type AppDependenciesProviderProps = {
  container: AppContainer;
  children: ReactNode;
};

export function AppDependenciesProvider({
  container,
  children,
}: AppDependenciesProviderProps) {
  return (
    <AppDependenciesContext.Provider value={container}>
      {children}
    </AppDependenciesContext.Provider>
  );
}

export function useAppDependencies(): AppContainer {
  const container = useContext(AppDependenciesContext);

  if (!container) {
    throw new Error(
      'useAppDependencies debe usarse dentro de AppDependenciesProvider.',
    );
  }

  return container;
}
