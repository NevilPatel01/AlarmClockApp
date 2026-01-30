import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Surface, Button, List, Text, Divider, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { RootStackParamList, BluetoothDevice } from '../types';
import { BluetoothService } from '../services/BluetoothService';
import { StorageService } from '../services/StorageService';
import LoadingOverlay from '../components/LoadingOverlay';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

<<<<<<< HEAD
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [wifiConfigured, setWifiConfigured] = useState(false);
  const [wifiSSID, setWifiSSID] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);

=======
/**
 * HomeScreen component displays to bluetooth connection status, WiFi configuration status, alarm status,
 * quick action buttons and list of available Bluetooth devices.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  /** List of discovered Bluetooth devices */
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);

  /** Message for loading overlay */
  const [loadingMessage, setLoadingMessage] = useState('');

  /** Indicates if a device is connected */
  const [isConnected, setIsConnected] = useState(false);

  /** Name of the currently connected device */
  const [connectedDeviceName, setConnectedDeviceName] = useState('');

  /** WiFi configuration status */
  const [wifiConfigured, setWifiConfigured] = useState(false);

  /** WiFi SSID */
  const [wifiSSID, setWifiSSID] = useState('');

  /** Alarm time */
  const [alarmTime, setAlarmTime] = useState('');

  /** Indicates if alarm is enabled */
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  /** Load status on mount */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  useEffect(() => {
    loadStatus();
  }, []);

<<<<<<< HEAD
  // Refresh status when screen comes into focus
=======
  /** Refresh status when screen comes into focus */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  useFocusEffect(
    React.useCallback(() => {
      loadStatus();
    }, [])
  );

<<<<<<< HEAD
=======
  /**
   * Loads saved configuration and current Bluetooth connection status
   */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  const loadStatus = async () => {
    const config = await StorageService.loadConfig();
    setWifiConfigured(!!config.wifiSSID);
    setWifiSSID(config.wifiSSID);
    setAlarmTime(config.alarmTime);
    setAlarmEnabled(config.alarmEnabled);
<<<<<<< HEAD
    
=======

>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    const status = BluetoothService.getConnectionStatus();
    setIsConnected(status.isConnected);
    setConnectedDeviceName(status.deviceName || '');
  };

<<<<<<< HEAD
=======
  /**
   * Scan for available Bluetooth devices
   */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  const handleScanDevices = async () => {
    try {
      setLoadingMessage('Scanning for devices...');
      const discoveredDevices = await BluetoothService.scanDevices();
      setDevices(discoveredDevices);
      setLoadingMessage('');
    } catch (error) {
      setLoadingMessage('');
      Alert.alert('Scan Error', error instanceof Error ? error.message : 'Failed to scan devices');
    }
  };

<<<<<<< HEAD
=======
  /**
   * Connect to a selected Bluetooth device
   * @param device - The BluetoothDevice object to connect to
   */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  const handleConnectDevice = async (device: BluetoothDevice) => {
    try {
      setLoadingMessage(`Connecting to ${device.name}...`);
      await BluetoothService.connect(device);
      await StorageService.saveLastDevice(device);
<<<<<<< HEAD
      
      setIsConnected(true);
      setConnectedDeviceName(device.name);
      setLoadingMessage('');
      
=======

      setIsConnected(true);
      setConnectedDeviceName(device.name);
      setLoadingMessage('');

>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      Alert.alert('Connected', `Successfully connected to ${device.name}`);
      loadStatus();
    } catch (error) {
      setLoadingMessage('');
      Alert.alert('Connection Error', error instanceof Error ? error.message : 'Failed to connect');
    }
  };

