import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider }          from './src/context/ThemeContext';
import { AuthProvider }           from './src/context/AuthContext';
import { FavoritesProvider }      from './src/context/FavoritesContext';
import { HistoryProvider }        from './src/context/HistoryContext';
import { PantryProvider }         from './src/context/PantryContext';
import AppNavigator               from './src/navigation/AppNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <FavoritesProvider>
          <HistoryProvider>
            <PantryProvider>
              <AuthProvider>
                <AppNavigator />
              </AuthProvider>
            </PantryProvider>
          </HistoryProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}