// Navigation configuration for the app

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';

// Screen imports
import HomeScreen from '../screens/HomeScreen';
import WiFiConfigScreen from '../screens/WiFiConfigScreen';
import AlarmConfigScreen from '../screens/AlarmConfigScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1976D2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'ESP32 Alarm Clock' }}
        />
        <Stack.Screen
          name="WiFiConfig"
          component={WiFiConfigScreen}
          options={{ title: 'WiFi Configuration' }}
        />
        <Stack.Screen
          name="AlarmConfig"
          component={AlarmConfigScreen}
          options={{ title: 'Alarm Settings' }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ title: 'Clock Settings' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
