// Validation utilities

import { PATTERNS, ERROR_MESSAGES, MIN_TIME_OFFSET, MAX_TIME_OFFSET, MIN_BRIGHTNESS, MAX_BRIGHTNESS } from './constants';

export const validateTimeFormat = (time: string): { valid: boolean; error?: string } => {
  if (!time) {
    return { valid: false, error: 'Time is required' };
  }
  
  if (!PATTERNS.TIME_24H.test(time)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_TIME_FORMAT };
  }
  
  return { valid: true };
};

export const validateWiFiSSID = (ssid: string): { valid: boolean; error?: string } => {
  if (!ssid) {
    return { valid: false, error: 'WiFi SSID is required' };
  }
  
  if (!PATTERNS.WIFI_SSID.test(ssid)) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_WIFI_SSID };
  }
  
  return { valid: true };
};

export const validateWiFiPassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'WiFi password is required' };
  }
  
  if (password.length < 8) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_WIFI_PASSWORD };
  }
  
  return { valid: true };
};

export const validateTimeOffset = (offset: number): { valid: boolean; error?: string } => {
  if (offset < MIN_TIME_OFFSET || offset > MAX_TIME_OFFSET) {
    return { valid: false, error: `Time offset must be between ${MIN_TIME_OFFSET} and ${MAX_TIME_OFFSET}` };
  }
  
  return { valid: true };
};

export const validateBrightness = (brightness: number): { valid: boolean; error?: string } => {
  if (brightness < MIN_BRIGHTNESS || brightness > MAX_BRIGHTNESS) {
    return { valid: false, error: `Brightness must be between ${MIN_BRIGHTNESS} and ${MAX_BRIGHTNESS}` };
  }
  
  return { valid: true };
};

export const formatTime24 = (hours: number, minutes: number): string => {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
};

export const parseTime24 = (time: string): { hours: number; minutes: number } => {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
};
