<<<<<<< HEAD
// Storage service for saving/loading configurations
// Uses AsyncStorage for persistent data storage

=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClockConfig, ConfigProfile, BluetoothDevice } from '../types';
import { STORAGE_KEYS, DEFAULT_CONFIG } from '../utils/constants';

<<<<<<< HEAD
export class StorageService {
  /**
   * Save current configuration
=======
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
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Load current configuration
=======
   * Load the current clock configuration.
   * @returns The saved ClockConfig or DEFAULT_CONFIG if none exists.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async loadConfig(): Promise<ClockConfig> {
    try {
      const configStr = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_CONFIG);
<<<<<<< HEAD
      
      if (configStr) {
        return JSON.parse(configStr);
      }
      
      // Return default config if none exists
      return DEFAULT_CONFIG;
=======
      return configStr ? JSON.parse(configStr) : DEFAULT_CONFIG;
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    } catch (error) {
      console.error('Error loading configuration:', error);
      return DEFAULT_CONFIG;
    }
  }

  /**
<<<<<<< HEAD
   * Save a configuration profile with a custom name
=======
   * Save a configuration profile with a custom name.
   * @param name - Name for the profile.
   * @param config - The ClockConfig to save in the profile.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async saveProfile(name: string, config: ClockConfig): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
<<<<<<< HEAD
      
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      const newProfile: ConfigProfile = {
        id: Date.now().toString(),
        name,
        config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
<<<<<<< HEAD
      
=======
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      profiles.push(newProfile);
      await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(profiles));
      console.log(`Profile "${name}" saved`);
    } catch (error) {
      console.error('Error saving profile:', error);
      throw error;
    }
  }

  /**
<<<<<<< HEAD
   * Load all saved profiles
=======
   * Load all saved configuration profiles.
   * @returns An array of ConfigProfile objects.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async loadProfiles(): Promise<ConfigProfile[]> {
    try {
      const profilesStr = await AsyncStorage.getItem(STORAGE_KEYS.SAVED_PROFILES);
<<<<<<< HEAD
      
      if (profilesStr) {
        return JSON.parse(profilesStr);
      }
      
      return [];
=======
      return profilesStr ? JSON.parse(profilesStr) : [];
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    } catch (error) {
      console.error('Error loading profiles:', error);
      return [];
    }
  }

  /**
<<<<<<< HEAD
   * Delete a profile by ID
=======
   * Delete a profile by its ID.
   * @param profileId - The ID of the profile to delete.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Update an existing profile
=======
   * Update an existing profile by ID.
   * @param profileId - The ID of the profile to update.
   * @param name - New name for the profile.
   * @param config - Updated ClockConfig object.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async updateProfile(profileId: string, name: string, config: ClockConfig): Promise<void> {
    try {
      const profiles = await this.loadProfiles();
      const index = profiles.findIndex(p => p.id === profileId);
<<<<<<< HEAD
      
      if (index !== -1) {
        profiles[index] = {
          ...profiles[index],
          name,
          config,
        };
=======
      if (index !== -1) {
        profiles[index] = { ...profiles[index], name, config };
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(profiles));
        console.log(`Profile ${profileId} updated`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
<<<<<<< HEAD
   * Save last connected device info
=======
   * Save the last connected Bluetooth device.
   * @param device - The BluetoothDevice object to save.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Load last connected device info
=======
   * Load the last connected Bluetooth device.
   * @returns The last BluetoothDevice or null if none exists.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async loadLastDevice(): Promise<BluetoothDevice | null> {
    try {
      const deviceStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_DEVICE);
<<<<<<< HEAD
      
      if (deviceStr) {
        return JSON.parse(deviceStr);
      }
      
      return null;
=======
      return deviceStr ? JSON.parse(deviceStr) : null;
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    } catch (error) {
      console.error('Error loading last device:', error);
      return null;
    }
  }

  /**
<<<<<<< HEAD
   * Clear all stored data
=======
   * Clear all stored data including configuration, profiles, and last device.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
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
<<<<<<< HEAD
   * Export all data as JSON string (for backup)
=======
   * Export all stored data as a JSON string for backup purposes.
   * @returns A formatted JSON string containing all stored data.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async exportData(): Promise<string> {
    try {
      const config = await this.loadConfig();
      const profiles = await this.loadProfiles();
      const lastDevice = await this.loadLastDevice();
<<<<<<< HEAD
      
      const exportData = {
        config,
        profiles,
        lastDevice,
        exportedAt: new Date().toISOString(),
      };
      
      return JSON.stringify(exportData, null, 2);
=======
      return JSON.stringify(
        { config, profiles, lastDevice, exportedAt: new Date().toISOString() },
        null,
        2
      );
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }

  /**
<<<<<<< HEAD
   * Import data from JSON string (for restore)
=======
   * Import data from a JSON string and restore stored values.
   * @param jsonString - JSON string containing config, profiles, and last device.
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
   */
  static async importData(jsonString: string): Promise<void> {
    try {
      const data = JSON.parse(jsonString);
<<<<<<< HEAD
      
      if (data.config) {
        await this.saveConfig(data.config);
      }
      
      if (data.profiles && Array.isArray(data.profiles)) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(data.profiles));
      }
      
      if (data.lastDevice) {
        await this.saveLastDevice(data.lastDevice);
      }
      
=======
      if (data.config) await this.saveConfig(data.config);
      if (data.profiles && Array.isArray(data.profiles)) {
        await AsyncStorage.setItem(STORAGE_KEYS.SAVED_PROFILES, JSON.stringify(data.profiles));
      }
      if (data.lastDevice) await this.saveLastDevice(data.lastDevice);
>>>>>>> dad1af36a7b4e25035f1faa06181d253a64e5244
      console.log('Data imported successfully');
    } catch (error) {
      console.error('Error importing data:', error);
      throw error;
    }
  }
}
