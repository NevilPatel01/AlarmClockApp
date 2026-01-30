<<<<<<< HEAD
// Settings Screen - Time offset, DST, Brightness

=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Surface, Button, Switch, Text, Card, TextInput } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { BluetoothService } from '../services/BluetoothService';
import { StorageService } from '../services/StorageService';
import { CommandBuilder } from '../services/CommandBuilder';
import { validateTimeOffset, validateBrightness } from '../utils/validation';
import { MAX_BRIGHTNESS, MIN_BRIGHTNESS } from '../utils/constants';
import LoadingOverlay from '../components/LoadingOverlay';

<<<<<<< HEAD
const SettingsScreen: React.FC = () => {
  const [timeOffset, setTimeOffset] = useState(-4);
  const [dstEnabled, setDSTEnabled] = useState(false);
  const [brightness, setBrightness] = useState(5);
  const [loadingMessage, setLoadingMessage] = useState('');

=======
/**
 * Screen component for adjusting ESP32 settings.
 * Users can update time offset (UTC), DST, and display brightness.
 * Settings are validated, sent via Bluetooth, and saved locally.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
const SettingsScreen: React.FC = () => {
  /** Current UTC offset */
  const [timeOffset, setTimeOffset] = useState(-4);

  /** Daylight Saving Time toggle */
  const [dstEnabled, setDSTEnabled] = useState(false);

  /** Display brightness (0-7) */
  const [brightness, setBrightness] = useState(5);

  /** Loading overlay message */
  const [loadingMessage, setLoadingMessage] = useState('');

  /** Load stored configuration on mount */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  useEffect(() => {
    loadConfig();
  }, []);

<<<<<<< HEAD
=======
  /**
   * Load existing settings from local storage
   * and populate the input fields.
   */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  const loadConfig = async () => {
    const config = await StorageService.loadConfig();
    setTimeOffset(config.timeOffset);
    setDSTEnabled(config.dstEnabled);
    setBrightness(config.brightness);
  };

<<<<<<< HEAD
  const handleSendConfig = async () => {
    // Validate
=======
  /**
   * Validate inputs, send settings to ESP32 over Bluetooth,
   * and save settings locally on success.
   */
  const handleSendConfig = async () => {
    // Validate time offset and brightness
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    const offsetValidation = validateTimeOffset(timeOffset);
    const brightnessValidation = validateBrightness(brightness);

    if (!offsetValidation.valid || !brightnessValidation.valid) {
      Alert.alert('Validation Error', offsetValidation.error || brightnessValidation.error);
      return;
    }

<<<<<<< HEAD
=======
    // Ensure Bluetooth device is connected
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    if (!BluetoothService.isConnected()) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      setLoadingMessage('Sending settings...');
<<<<<<< HEAD
      
      console.log('Sending settings:', { timeOffset, dstEnabled, brightness });
      
=======
      console.log('Sending settings:', { timeOffset, dstEnabled, brightness });

      // Build commands
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const commands = [
        CommandBuilder.buildOffsetCommand(timeOffset),
        CommandBuilder.buildDSTCommand(dstEnabled),
        CommandBuilder.buildBrightnessCommand(brightness),
      ];

      console.log('Commands to send:', commands);
<<<<<<< HEAD
      
      await BluetoothService.sendCommands(commands);

      // Save to storage
=======

      // Send commands sequentially to ESP32
      await BluetoothService.sendCommands(commands);

      // Save settings locally
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const config = await StorageService.loadConfig();
      await StorageService.saveConfig({
        ...config,
        timeOffset,
        dstEnabled,
        brightness,
      });

      setLoadingMessage('');
      console.log('Settings sent successfully');
<<<<<<< HEAD
      Alert.alert('Success', `Settings updated:\nUTC Offset: ${timeOffset >= 0 ? '+' : ''}${timeOffset}\nDST: ${dstEnabled ? 'ON' : 'OFF'}\nBrightness: ${brightness}`);
=======
      Alert.alert(
        'Success',
        `Settings updated:\nUTC Offset: ${timeOffset >= 0 ? '+' : ''}${timeOffset}\nDST: ${dstEnabled ? 'ON' : 'OFF'}\nBrightness: ${brightness}`
      );
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    } catch (err) {
      setLoadingMessage('');
      console.error('Failed to send settings:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send settings';
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <Surface style={styles.container}>
<<<<<<< HEAD
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />
      
      <ScrollView style={styles.content}>
=======
      {/* Loading overlay */}
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />

      <ScrollView style={styles.content}>
        {/* Time Offset Card */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.label}>
              Time Offset (UTC)
            </Text>
            <TextInput
              label="Hours from UTC (e.g., -4 for EDT)"
              value={timeOffset.toString()}
              onChangeText={text => setTimeOffset(Number(text) || 0)}
              mode="outlined"
              keyboardType="numeric"
              left={<TextInput.Icon icon="clock-outline" />}
            />
            <Text variant="bodySmall" style={styles.helper}>
              Range: -12 to +14
            </Text>
          </Card.Content>
        </Card>

<<<<<<< HEAD
=======
        {/* DST Card */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.row}>
              <Text variant="titleMedium" style={styles.label}>
                Daylight Saving Time (DST)
              </Text>
              <Switch value={dstEnabled} onValueChange={setDSTEnabled} />
            </View>
          </Card.Content>
        </Card>

<<<<<<< HEAD
=======
        {/* Brightness Card */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.label}>
              Display Brightness
            </Text>
            <View style={styles.sliderContainer}>
              <Text variant="bodyLarge" style={styles.brightnessValue}>
                {brightness}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={MIN_BRIGHTNESS}
                maximumValue={MAX_BRIGHTNESS}
                step={1}
                value={brightness}
                onValueChange={setBrightness}
                minimumTrackTintColor="#64B5F6"
                maximumTrackTintColor="#757575"
              />
            </View>
            <View style={styles.sliderLabels}>
              <Text variant="bodySmall" style={styles.helperText}>Low ({MIN_BRIGHTNESS})</Text>
              <Text variant="bodySmall" style={styles.helperText}>High ({MAX_BRIGHTNESS})</Text>
            </View>
          </Card.Content>
        </Card>

<<<<<<< HEAD
=======
        {/* Send button */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        <Button
          mode="contained"
          onPress={handleSendConfig}
          style={styles.sendButton}
          icon="send">
          Send to ESP32
        </Button>
      </ScrollView>
    </Surface>
  );
};

<<<<<<< HEAD
=======
/** Styles for SettingsScreen */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    marginBottom: 12,
    color: '#FFFFFF',
  },
  helper: {
    marginTop: 8,
    color: '#B0B0B0',
  },
  helperText: {
    color: '#B0B0B0',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  brightnessValue: {
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sendButton: {
    marginTop: 24,
  },
});

<<<<<<< HEAD
export default SettingsScreen;
=======
export default SettingsScreen;
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
