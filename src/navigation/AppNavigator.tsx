<<<<<<< HEAD
// Navigation configuration for the app

=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
<<<<<<< HEAD

// Screen imports
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
import HomeScreen from '../screens/HomeScreen';
import WiFiConfigScreen from '../screens/WiFiConfigScreen';
import AlarmConfigScreen from '../screens/AlarmConfigScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();
<<<<<<< HEAD

=======
/**
 * AppNavigator is the navigation component for the ESP32 Alarm Clock app.
 * It uses the Stack Navigator to switch between screens like HomeScreen, WiFiConfigScreen, AlarmConfigScreen, SettingsScreen.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
