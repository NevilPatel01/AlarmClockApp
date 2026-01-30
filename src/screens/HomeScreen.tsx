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

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [devices, setDevices] = useState<BluetoothDevice[]>([]);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDeviceName, setConnectedDeviceName] = useState('');
  const [wifiConfigured, setWifiConfigured] = useState(false);
  const [wifiSSID, setWifiSSID] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  // Refresh status when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadStatus();
    }, [])
  );

  const loadStatus = async () => {
    const config = await StorageService.loadConfig();
    setWifiConfigured(!!config.wifiSSID);
    setWifiSSID(config.wifiSSID);
    setAlarmTime(config.alarmTime);
    setAlarmEnabled(config.alarmEnabled);
    
    const status = BluetoothService.getConnectionStatus();
    setIsConnected(status.isConnected);
    setConnectedDeviceName(status.deviceName || '');
  };

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

  const handleConnectDevice = async (device: BluetoothDevice) => {
    try {
      setLoadingMessage(`Connecting to ${device.name}...`);
      await BluetoothService.connect(device);
      await StorageService.saveLastDevice(device);
      
      setIsConnected(true);
      setConnectedDeviceName(device.name);
      setLoadingMessage('');
      
      Alert.alert('Connected', `Successfully connected to ${device.name}`);
      loadStatus();
    } catch (error) {
      setLoadingMessage('');
      Alert.alert('Connection Error', error instanceof Error ? error.message : 'Failed to connect');
    }
  };

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
      <LoadingOverlay visible={!!loadingMessage} message={loadingMessage} />
      
      <ScrollView style={styles.content}>
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

        {isConnected && (
          <>
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
