// Storage service for saving/loading configurations
// Uses AsyncStorage for persistent data storage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClockConfig, ConfigProfile, BluetoothDevice } from '../types';
import { STORAGE_KEYS, DEFAULT_CONFIG } from '../utils/constants';

export class StorageService {
  /**
   * Save current configuration
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
   * Load current configuration
   */
  static async loadConfig(): Promise<ClockConfig> {
    try {
      const configStr = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CONFIG);
      
      if (configStr) {
        return JSON.parse(configStr);
      }
      
      // Return default config if none exists
      return DEFAULT_CONFIG;
    } catch (error) {
      console.error('Error loading configuration:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Save a configuration profile with a custom name
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
   * Load all saved profiles
   */
  static async loadProfiles(): Promise<ConfigProfile[]> {
    try {
      const profilesStr = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PROFILES);
      
      if (profilesStr) {
        return JSON.parse(profilesStr);
      }
      
      return [];
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  }

  /**
   * Delete a profile by ID
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
   * Update an existing profile
   */
  static async updateProfile(profileId: string, name: string, config: ClockConfig): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
      const index = profiles.findIndex(p => p.id === profileId);
      
      if (index !== -1) {
        profiles[index] = {
          ...profiles[index],
          name,
          config,
        };
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(profiles));
        console.log(`Profile ${profileId} updated`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Save last connected device info
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
   * Load last connected device info
   */
  static async loadLastDevice(): Promise<BluetoothDevice | null> {
    try {
      const deviceStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DEVICE);
      
      if (deviceStr) {
        return JSON.parse(deviceStr);
      }
      
      return null;
    } catch (error) {
      console.error('Error loading last device:', error);
      return null;
    }
  }

  /**
   * Clear all stored data
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
   * Export all data as JSON string (for backup)
   */
  static async exportData(): Promise<string> {
    try {
      const config = await this.loadConfig();
      const profiles = await this.loadProfiles();
      const lastDevice = await this.loadLastDevice();
      
      const exportData = {
        config,
        profiles,
        lastDevice,
        exportedAt: new Date().toISOString(),
      };
      
      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
   * Import data from JSON string (for restore)
   */
  static async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
      
      if (data.config) {
        await this.saveConfig(data.config);
      }
      
      if (data.profiles && Array.isArray(data.profiles)) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(data.profiles));
      }
      
      if (data.lastDevice) {
        await this.saveLastDevice(data.lastDevice);
      }
      
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}
