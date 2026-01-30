<<<<<<< HEAD
// Validation utilities

import { PATTERNS, ERROR_MESSAGES, MIN_TIME_OFFSET, MAX_TIME_OFFSET, MIN_BRIGHTNESS, MAX_BRIGHTNESS } from './constants';

=======
import { PATTERNS, ERROR_MESSAGES, MIN_TIME_OFFSET, MAX_TIME_OFFSET, MIN_BRIGHTNESS, MAX_BRIGHTNESS } from './constants';

/**
 * Validates that a time string is in 24-hour HH:MM format.
 * @param time - The time string to validate.
 * @returns An object with `valid` boolean and optional `error` message.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const validateTimeFormat = (time: string): { valid: boolean; error?: string } => {
  if (!time) {
    return { valid: false, error: 'Time is required' };
  }
  
  if (!PATTERNS.TIME_24H.test(time)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_TIME_FORMAT };
  }
  
  return { valid: true };
};

<<<<<<< HEAD
=======
/**
 * Validates a WiFi SSID string.
 * @param ssid - The WiFi SSID to validate.
 * @returns An object with `valid` boolean and optional `error` message.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const validateWiFiSSID = (ssid: string): { valid: boolean; error?: string } => {
  if (!ssid) {
    return { valid: false, error: 'WiFi SSID is required' };
  }
  
  if (!PATTERNS.WIFI_SSID.test(ssid)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_WIFI_SSID };
  }
  
  return { valid: true };
};

<<<<<<< HEAD
=======
/**
 * Validates a WiFi password.
 * @param password - The WiFi password to validate.
 * @returns An object with `valid` boolean and optional `error` message.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const validateWiFiPassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'WiFi password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_WIFI_PASSWORD };
  }
  
  return { valid: true };
};

<<<<<<< HEAD
=======
/**
 * Validates a UTC time offset.
 * @param offset - The time offset in hours.
 * @returns An object with `valid` boolean and optional `error` message.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const validateTimeOffset = (offset: number): { valid: boolean; error?: string } => {
  if (offset < MIN_TIME_OFFSET || offset > MAX_TIME_OFFSET) {
    return { valid: false, error: `Time offset must be between ${MIN_TIME_OFFSET} and ${MAX_TIME_OFFSET}` };
  }
  
  return { valid: true };
};

<<<<<<< HEAD
=======
/**
 * Validates a display brightness value.
 * @param brightness - The brightness level to validate.
 * @returns An object with `valid` boolean and optional `error` message.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const validateBrightness = (brightness: number): { valid: boolean; error?: string } => {
  if (brightness < MIN_BRIGHTNESS || brightness > MAX_BRIGHTNESS) {
    return { valid: false, error: `Brightness must be between ${MIN_BRIGHTNESS} and ${MAX_BRIGHTNESS}` };
  }
  
  return { valid: true };
};

<<<<<<< HEAD
=======
/**
 * Formats hours and minutes into a 24-hour HH:MM string.
 * @param hours - The hour component (0-23).
 * @param minutes - The minute component (0-59).
 * @returns A string in HH:MM format.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const formatTime24 = (hours: number, minutes: number): string => {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
};

<<<<<<< HEAD
=======
/**
 * Parses a 24-hour HH:MM time string into hours and minutes.
 * @param time - The time string to parse.
 * @returns An object containing `hours` and `minutes` as numbers.
 */
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
export const parseTime24 = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};
