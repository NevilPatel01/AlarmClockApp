// Type definitions for the Alarm Clock App

export interface ClockConfig {
  wifiSSID: string;
  wifiPassword: string;
  timeOffset: number; // UTC offset in hours (e.g., -4 for EDT)
  dstEnabled: boolean;
  alarmTime: string; // HH:MM format (24-hour)
  alarmEnabled: boolean;
  brightness: number; // 0-7 range
}

export interface BluetoothDevice {
  id: string;
  name: string;
  address: string;
  rssi?: number;
  bonded: boolean;
}

export interface ConnectionStatus {
  isConnected: boolean;
  deviceName?: string;
  deviceAddress?: string;
  error?: string;
}

export type RootStackParamList = {
  Home: undefined;
  WiFiConfig: undefined;
  AlarmConfig: undefined;
  Settings: undefined;
};

export interface ConfigProfile {
  id: string;
  name: string;
  config: ClockConfig;
  createdAt: string;
  updatedAt: string;
}
