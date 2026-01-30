/**
 * ESP32 Alarm Clock Configuration App
 * React Native App with Bluetooth Classic support
 *
 * @format
 */
import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import {theme} from './src/theme/theme';

function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={theme.colors.background}
        />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;

