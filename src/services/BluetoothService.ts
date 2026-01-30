<<<<<<< HEAD
// Bluetooth service for device communication
// Handles scanning, connecting, and sending commands to ESP32

=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
import RNBluetoothClassic, {
  BluetoothDevice as RNBluetoothDevice,
} from 'react-native-bluetooth-classic';
import { BluetoothDevice, ConnectionStatus } from '../types';
import { BLUETOOTH_CONFIG, ERROR_MESSAGES } from '../utils/constants';
import { PermissionsAndroid, Platform } from 'react-native';
import { sanitizeErrorMessage } from '../utils/errorHandler';

<<<<<<< HEAD
=======
/**
 * Service for managing Bluetooth connections, scanning devices, sending commands, and maintaining connection state with the ESP32.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export class BluetoothService {
  private static connectedDevice: RNBluetoothDevice | null = null;
  private static connectionStatus: ConnectionStatus = { isConnected: false };

  /**
<<<<<<< HEAD
   * Request necessary Bluetooth and location permissions
=======
   * Request necessary Bluetooth and location permissions on Android.
   * @returns True if all required permissions are granted, false otherwise.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Check if Bluetooth is enabled on the device
=======
   * Check if Bluetooth is currently enabled on the device.
   * @returns True if Bluetooth is enabled, false otherwise.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Request to enable Bluetooth
=======
   * Request the user to enable Bluetooth.
   * @returns True if Bluetooth is successfully enabled, false otherwise.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Scan for available Bluetooth devices
   * Returns both paired and unpaired devices
   */
  static async scanDevices(): Promise<BluetoothDevice[]> {
    try {
      // Check if Bluetooth is enabled
=======
   * Scan for available Bluetooth devices (paired and unpaired).
   * @returns An array of BluetoothDevice objects.
   * @throws Error if Bluetooth is not enabled or permissions are denied.
   */
  static async scanDevices(): Promise<BluetoothDevice[]> {
    try {
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const isEnabled = await this.isBluetoothEnabled();
      if (!isEnabled) {
        const enabled = await this.requestBluetoothEnabled();
        if (!enabled) {
          throw new Error(ERROR_MESSAGES.BLUETOOTH_NOT_ENABLED);
        }
      }

<<<<<<< HEAD
      // Request permissions
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const hasPermissions = await this.requestPermissions();
      if (!hasPermissions) {
        throw new Error(ERROR_MESSAGES.LOCATION_PERMISSION_DENIED);
      }

<<<<<<< HEAD
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
      
=======
      const pairedDevices = await RNBluetoothClassic.getBondedDevices();

      await RNBluetoothClassic.startDiscovery();
      await new Promise<void>(resolve =>
        setTimeout(resolve, BLUETOOTH_CONFIG.SCAN_DURATION)
      );
      const discoveredDevices = await RNBluetoothClassic.cancelDiscovery();

      const discoveredArray = Array.isArray(discoveredDevices) ? discoveredDevices : [];
      const allDevices = [...pairedDevices, ...discoveredArray];

>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Connect to a specific Bluetooth device
   */
  static async connect(device: BluetoothDevice): Promise<ConnectionStatus> {
    try {
      // Disconnect from any existing connection
=======
   * Connect to a specific Bluetooth device.
   * @param device - The BluetoothDevice object to connect to.
   * @returns ConnectionStatus indicating success and connected device info.
   * @throws Error if connection fails.
   */
  static async connect(device: BluetoothDevice): Promise<ConnectionStatus> {
    try {
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      if (this.connectedDevice) {
        await this.disconnect();
      }

<<<<<<< HEAD
      // Connect to the device
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const connected = await RNBluetoothClassic.connectToDevice(device.id);

      if (connected) {
        this.connectedDevice = connected;
        this.connectionStatus = {
          isConnected: true,
          deviceName: device.name,
          deviceAddress: device.address,
        };
<<<<<<< HEAD

=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Disconnect from the currently connected device
=======
   * Disconnect from the currently connected device.
   * @throws Error if disconnection fails.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
      const userMessage = sanitizeErrorMessage(error);
      throw new Error(userMessage);
=======
      throw new Error(sanitizeErrorMessage(error));
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    }
  }

  /**
<<<<<<< HEAD
   * Send a command string to the connected device
=======
   * Send a single command string to the connected device.
   * @param command - The command string to send.
   * @returns True if command is successfully sent.
   * @throws Error if no device is connected or sending fails.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async sendCommand(command: string): Promise<boolean> {
    try {
      if (!this.connectedDevice || !this.connectionStatus.isConnected) {
        throw new Error(ERROR_MESSAGES.DEVICE_NOT_CONNECTED);
      }

<<<<<<< HEAD
      // Send command with newline terminator (as ESP32 expects)
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const success = await this.connectedDevice.write(`${command}\n`);

      if (success) {
        console.log(`Command sent: ${command}`);
        return true;
      } else {
        throw new Error(ERROR_MESSAGES.COMMAND_SEND_FAILED);
      }
    } catch (error) {
      console.error('Error sending command:', error);
<<<<<<< HEAD
      const userMessage = sanitizeErrorMessage(error);
      throw new Error(userMessage);
=======
      throw new Error(sanitizeErrorMessage(error));
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    }
  }

  /**
<<<<<<< HEAD
   * Send multiple commands sequentially with delay between each
=======
   * Send multiple commands sequentially with optional delay between each.
   * @param commands - Array of command strings to send.
   * @param delayMs - Delay in milliseconds between commands (default 500ms).
   * @returns True if all commands are successfully sent.
   * @throws Error if sending any command fails.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async sendCommands(commands: string[], delayMs: number = 500): Promise<boolean> {
    try {
      for (const command of commands) {
        await this.sendCommand(command);
<<<<<<< HEAD
        // Wait between commands to ensure ESP32 processes them
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        await new Promise<void>(resolve => setTimeout(resolve, delayMs));
      }
      return true;
    } catch (error) {
      console.error('Error sending multiple commands:', error);
      throw error;
    }
  }

  /**
<<<<<<< HEAD
   * Get current connection status
=======
   * Get the current connection status.
   * @returns ConnectionStatus object.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  /**
<<<<<<< HEAD
   * Check if currently connected to a device
=======
   * Check if there is an active connection.
   * @returns True if connected, false otherwise.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static isConnected(): boolean {
    return this.connectionStatus.isConnected;
  }

  /**
<<<<<<< HEAD
   * Get connected device info
=======
   * Get basic information of the connected device.
   * @returns Object containing name and address or null if not connected.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Read data from the connected device (if ESP32 sends responses)
=======
   * Read data from the connected device.
   * @returns The received string data, or null if no data or not connected.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
