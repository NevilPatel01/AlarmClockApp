// Command builder for ESP32 communication
// Builds command strings according to the protocol defined in requirements

import { ClockConfig } from '../types';
import { COMMANDS } from '../utils/constants';

export class CommandBuilder {
  /**
   * Build WiFi configuration command
   * Format: WIFI:<SSID>:<PASSWORD>
   */
  static buildWiFiCommand(ssid: string, password: string): string {
    return `${COMMANDS.WIFI}:${ssid}:${password}`;
  }

  /**
   * Build time offset command
   * Format: OFFSET:<value>
   * Example: OFFSET:-4 for UTC-4 (EST)
   */
  static buildOffsetCommand(offset: number): string {
    return `${COMMANDS.OFFSET}:${offset}`;
  }

  /**
   * Build DST command
   * Format: DST:ON or DST:OFF
   */
  static buildDSTCommand(enabled: boolean): string {
    return `${COMMANDS.DST}:${enabled ? 'ON' : 'OFF'}`;
  }

  /**
   * Build alarm time command
   * Format: ALARM:<HH:MM>
   * Example: ALARM:14:30 for 2:30 PM
   */
  static buildAlarmTimeCommand(time: string): string {
    return `${COMMANDS.ALARM}:${time}`;
  }

  /**
   * Build alarm enable/disable command
   * Format: ALARM:ON or ALARM:OFF
   */
  static buildAlarmEnableCommand(enabled: boolean): string {
    return `${COMMANDS.ALARM}:${enabled ? 'ON' : 'OFF'}`;
  }

  /**
   * Build brightness command
   * Format: BRIGHTNESS:<0-7>
   * Example: BRIGHTNESS:5
   */
  static buildBrightnessCommand(brightness: number): string {
    return `${COMMANDS.BRIGHTNESS}:${brightness}`;
  }

  /**
   * Build all configuration commands from a ClockConfig object
   * Returns an array of commands to be sent sequentially
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
   * Parse a command to verify it's correctly formatted
   * Returns true if the command is valid
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
