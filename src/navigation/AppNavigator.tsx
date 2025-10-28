import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import WiFiConfigScreen from '../screens/WiFiConfigScreen';
import AlarmConfigScreen from '../screens/AlarmConfigScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();
/**
 * AppNavigator is the navigation component for the ESP32 Alarm Clock app.
 * It uses the Stack Navigator to switch between screens like HomeScreen, WiFiConfigScreen, AlarmConfigScreen, SettingsScreen.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
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
