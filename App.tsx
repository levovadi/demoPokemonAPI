import { StatusBar } from 'expo-status-bar';
import { AppDependenciesProvider } from './src/core/di/AppDependenciesContext';
import { createAppContainer } from './src/core/di/container';
import { AppNavigator } from './src/features/pokemon/presentation/navigation/AppNavigator';

const appContainer = createAppContainer();

export default function App() {
  return (
    <AppDependenciesProvider container={appContainer}>
      <StatusBar style="light" />
      <AppNavigator />
    </AppDependenciesProvider>
  );
}
