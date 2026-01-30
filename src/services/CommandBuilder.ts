<<<<<<< HEAD
// Command builder for ESP32 communication
// Builds command strings according to the protocol defined in requirements

import { ClockConfig } from '../types';
import { COMMANDS } from '../utils/constants';

export class CommandBuilder {
  /**
   * Build WiFi configuration command
   * Format: WIFI:<SSID>:<PASSWORD>
=======
import { ClockConfig } from '../types';
import { COMMANDS } from '../utils/constants';

/**
 * The utility class for building and validating commands to configure the smart clock via Bluetooth or other interfaces.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
export class CommandBuilder {
  /**
   * Build a WiFi configuration command.
   * Format: WIFI:<SSID>:<PASSWORD>
   * @param ssid - WiFi network SSID
   * @param password - WiFi network password
   * @returns Formatted WiFi command string
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildWiFiCommand(ssid: string, password: string): string {
    return `${COMMANDS.WIFI}:${ssid}:${password}`;
  }

  /**
<<<<<<< HEAD
   * Build time offset command
   * Format: OFFSET:<value>
   * Example: OFFSET:-4 for UTC-4 (EST)
=======
   * Build a time offset command.
   * Format: OFFSET:<value>
   * Example: OFFSET:-4 for UTC-4 (EST)
   * @param offset - UTC offset in hours
   * @returns Formatted time offset command string
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildOffsetCommand(offset: number): string {
    return `${COMMANDS.OFFSET}:${offset}`;
  }

  /**
<<<<<<< HEAD
   * Build DST command
   * Format: DST:ON or DST:OFF
=======
   * Build a Daylight Saving Time (DST) command.
   * Format: DST:ON or DST:OFF
   * @param enabled - True if DST is enabled, false otherwise
   * @returns Formatted DST command string
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildDSTCommand(enabled: boolean): string {
    return `${COMMANDS.DST}:${enabled ? 'ON' : 'OFF'}`;
  }

  /**
<<<<<<< HEAD
   * Build alarm time command
   * Format: ALARM:<HH:MM>
   * Example: ALARM:14:30 for 2:30 PM
=======
   * Build an alarm time command.
   * Format: ALARM:<HH:MM>
   * Example: ALARM:14:30 for 2:30 PM
   * @param time - Alarm time in HH:MM 24-hour format
   * @returns Formatted alarm time command string
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildAlarmTimeCommand(time: string): string {
    return `${COMMANDS.ALARM}:${time}`;
  }

  /**
<<<<<<< HEAD
   * Build alarm enable/disable command
   * Format: ALARM:ON or ALARM:OFF
=======
   * Build an alarm enable/disable command.
   * Format: ALARM:ON or ALARM:OFF
   * @param enabled - True to enable alarm, false to disable
   * @returns Formatted alarm enable/disable command string
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildAlarmEnableCommand(enabled: boolean): string {
    return `${COMMANDS.ALARM}:${enabled ? 'ON' : 'OFF'}`;
  }

  /**
<<<<<<< HEAD
   * Build brightness command
   * Format: BRIGHTNESS:<0-7>
   * Example: BRIGHTNESS:5
=======
   * Build a display brightness command.
   * Format: BRIGHTNESS:<0-7>
   * Example: BRIGHTNESS:5
   * @param brightness - Brightness level (0-7)
   * @returns Formatted brightness command string
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildBrightnessCommand(brightness: number): string {
    return `${COMMANDS.BRIGHTNESS}:${brightness}`;
  }

  /**
<<<<<<< HEAD
   * Build all configuration commands from a ClockConfig object
   * Returns an array of commands to be sent sequentially
=======
   * Build all configuration commands from a ClockConfig object.
   * Commands are returned in the order: WiFi, time, DST, alarm, brightness.
   * @param config - ClockConfig object containing settings
   * @returns Array of formatted command strings
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static buildAllConfigCommands(config: ClockConfig): string[] {
    const commands: string[] = [];

    // WiFi configuration (only if both SSID and password are provided)
    if (config.wifiSSID && config.wifiPassword) {
      commands.push(this.buildWiFiCommand(config.wifiSSID, config.wifiPassword));
    }

    // Time settings
    commands.push(this.buildOffsetCommand(config.timeOffset));
    commands.push(this.buildDSTCommand(config.dstEnabled));

    // Alarm settings
    commands.push(this.buildAlarmTimeCommand(config.alarmTime));
    commands.push(this.buildAlarmEnableCommand(config.alarmEnabled));

    // Display settings
    commands.push(this.buildBrightnessCommand(config.brightness));

    return commands;
  }

  /**
<<<<<<< HEAD
   * Parse a command to verify it's correctly formatted
   * Returns true if the command is valid
=======
   * Validate a command string format.
   * Checks if the command type exists in the predefined COMMANDS.
   * @param command - Command string to validate
   * @returns True if the command is valid, false otherwise
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static validateCommand(command: string): boolean {
    if (!command || typeof command !== 'string') {
      return false;
    }

    const parts = command.split(':');
    if (parts.length < 2) {
      return false;
    }

    const commandType = parts[0];
    const validCommands = Object.values(COMMANDS);
    
    return validCommands.includes(commandType);
  }
}
