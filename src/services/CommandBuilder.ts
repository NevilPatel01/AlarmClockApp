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
   */
  static buildWiFiCommand(ssid: string, password: string): string {
    return `${COMMANDS.WIFI}:${ssid}:${password}`;
  }

  /**
   * Build a time offset command.
   * Format: OFFSET:<value>
   * Example: OFFSET:-4 for UTC-4 (EST)
   * @param offset - UTC offset in hours
   * @returns Formatted time offset command string
   */
  static buildOffsetCommand(offset: number): string {
    return `${COMMANDS.OFFSET}:${offset}`;
  }

  /**
   * Build a Daylight Saving Time (DST) command.
   * Format: DST:ON or DST:OFF
   * @param enabled - True if DST is enabled, false otherwise
   * @returns Formatted DST command string
   */
  static buildDSTCommand(enabled: boolean): string {
    return `${COMMANDS.DST}:${enabled ? 'ON' : 'OFF'}`;
  }

  /**
   * Build an alarm time command.
   * Format: ALARM:<HH:MM>
   * Example: ALARM:14:30 for 2:30 PM
   * @param time - Alarm time in HH:MM 24-hour format
   * @returns Formatted alarm time command string
   */
  static buildAlarmTimeCommand(time: string): string {
    return `${COMMANDS.ALARM}:${time}`;
  }

  /**
   * Build an alarm enable/disable command.
   * Format: ALARM:ON or ALARM:OFF
   * @param enabled - True to enable alarm, false to disable
   * @returns Formatted alarm enable/disable command string
   */
  static buildAlarmEnableCommand(enabled: boolean): string {
    return `${COMMANDS.ALARM}:${enabled ? 'ON' : 'OFF'}`;
  }

  /**
   * Build a display brightness command.
   * Format: BRIGHTNESS:<0-7>
   * Example: BRIGHTNESS:5
   * @param brightness - Brightness level (0-7)
   * @returns Formatted brightness command string
   */
  static buildBrightnessCommand(brightness: number): string {
    return `${COMMANDS.BRIGHTNESS}:${brightness}`;
  }

  /**
   * Build all configuration commands from a ClockConfig object.
   * Commands are returned in the order: WiFi, time, DST, alarm, brightness.
   * @param config - ClockConfig object containing settings
   * @returns Array of formatted command strings
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
   * Validate a command string format.
   * Checks if the command type exists in the predefined COMMANDS.
   * @param command - Command string to validate
   * @returns True if the command is valid, false otherwise
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
