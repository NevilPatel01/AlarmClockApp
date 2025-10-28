import RNBluetoothClassic, {
  BluetoothDevice as RNBluetoothDevice,
} from 'react-native-bluetooth-classic';
import { BluetoothDevice, ConnectionStatus } from '../types';
import { BLUETOOTH_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { PermissionsAndroid, Platform } from 'react-native';
import { sanitizeErrorMessage } from '../utils/errorHandler';

/**
 * Service for managing Bluetooth connections, scanning devices, sending commands, and maintaining connection state with the ESP32.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
export class BluetoothService {
  private static connectedDevice: RNBluetoothDevice | null = null;
  private static connectionStatus: ConnectionStatus = { isConnected: false };

  /**
   * Request necessary Bluetooth and location permissions on Android.
   * @returns True if all required permissions are granted, false otherwise.
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
   * Check if Bluetooth is currently enabled on the device.
   * @returns True if Bluetooth is enabled, false otherwise.
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
   * Request the user to enable Bluetooth.
   * @returns True if Bluetooth is successfully enabled, false otherwise.
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
   * Scan for available Bluetooth devices (paired and unpaired).
   * @returns An array of BluetoothDevice objects.
   * @throws Error if Bluetooth is not enabled or permissions are denied.
   */
  static async scanDevices(): Promise<BluetoothDevice[]> {
    try {
      const isEnabled = await this.isBluetoothEnabled();
      if (!isEnabled) {
        const enabled = await this.requestBluetoothEnabled();
        if (!enabled) {
          throw new Error(ERROR_MESSAGES.BLUETOOTH_NOT_ENABLED);
        }
      }

      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error(ERROR_MESSAGES.LOCATION_PERMISSION_DENIED);
      }

      const pairedDevices = await RNBluetoothClassic.getBondedDevices();

      await RNBluetoothClassic.startDiscovery();
      await new Promise<void>(resolve =>
        setTimeout(resolve, BLUETOOTH_CONFIG.SCAN_DURATION)
      );
      const discoveredDevices = await RNBluetoothClassic.cancelDiscovery();

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
   * Connect to a specific Bluetooth device.
   * @param device - The BluetoothDevice object to connect to.
   * @returns ConnectionStatus indicating success and connected device info.
   * @throws Error if connection fails.
   */
  static async connect(device: BluetoothDevice): Promise<ConnectionStatus> {
    try {
      if (this.connectedDevice) {
        await this.disconnect();
      }

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
   * Disconnect from the currently connected device.
   * @throws Error if disconnection fails.
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
      throw new Error(sanitizeErrorMessage(error));
    }
  }

  /**
   * Send a single command string to the connected device.
   * @param command - The command string to send.
   * @returns True if command is successfully sent.
   * @throws Error if no device is connected or sending fails.
   */
  static async sendCommand(command: string): Promise<boolean> {
    try {
      if (!this.connectedDevice || !this.connectionStatus.isConnected) {
        throw new Error(ERROR_MESSAGES.DEVICE_NOT_CONNECTED);
      }

      const success = await this.connectedDevice.write(`${command}\n`);

      if (success) {
        console.log(`Command sent: ${command}`);
        return true;
      } else {
        throw new Error(ERROR_MESSAGES.COMMAND_SEND_FAILED);
      }
    } catch (error) {
      console.error('Error sending command:', error);
      throw new Error(sanitizeErrorMessage(error));
    }
  }

  /**
   * Send multiple commands sequentially with optional delay between each.
   * @param commands - Array of command strings to send.
   * @param delayMs - Delay in milliseconds between commands (default 500ms).
   * @returns True if all commands are successfully sent.
   * @throws Error if sending any command fails.
   */
  static async sendCommands(commands: string[], delayMs: number = 500): Promise<boolean> {
    try {
      for (const command of commands) {
        await this.sendCommand(command);
        await new Promise<void>(resolve => setTimeout(resolve, delayMs));
      }
      return true;
    } catch (error) {
      console.error('Error sending multiple commands:', error);
      throw error;
    }
  }

  /**
   * Get the current connection status.
   * @returns ConnectionStatus object.
   */
  static getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
   * Check if there is an active connection.
   * @returns True if connected, false otherwise.
   */
  static isConnected(): boolean {
    return this.connectionStatus.isConnected;
  }

  /**
   * Get basic information of the connected device.
   * @returns Object containing name and address or null if not connected.
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
   * Read data from the connected device.
   * @returns The received string data, or null if no data or not connected.
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