<<<<<<< HEAD
=======
  /**
   * Disconnect from the currently connected Bluetooth device
   */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
  const handleDisconnect = async () => {
    try {
      await BluetoothService.disconnect();
      setIsConnected(false);
      setConnectedDeviceName('');
      Alert.alert('Disconnected', 'Device disconnected successfully');
    } catch {
      Alert.alert('Error', 'Failed to disconnect');
    }
  };

  return (
    <Surface style={styles.container}>
<<<<<<< HEAD
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />
      
      <ScrollView style={styles.content}>
=======
      {/* Loading overlay while scanning or connecting */}
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />

      <ScrollView style={styles.content}>
        {/* Bluetooth Connection Card */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.cardHeader}>
              <Text variant="titleMedium">Bluetooth Connection</Text>
              {isConnected && (
                <Button mode="text" onPress={handleDisconnect} compact>
                  Disconnect
                </Button>
              )}
            </View>
            <View style={styles.statusRow}>
              <View style={[styles.statusDot, { backgroundColor: isConnected ? '#4CAF50' : '#757575' }]} />
              <Text variant="bodyMedium">
                {isConnected ? `Connected to ${connectedDeviceName}` : 'Not connected'}
              </Text>
            </View>
          </Card.Content>
        </Card>

<<<<<<< HEAD
        {isConnected && (
          <>
=======
        {/* WiFi and Alarm Status when connected */}
        {isConnected && (
          <>
            {/* WiFi Status */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium">WiFi Configuration</Text>
                <View style={styles.statusRow}>
                  <View style={[styles.statusDot, { backgroundColor: wifiConfigured ? '#4CAF50' : '#FF9800' }]} />
                  <Text variant="bodyMedium">
                    {wifiConfigured ? `Connected to ${wifiSSID}` : 'WiFi not configured'}
                  </Text>
                </View>
                {!wifiConfigured && (
                  <Text variant="bodySmall" style={styles.helperText}>
                    Configure WiFi to sync time with NTP server
                  </Text>
                )}
              </Card.Content>
            </Card>

<<<<<<< HEAD
=======
            {/* Alarm Status */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium">Alarm Status</Text>
                {alarmTime ? (
                  <View style={styles.alarmRow}>
                    <Text variant="headlineMedium" style={styles.alarmTime}>
                      {alarmTime}
                    </Text>
                    <View style={[styles.alarmBadge, { backgroundColor: alarmEnabled ? '#4CAF50' : '#757575' }]}>
                      <Text variant="labelSmall" style={styles.badgeText}>
                        {alarmEnabled ? 'ENABLED' : 'DISABLED'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <Text variant="bodyMedium" style={styles.noAlarmText}>
                    No alarm set
                  </Text>
                )}
              </Card.Content>
            </Card>

<<<<<<< HEAD
=======
            {/* Quick Actions */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
            <View style={styles.actionsContainer}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Quick Actions
              </Text>
              <Button
                mode="contained"
                icon="wifi"
                onPress={() => navigation.navigate('WiFiConfig')}
                style={styles.actionButton}>
                WiFi Setup
              </Button>
              <Button
                mode="contained"
                icon="alarm"
                onPress={() => navigation.navigate('AlarmConfig')}
                style={styles.actionButton}>
                Configure Alarm
              </Button>
              <Button
                mode="contained"
                icon="cog"
                onPress={() => navigation.navigate('Settings')}
                style={styles.actionButton}>
                Settings
              </Button>
            </View>
          </>
        )}

<<<<<<< HEAD
=======
        {/* Device list when not connected */}
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        {!isConnected && (
          <View style={styles.devicesContainer}>
            <View style={styles.deviceHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Available Devices
              </Text>
              <Button mode="contained-tonal" icon="refresh" onPress={handleScanDevices} compact>
                Scan
              </Button>
            </View>
            
            {devices.length === 0 ? (
              <View style={styles.emptyContainer}>
                <List.Icon icon="bluetooth-off" color="#757575" />
                <Text variant="bodyLarge" style={styles.emptyText}>
                  No devices found
                </Text>
                <Text variant="bodySmall" style={styles.emptySubtext}>
                  Tap Scan to discover devices
                </Text>
              </View>
            ) : (
              <FlatList
                data={devices}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <List.Item
                    title={item.name}
                    description={item.address}
                    left={() => <List.Icon icon="bluetooth" />}
                    onPress={() => handleConnectDevice(item)}
                    style={styles.deviceItem}
                  />
                )}
                ItemSeparatorComponent={Divider}
                scrollEnabled={false}
              />
            )}
          </View>
        )}
      </ScrollView>
    </Surface>
  );
};

<<<<<<< HEAD
=======
/** Styles for HomeScreen */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginBottom: 8,
    backgroundColor: '#1E1E1E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  helperText: {
    marginTop: 8,
    color: '#B0B0B0',
  },
  alarmRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  alarmTime: {
    fontWeight: 'bold',
    color: '#64B5F6',
  },
  alarmBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  noAlarmText: {
    marginTop: 8,
    color: '#B0B0B0',
  },
  actionsContainer: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  actionButton: {
    marginBottom: 12,
  },
  devicesContainer: {
    padding: 16,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    color: '#B0B0B0',
  },
  emptySubtext: {
    marginTop: 8,
    color: '#757575',
  },
});

export default HomeScreen;
