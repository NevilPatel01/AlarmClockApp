// Bluetooth service for device communication
// Handles scanning, connecting, and sending commands to ESP32

import RNBluetoothClassic, {
  BluetoothDevice as RNBluetoothDevice,
} from 'react-native-bluetooth-classic';
import { BluetoothDevice, ConnectionStatus } from '../types';
import { BLUETOOTH_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { PermissionsAndroid, Platform } from 'react-native';
import { sanitizeErrorMessage } from '../utils/errorHandler';

export class BluetoothService {
  private static connectedDevice: RNBluetoothDevice | null = null;
  private static connectionStatus: ConnectionStatus = { isConnected: false };

  /**
   * Request necessary Bluetooth and location permissions
   */
  static async requestPermissions(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted = Object.values(granted).every(
          status => status === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          console.warn('Some permissions were not granted');
          return false;
        }

        return true;
      } catch (error) {
        console.error('Permission request error:', error);
        return false;
      }
    }
    return true; // iOS handles permissions differently
  }

  /**
   * Check if Bluetooth is enabled on the device
   */
  static async isBluetoothEnabled(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.isBluetoothEnabled();
    } catch (error) {
      console.error('Error checking Bluetooth status:', error);
      return false;
    }
  }

  /**
   * Request to enable Bluetooth
   */
  static async requestBluetoothEnabled(): Promise<boolean> {
    try {
      return await RNBluetoothClassic.requestBluetoothEnabled();
    } catch (error) {
      console.error('Error requesting Bluetooth enable:', error);
      return false;
    }
  }

  /**
   * Scan for available Bluetooth devices
   * Returns both paired and unpaired devices
   */
  static async scanDevices(): Promise<BluetoothDevice[]> {
    try {
      // Check if Bluetooth is enabled
      const isEnabled = await this.isBluetoothEnabled();
      if (!isEnabled) {
        const enabled = await this.requestBluetoothEnabled();
        if (!enabled) {
          throw new Error(ERROR_MESSAGES.BLUETOOTH_NOT_ENABLED);
        }
      }

      // Request permissions
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error(ERROR_MESSAGES.LOCATION_PERMISSION_DENIED);
      }

      // Get paired devices
      const pairedDevices = await RNBluetoothClassic.getBondedDevices();

      // Start discovery for unpaired devices
      await RNBluetoothClassic.startDiscovery();
      
      // Wait for scan duration
      await new Promise<void>(resolve => setTimeout(resolve, BLUETOOTH_CONFIG.SCAN_DURATION));

      // Get discovered devices
      const discoveredDevices = await RNBluetoothClassic.cancelDiscovery();

      // Combine and format devices (checking if discoveredDevices is an array)
      const discoveredArray = Array.isArray(discoveredDevices) ? discoveredDevices : [];
      const allDevices = [...pairedDevices, ...discoveredArray];
      
      return allDevices.map(device => ({
        id: device.id,
        name: device.name || 'Unknown Device',
        address: device.address,
        rssi: device.rssi,
        bonded: device.bonded || false,
      }));
    } catch (error) {
      console.error('Error scanning devices:', error);
      throw error;
    }
  }

  /**
   * Connect to a specific Bluetooth device
   */
  static async connect(device: BluetoothDevice): Promise<ConnectionStatus> {
    try {
      // Disconnect from any existing connection
      if (this.connectedDevice) {
        await this.disconnect();
      }

      // Connect to the device
      const connected = await RNBluetoothClassic.connectToDevice(device.id);

      if (connected) {
        this.connectedDevice = connected;
        this.connectionStatus = {
          isConnected: true,
          deviceName: device.name,
          deviceAddress: device.address,
        };

        console.log(`Connected to ${device.name}`);
        return this.connectionStatus;
      } else {
        throw new Error(ERROR_MESSAGES.CONNECTION_FAILED);
      }
    } catch (error) {
      console.error('Connection error:', error);
      const userMessage = sanitizeErrorMessage(error);
      this.connectionStatus = {
        isConnected: false,
        error: userMessage,
      };
      throw new Error(userMessage);
    }
  }

  /**
   * Disconnect from the currently connected device
   */
  static async disconnect(): Promise<void> {
    try {
      if (this.connectedDevice) {
        await this.connectedDevice.disconnect();
        this.connectedDevice = null;
        this.connectionStatus = { isConnected: false };
        console.log('Disconnected successfully');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      const userMessage = sanitizeErrorMessage(error);
      throw new Error(userMessage);
    }
  }

  /**
   * Send a command string to the connected device
   */
  static async sendCommand(command: string): Promise<boolean> {
    try {
      if (!this.connectedDevice || !this.connectionStatus.isConnected) {
        throw new Error(ERROR_MESSAGES.DEVICE_NOT_CONNECTED);
      }

      // Send command with newline terminator (as ESP32 expects)
      const success = await this.connectedDevice.write(`${command}\n`);

      if (success) {
        console.log(`Command sent: ${command}`);
        return true;
      } else {
        throw new Error(ERROR_MESSAGES.COMMAND_SEND_FAILED);
      }
    } catch (error) {
      console.error('Error sending command:', error);
      const userMessage = sanitizeErrorMessage(error);
      throw new Error(userMessage);
    }
  }

  /**
   * Send multiple commands sequentially with delay between each
   */
  static async sendCommands(commands: string[], delayMs: number = 500): Promise<boolean> {
    try {
      for (const command of commands) {
        await this.sendCommand(command);
        // Wait between commands to ensure ESP32 processes them
        await new Promise<void>(resolve => setTimeout(resolve, delayMs));
      }
      return true;
    } catch (error) {
      console.error('Error sending multiple commands:', error);
      throw error;
    }
  }

  /**
   * Get current connection status
   */
  static getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Check if currently connected to a device
   */
  static isConnected(): boolean {
    return this.connectionStatus.isConnected;
  }

  /**
   * Get connected device info
   */
  static getConnectedDevice(): { name?: string; address?: string } | null {
    if (!this.connectionStatus.isConnected) {
      return null;
    }
    return {
      name: this.connectionStatus.deviceName,
      address: this.connectionStatus.deviceAddress,
    };
  }

  /**
   * Read data from the connected device (if ESP32 sends responses)
   */
  static async readData(): Promise<string | null> {
    try {
      if (!this.connectedDevice || !this.connectionStatus.isConnected) {
        return null;
      }

      const data = await this.connectedDevice.read();
      return data ? String(data) : null;
    } catch (error) {
      console.error('Error reading data:', error);
      return null;
    }
  }
}
