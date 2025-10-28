import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { Surface, Button, Text, Card, IconButton, Chip, Switch } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BluetoothService } from '../services/BluetoothService';
import { StorageService } from '../services/StorageService';
import { CommandBuilder } from '../services/CommandBuilder';
import { formatTime24, parseTime24 } from '../utils/validation';
import LoadingOverlay from '../components/LoadingOverlay';

/**
 * AlarmConfigScreen is for managing an alarm configuration. Users can view, set, edit, enable/disable, and delete alarms.
 * It interacts with:
 * BluetoothService: to send alarm commands to a device.
 * StorageService: to persist alarm configurations locally.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
const AlarmConfigScreen: React.FC = () => {
  // Alarm time in "HH:mm" format
  const [alarmTime, setAlarmTime] = useState<string>('');
  // Flag to indicate if alarm is enabled
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  // Controls visibility of the time picker
  const [showPicker, setShowPicker] = useState(false);
  // Selected Date object for time picker
  const [selectedTime, setSelectedTime] = useState(new Date());
  // Message displayed in loading overlay
  const [loadingMessage, setLoadingMessage] = useState('');

  /**
   * Load saved alarm configuration on component mount
   */
  useEffect(() => {
    loadConfig();
  }, []);

  /**
   * Loads alarm configuration from storage and sets state.
   */
  const loadConfig = async () => {
    const config = await StorageService.loadConfig();
    setAlarmTime(config.alarmTime);
    setAlarmEnabled(config.alarmEnabled);

    if (config.alarmTime) {
      const { hours, minutes } = parseTime24(config.alarmTime);
      const date = new Date();
      date.setHours(hours, minutes, 0);
      setSelectedTime(date);
    }
  };

  /**
   * Handles time picker changes.
   * On Android, automatically saves time when user presses OK.
   * On iOS, updates selectedTime state.
   *
   * @param {any} event - Time picker event
   * @param {Date} [date] - Selected date/time
   */
  const handleTimeChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      if (event.type === 'set' && date) {
        setSelectedTime(date);
        handleSaveAlarmAfterTimeSelection(date);
      } else if (event.type === 'dismissed') {
        setShowPicker(false);
      }
    } else {
      if (date) {
        setSelectedTime(date);
      }
    }
  };

  /**
   * Saves alarm configuration immediately after time selection (Android).
   *
   * @param {Date} date - Selected alarm time
   */
  const handleSaveAlarmAfterTimeSelection = async (date: Date) => {
    if (!BluetoothService.isConnected()) {
      setShowPicker(false);
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      setLoadingMessage('Setting alarm...');
      setShowPicker(false);
      const timeString = formatTime24(date.getHours(), date.getMinutes());

      console.log('Sending alarm configuration:', { timeString, enabled: true });

      const commands = [
        CommandBuilder.buildAlarmTimeCommand(timeString),
        CommandBuilder.buildAlarmEnableCommand(true),
      ];

      await BluetoothService.sendCommands(commands);

      // Persist configuration
      const config = await StorageService.loadConfig();
      await StorageService.saveConfig({
        ...config,
        alarmTime: timeString,
        alarmEnabled: true,
      });

      setAlarmTime(timeString);
      setAlarmEnabled(true);
      setLoadingMessage('');

      console.log('Alarm configuration sent successfully');
      Alert.alert('Success', `Alarm set to ${timeString}`);
    } catch (err) {
      setLoadingMessage('');
      console.error('Failed to send alarm configuration:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to set alarm';
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Saves the alarm configuration from the picker manually (iOS Save button).
   */
  const handleSaveAlarm = async () => {
    if (!BluetoothService.isConnected()) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      setLoadingMessage('Setting alarm...');
      const timeString = formatTime24(selectedTime.getHours(), selectedTime.getMinutes());

      console.log('Sending alarm configuration:', { timeString, enabled: true });

      const commands = [
        CommandBuilder.buildAlarmTimeCommand(timeString),
        CommandBuilder.buildAlarmEnableCommand(true),
      ];

      await BluetoothService.sendCommands(commands);

      const config = await StorageService.loadConfig();
      await StorageService.saveConfig({
        ...config,
        alarmTime: timeString,
        alarmEnabled: true,
      });

      setAlarmTime(timeString);
      setAlarmEnabled(true);
      setShowPicker(false);
      setLoadingMessage('');

      console.log('Alarm configuration sent successfully');
      Alert.alert('Success', `Alarm set to ${timeString}`);
    } catch (err) {
      setLoadingMessage('');
      console.error('Failed to send alarm configuration:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to set alarm';
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Toggles alarm on/off state and sends corresponding Bluetooth command.
   */
  const handleToggleAlarm = async () => {
    if (!BluetoothService.isConnected()) {
      Alert.alert('Error', 'No device connected');
      return;
    }

    try {
      setLoadingMessage(alarmEnabled ? 'Disabling alarm...' : 'Enabling alarm...');
      const newEnabled = !alarmEnabled;

      console.log('Toggling alarm:', { enabled: newEnabled });

      const command = CommandBuilder.buildAlarmEnableCommand(newEnabled);
      await BluetoothService.sendCommand(command);

      const config = await StorageService.loadConfig();
      await StorageService.saveConfig({
        ...config,
        alarmEnabled: newEnabled,
      });

      setAlarmEnabled(newEnabled);
      setLoadingMessage('');

      console.log('Alarm toggled successfully');
      Alert.alert('Success', `Alarm ${newEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setLoadingMessage('');
      console.error('Failed to toggle alarm:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to toggle alarm';
      Alert.alert('Error', errorMessage);
    }
  };

  /**
   * Deletes the current alarm after user confirmation.
   */
  const handleDeleteAlarm = async () => {
    Alert.alert(
      'Delete Alarm',
      'Are you sure you want to delete this alarm?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!BluetoothService.isConnected()) {
              Alert.alert('Error', 'No device connected');
              return;
            }

            try {
              setLoadingMessage('Deleting alarm...');

              const command = CommandBuilder.buildAlarmEnableCommand(false);
              await BluetoothService.sendCommand(command);

              const config = await StorageService.loadConfig();
              await StorageService.saveConfig({
                ...config,
                alarmTime: '',
                alarmEnabled: false,
              });

              setAlarmTime('');
              setAlarmEnabled(false);
              setLoadingMessage('');

              console.log('Alarm deleted successfully');
              Alert.alert('Success', 'Alarm deleted');
            } catch (err) {
              setLoadingMessage('');
              console.error('Failed to delete alarm:', err);
              const errorMessage = err instanceof Error ? err.message : 'Failed to delete alarm';
              Alert.alert('Error', errorMessage);
            }
          },
        },
      ]
    );
  };

  return (
    <Surface style={styles.container}>
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />

      <ScrollView style={styles.content}>
        {alarmTime ? (
          <Card style={styles.alarmCard}>
            <Card.Content>
              <View style={styles.alarmRow}>
                <View style={styles.alarmInfo}>
                  <Text variant="displaySmall" style={styles.alarmTime}>
                    {alarmTime}
                  </Text>
                  <Chip
                    mode="flat"
                    style={[
                      styles.statusChip,
                      alarmEnabled ? styles.enabledChip : styles.disabledChip,
                    ]}
                    textStyle={styles.chipText}
                  >
                    {alarmEnabled ? 'ENABLED' : 'DISABLED'}
                  </Chip>
                </View>
                <View style={styles.alarmActions}>
                  <IconButton
                    icon="pencil"
                    size={24}
                    iconColor="#64B5F6"
                    onPress={() => setShowPicker(true)}
                  />
                  <IconButton
                    icon="delete"
                    size={24}
                    iconColor="#F44336"
                    onPress={handleDeleteAlarm}
                  />
                </View>
              </View>
              <View style={styles.switchRow}>
                <Text variant="titleMedium" style={styles.switchLabel}>
                  Alarm {alarmEnabled ? 'ON' : 'OFF'}
                </Text>
                <Switch
                  value={alarmEnabled}
                  onValueChange={handleToggleAlarm}
                  color="#4CAF50"
                />
              </View>
            </Card.Content>
          </Card>
        ) : (
          <View style={styles.emptyState}>
            <Text variant="titleLarge" style={styles.emptyText}>
              No alarm set
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtext}>
              Add an alarm to get started
            </Text>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setShowPicker(true)}
              style={styles.addButton}
            >
              Add Alarm
            </Button>
          </View>
        )}

        {showPicker && (
          <>
            {Platform.OS === 'android' ? (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={handleTimeChange}
              />
            ) : (
              <Card style={styles.pickerCard}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.pickerTitle}>
                    {alarmTime ? 'Edit Alarm Time' : 'Set Alarm Time'}
                  </Text>
                  <DateTimePicker
                    value={selectedTime}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={handleTimeChange}
                  />
                  <View style={styles.pickerActions}>
                    <Button
                      mode="outlined"
                      onPress={() => setShowPicker(false)}
                      style={styles.pickerButton}
                    >
                      Cancel
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleSaveAlarm}
                      style={styles.pickerButton}
                    >
                      Save
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            )}
          </>
        )}
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
  alarmCard: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  alarmRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  alarmInfo: {
    flex: 1,
  },
  alarmTime: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  enabledChip: {
    backgroundColor: '#4CAF50',
  },
  disabledChip: {
    backgroundColor: '#757575',
  },
  chipText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  alarmActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#B0B0B0',
    marginBottom: 24,
  },
  addButton: {
    paddingHorizontal: 24,
  },
  pickerCard: {
    backgroundColor: '#1E1E1E',
    marginTop: 16,
  },
  pickerTitle: {
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  androidPickerContainer: {
    marginVertical: 16,
  },
  pickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  pickerButton: {
    flex: 1,
  },
});

export default AlarmConfigScreen;
