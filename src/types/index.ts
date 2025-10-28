/**
 * Configuration settings for the alarm clock.
 */
export interface ClockConfig {
  /** WiFi network SSID to connect to */
  wifiSSID: string;

  /** WiFi network password */
  wifiPassword: string;

  /** UTC offset in hours */
  timeOffset: number;

  /** Enable or disable Daylight Saving Time */
  dstEnabled: boolean;

  /** Alarm time in 24-hour HH:MM format */
  alarmTime: string;

  /** Enable or disable the alarm */
  alarmEnabled: boolean;

  /** Display brightness level (range 0-7) */
  brightness: number;
}

/**
 * Represents a Bluetooth device discovered or connected to.
 */
export interface BluetoothDevice {
  /** Unique identifier for the device */
  id: string;

  /** Human-readable device name */
  name: string;

  /** Device MAC address */
  address: string;

  /** Received signal strength indicator (optional) */
  rssi?: number;

  /** Whether the device is bonded/paired */
  bonded: boolean;
}

/**
 * Status of the current Bluetooth connection.
 */
export interface ConnectionStatus {
  /** Indicates if a device is currently connected */
  isConnected: boolean;

  /** Name of the connected device (if any) */
  deviceName?: string;

  /** Address of the connected device (if any) */
  deviceAddress?: string;

  /** Error message in case of connection failure */
  error?: string;
}

/**
 * Navigation parameters for the app's root stack.
 */
export type RootStackParamList = {
  /** Home screen - no parameters required */
  Home: undefined;

  /** WiFi configuration screen - no parameters required */
  WiFiConfig: undefined;

  /** Alarm configuration screen - no parameters required */
  AlarmConfig: undefined;

  /** General settings screen - no parameters required */
  Settings: undefined;
};

/**
 * Represents a saved configuration profile for the clock.
 */
export interface ConfigProfile {
  /** Unique profile ID */
  id: string;

  /** User-defined profile name */
  name: string;

  /** Clock configuration associated with this profile */
  config: ClockConfig;

  /** ISO string representing creation date */
  createdAt: string;

  /** ISO string representing last update date */
  updatedAt: string;
}
