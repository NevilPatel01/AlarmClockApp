import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClockConfig, ConfigProfile, BluetoothDevice } from '../types';
import { STORAGE_KEYS, DEFAULT_CONFIG } from '../utils/constants';

/**
 * Service for managing persistent storage of clock configurations, profiles, and Bluetooth devices using AsyncStorage.
 * 
 * @authors Nevil Patel(000892482) and Jaskirat Kaur(000904397)
 * We certify that this material is our original work.
 * No other person's work has been used without suitable acknowledgment and we have not made my work available to anyone else.
 */
export class StorageService {
  /**
   * Save the current clock configuration.
   * @param config - The ClockConfig object to save.
   */
  static async saveConfig(config: ClockConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_CONFIG, JSON.stringify(config));
      console.log('Configuration saved');
    } catch (error) {
      console.error('Error saving configuration:', error);
      throw error;
    }
  }

  /**
   * Load the current clock configuration.
   * @returns The saved ClockConfig or DEFAULT_CONFIG if none exists.
   */
  static async loadConfig(): Promise<ClockConfig> {
    try {
      const configStr = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CONFIG);
      return configStr ? JSON.parse(configStr) : DEFAULT_CONFIG;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Save a configuration profile with a custom name.
   * @param name - Name for the profile.
   * @param config - The ClockConfig to save in the profile.
   */
  static async saveProfile(name: string, config: ClockConfig): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
      const newProfile: ConfigProfile = {
        id: Date.now().toString(),
        name,
        config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      profiles.push(newProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(profiles));
      console.log(`Profile "${name}" saved`);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  /**
   * Load all saved configuration profiles.
   * @returns An array of ConfigProfile objects.
   */
  static async loadProfiles(): Promise<ConfigProfile[]> {
    try {
      const profilesStr = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PROFILES);
      return profilesStr ? JSON.parse(profilesStr) : [];
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  }

  /**
   * Delete a profile by its ID.
   * @param profileId - The ID of the profile to delete.
   */
  static async deleteProfile(profileId: string): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
      const updatedProfiles = profiles.filter(p => p.id !== profileId);
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(updatedProfiles));
      console.log(`Profile ${profileId} deleted`);
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  /**
   * Update an existing profile by ID.
   * @param profileId - The ID of the profile to update.
   * @param name - New name for the profile.
   * @param config - Updated ClockConfig object.
   */
  static async updateProfile(profileId: string, name: string, config: ClockConfig): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
      const index = profiles.findIndex(p => p.id === profileId);
      if (index !== -1) {
        profiles[index] = { ...profiles[index], name, config };
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(profiles));
        console.log(`Profile ${profileId} updated`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Save the last connected Bluetooth device.
   * @param device - The BluetoothDevice object to save.
   */
  static async saveLastDevice(device: BluetoothDevice): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_DEVICE, JSON.stringify(device));
      console.log('Last device saved');
    } catch (error) {
      console.error('Error saving last device:', error);
    }
  }

  /**
   * Load the last connected Bluetooth device.
   * @returns The last BluetoothDevice or null if none exists.
   */
  static async loadLastDevice(): Promise<BluetoothDevice | null> {
    try {
      const deviceStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DEVICE);
      return deviceStr ? JSON.parse(deviceStr) : null;
    } catch (error) {
      console.error('Error loading last device:', error);
      return null;
    }
  }

  /**
   * Clear all stored data including configuration, profiles, and last device.
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.CURRENT_CONFIG,
        STORAGE_KEYS.SAVED_PROFILES,
        STORAGE_KEYS.LAST_DEVICE,
      ]);
      console.log('All storage cleared');
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  }

  /**
   * Export all stored data as a JSON string for backup purposes.
   * @returns A formatted JSON string containing all stored data.
   */
  static async exportData(): Promise<string> {
    try {
      const config = await this.loadConfig();
      const profiles = await this.loadProfiles();
      const lastDevice = await this.loadLastDevice();
      return JSON.stringify(
        { config, profiles, lastDevice, exportedAt: new Date().toISOString() },
        null,
        2
      );
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Import data from a JSON string and restore stored values.
   * @param jsonString - JSON string containing config, profiles, and last device.
   */
  static async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      if (data.config) await this.saveConfig(data.config);
      if (data.profiles && Array.isArray(data.profiles)) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(data.profiles));
      }
      if (data.lastDevice) await this.saveLastDevice(data.lastDevice);
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}
