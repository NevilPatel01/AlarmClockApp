export const APP_NAME = 'ESP32 Alarm Clock';
export const APP_VERSION = '1.0.0';

// Default configuration values
export const DEFAULT_CONFIG = {
  wifiSSID: '',
  wifiPassword: '',
  timeOffset: -4, // EST (UTC-4)
  dstEnabled: false,
  alarmTime: '07:00',
  alarmEnabled: false,
  brightness: 5,
};

// Brightness levels (0-7 for TM1637 display)
export const MIN_BRIGHTNESS = 0;
export const MAX_BRIGHTNESS = 7;

// Time offset range (UTC-12 to UTC+14)
export const MIN_TIME_OFFSET = -12;
export const MAX_TIME_OFFSET = 14;

// AsyncStorage keys
export const STORAGE_KEYS = {
  CURRENT_CONFIG: '@alarm_clock:current_config',
  SAVED_PROFILES: '@alarm_clock:saved_profiles',
  LAST_DEVICE: '@alarm_clock:last_device',
};

// Bluetooth configuration
export const BLUETOOTH_CONFIG = {
  SCAN_DURATION: 12000, // 12 seconds
  CONNECTION_TIMEOUT: 15000, // 15 seconds
  RETRY_ATTEMPTS: 3,
};

// Command protocols for ESP32
export const COMMANDS = {
  WIFI: 'WIFI',
  OFFSET: 'OFFSET',
  DST: 'DST',
  ALARM: 'ALARM',
  BRIGHTNESS: 'BRIGHTNESS',
};

// Validation regex patterns
export const PATTERNS = {
  TIME_24H: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  WIFI_SSID: /^[\s\S]{1,32}$/, // SSID can be 1-32 characters
};

// Error messages
export const ERROR_MESSAGES = {
  BLUETOOTH_NOT_ENABLED: 'Please enable Bluetooth to continue',
  LOCATION_PERMISSION_DENIED: 'Location permission is required for Bluetooth scanning',
  DEVICE_NOT_CONNECTED: 'No device connected. Please connect first.',
  CONNECTION_FAILED: 'Failed to connect to device',
  COMMAND_SEND_FAILED: 'Failed to send command to device',
  INVALID_TIME_FORMAT: 'Invalid time format. Use HH:MM (24-hour)',
  INVALID_WIFI_SSID: 'WiFi SSID must be 1-32 characters',
  INVALID_WIFI_PASSWORD: 'WiFi password must be at least 8 characters',
};

// Success messages
export const SUCCESS_MESSAGES = {
  CONNECTED: 'Connected successfully',
  DISCONNECTED: 'Disconnected',
  CONFIG_SAVED: 'Configuration saved',
  PROFILE_SAVED: 'Profile saved successfully',
  COMMAND_SENT: 'Command sent successfully',
};
