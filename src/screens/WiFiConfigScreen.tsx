import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, Alert } from 'react-native';
import { Surface, TextInput, Button, HelperText } from 'react-native-paper';
import { BluetoothService } from '../services/BluetoothService';
import { StorageService } from '../services/StorageService';
import { CommandBuilder } from '../services/CommandBuilder';
import { validateWiFiSSID, validateWiFiPassword } from '../utils/validation';
import LoadingOverlay from '../components/LoadingOverlay';

/**
 * Screen component for configuring WiFi on the ESP32 device.
 * Allows users to input SSID and password, validates input,
 * sends configuration over Bluetooth, and monitors ESP32 connection.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
const WiFiConfigScreen: React.FC = () => {
  /** WiFi SSID input state */
  const [ssid, setSSID] = useState('');

  /** WiFi password input state */
  const [password, setPassword] = useState('');

  /** Toggle visibility of password input */
  const [showPassword, setShowPassword] = useState(false);

  /** Loading overlay message */
  const [loadingMessage, setLoadingMessage] = useState('');

  /** Validation error for SSID */
  const [ssidError, setSSIDError] = useState('');

  /** Validation error for password */
  const [passwordError, setPasswordError] = useState('');

  /** Load stored WiFi configuration on mount */
  useEffect(() => {
    loadConfig();
  }, []);

  /**
   * Load existing configuration from local storage
   * and populate input fields.
   */
  const loadConfig = async () => {
    const config = await StorageService.loadConfig();
    setSSID(config.wifiSSID);
    setPassword(config.wifiPassword);
  };

  /**
   * Validate inputs, send WiFi configuration via Bluetooth,
   * and handle ESP32 response including success/error.
   */
  const handleSendConfig = async () => {
    // Validate inputs
    const ssidValidation = validateWiFiSSID(ssid);
    const passwordValidation = validateWiFiPassword(password);

    setSSIDError(ssidValidation.error || '');
    setPasswordError(passwordValidation.error || '');

    if (!ssidValidation.valid || !passwordValidation.valid) return;

    // Check Bluetooth connection
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

      setLoadingMessage('Waiting for ESP32 to connect to WiFi...');

      // Wait for ESP32 response (max 20 seconds)
      let response = '';
      const maxWaitTime = 20000; // 20 seconds
      const startTime = Date.now();

      while (Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const data = await BluetoothService.readData();

        if (data) {
          response += data;
          console.log('ESP32 response:', data);

          // Success message handling
          if (data.includes('SUCCESS:') || data.includes('Connected to')) {
            const config = await StorageService.loadConfig();
            await StorageService.saveConfig({ ...config, wifiSSID: ssid, wifiPassword: password });

            setLoadingMessage('');
            console.log('WiFi connected successfully');
            Alert.alert('Success', `Connected to ${ssid}`);
            return;
          }

          // Error message handling
          if (data.includes('ERROR:') || data.includes('failed') || data.includes('Unable to connect')) {
            setLoadingMessage('');
            console.log('WiFi connection failed');

            const errorMatch = data.match(/ERROR:\s*(.+)/);
            const errorMsg = errorMatch ? errorMatch[1].trim() : 'Unable to connect to WiFi. Please recheck the SSID and password.';
            
            Alert.alert('Connection Failed', errorMsg);
            return;
          }
        }
      }

      // Timeout
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
      {/* Loading overlay */}
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />

      <ScrollView style={styles.content}>
        {/* SSID input */}
        <TextInput
          label="WiFi SSID"
          value={ssid}
          onChangeText={setSSID}
          mode="outlined"
          style={styles.input}
          error={!!ssidError}
          left={<TextInput.Icon icon="wifi" />}
        />
        <HelperText type="error" visible={!!ssidError}>{ssidError}</HelperText>

        {/* Password input */}
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
        <HelperText type="error" visible={!!passwordError}>{passwordError}</HelperText>

        {/* Send button */}
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

/** Screen styling */
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