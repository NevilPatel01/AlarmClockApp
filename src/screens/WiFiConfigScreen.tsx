// WiFi Configuration Screen

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { Surface, TextInput, Button, HelperText } from 'react-native-paper';
import { BluetoothService } from '../services/BluetoothService';
import { StorageService } from '../services/StorageService';
import { CommandBuilder } from '../services/CommandBuilder';
import { validateWiFiSSID, validateWiFiPassword } from '../utils/validation';
import LoadingOverlay from '../components/LoadingOverlay';

const WiFiConfigScreen: React.FC = () => {
  const [ssid, setSSID] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [ssidError, setSSIDError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    const config = await StorageService.loadConfig();
    setSSID(config.wifiSSID);
    setPassword(config.wifiPassword);
  };

  const handleSendConfig = async () => {
    // Validate inputs
    const ssidValidation = validateWiFiSSID(ssid);
    const passwordValidation = validateWiFiPassword(password);

    setSSIDError(ssidValidation.error || '');
    setPasswordError(passwordValidation.error || '');

    if (!ssidValidation.valid || !passwordValidation.valid) {
      return;
    }

    if (!BluetoothService.isConnected()) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      setLoadingMessage('Sending WiFi configuration...');
      
      console.log('Sending WiFi configuration:', { ssid });
      
      const command = CommandBuilder.buildWiFiCommand(ssid, password);
      console.log('WiFi command:', command);
      
      await BluetoothService.sendCommand(command);

      // Wait for ESP32 response (up to 20 seconds for WiFi connection)
      setLoadingMessage('Waiting for ESP32 to connect to WiFi...');
      
      let response = '';
      const maxWaitTime = 20000; // 20 seconds
      const startTime = Date.now();
      
      while (Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = await BluetoothService.readData();
        
        if (data) {
          response += data;
          console.log('ESP32 response:', data);
          
          // Check for success message
          if (data.includes('SUCCESS:') || data.includes('Connected to')) {
            // Save to storage only on success
            const config = await StorageService.loadConfig();
            await StorageService.saveConfig({ ...config, wifiSSID: ssid, wifiPassword: password });
            
            setLoadingMessage('');
            console.log('WiFi connected successfully');
            Alert.alert('Success', `Connected to ${ssid}`);
            return;
          }
          
          // Check for error message
          if (data.includes('ERROR:') || data.includes('failed') || data.includes('Unable to connect')) {
            setLoadingMessage('');
            console.log('WiFi connection failed');
            
            // Extract error message from ESP32 response
            const errorMatch = data.match(/ERROR:\s*(.+)/);
            const errorMsg = errorMatch ? errorMatch[1].trim() : 'Unable to connect to WiFi. Please recheck the SSID and password.';
            
            Alert.alert('Connection Failed', errorMsg);
            return;
          }
        }
      }
      
      // Timeout - no clear response received
      setLoadingMessage('');
      Alert.alert('Warning', 'Configuration sent but unable to verify connection status. Check ESP32 serial monitor.');
      
    } catch (error) {
      setLoadingMessage('');
      console.error('Failed to send WiFi configuration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send WiFi configuration';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <Surface style={styles.container}>
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />
      
      <ScrollView style={styles.content}>
        <TextInput
          label="WiFi SSID"
          value={ssid}
          onChangeText={setSSID}
          mode="outlined"
          style={styles.input}
          error={!!ssidError}
          left={<TextInput.Icon icon="wifi" />}
        />
        <HelperText type="error" visible={!!ssidError}>
          {ssidError}
        </HelperText>

        <TextInput
          label="WiFi Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={!showPassword}
          style={styles.input}
          error={!!passwordError}
          left={<TextInput.Icon icon="lock" />}
          right={
            <TextInput.Icon
              icon={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        <HelperText type="error" visible={!!passwordError}>
          {passwordError}
        </HelperText>

        <Button
          mode="contained"
          onPress={handleSendConfig}
          style={styles.button}
          icon="send">
          Send to ESP32
        </Button>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginTop: 8,
    backgroundColor: '#1E1E1E',
  },
  button: {
    marginTop: 24,
  },
});

export default WiFiConfigScreen;
