import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  TextInput,
  IconButton,
  Portal,
  Dialog,
  useTheme,
} from 'react-native-paper';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList, ConfigProfile, ClockConfig} from '../types';
import {StorageService} from '../services/StorageService';
import {BluetoothService} from '../services/BluetoothService';
import ConnectionStatusCard from '../components/ConnectionStatusCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Profiles'>;

const ProfilesScreen: React.FC<Props> = () => {
  const theme = useTheme();
  const [profiles, setProfiles] = useState<ConfigProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [profileName, setProfileName] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<ConfigProfile | null>(
    null,
  );
  const connectionStatus = BluetoothService.getConnectionStatus();

  const loadProfiles = useCallback(async () => {
    try {
      setIsLoading(true);
      const loadedProfiles = await StorageService.loadProfiles();
      setProfiles(loadedProfiles);
    } catch (err) {
      console.error('Failed to load profiles:', err);
      Alert.alert('Error', 'Failed to load profiles');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfiles();
    setRefreshing(false);
  }, [loadProfiles]);

  const handleSaveCurrentConfig = () => {
    setProfileName('');
    setShowSaveDialog(true);
  };

  const saveProfile = async () => {
    if (!profileName.trim()) {
      Alert.alert('Error', 'Please enter a profile name');
      return;
    }

    try {
      const currentConfig = await StorageService.loadConfig();
      await StorageService.saveProfile(profileName.trim(), currentConfig);
      setShowSaveDialog(false);
      await loadProfiles();
      Alert.alert('Success', `Profile "${profileName}" saved successfully`);
    } catch (err) {
      console.error('Failed to save profile:', err);
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  const handleLoadProfile = (profile: ConfigProfile) => {
    setSelectedProfile(profile);
    setShowLoadDialog(true);
  };

  const loadProfile = async () => {
    if (!selectedProfile) return;

    try {
      await StorageService.saveConfig(selectedProfile.config);
      setShowLoadDialog(false);
      Alert.alert(
        'Success',
        `Profile "${selectedProfile.name}" loaded. You can now send it to ESP32 from other screens.`,
      );
    } catch (err) {
      console.error('Failed to load profile:', err);
      Alert.alert('Error', 'Failed to load profile');
    }
  };

  const handleDeleteProfile = (profile: ConfigProfile) => {
    Alert.alert(
      'Delete Profile',
      `Are you sure you want to delete "${profile.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.deleteProfile(profile.id);
              await loadProfiles();
              Alert.alert('Success', 'Profile deleted');
            } catch (err) {
              console.error('Failed to delete profile:', err);
              Alert.alert('Error', 'Failed to delete profile');
            }
          },
        },
      ],
    );
  };

  const handleApplyProfile = async (profile: ConfigProfile) => {
    if (!connectionStatus.isConnected) {
      Alert.alert(
        'Not Connected',
        'Please connect to ESP32 first from the Home screen',
      );
      return;
    }

    Alert.alert(
      'Apply Profile',
      `Send all settings from "${profile.name}" to ESP32?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Apply',
          onPress: async () => {
            try {
              setIsLoading(true);
              // Send all configuration commands
              const commands = [
                `WIFI:${profile.config.wifiSSID}:${profile.config.wifiPassword}`,
                `OFFSET:${profile.config.timeOffset}`,
                `DST:${profile.config.dstEnabled ? 'ON' : 'OFF'}`,
                `ALARM:${profile.config.alarmTime}`,
                `ALARM:${profile.config.alarmEnabled ? 'ON' : 'OFF'}`,
                `BRIGHTNESS:${profile.config.brightness}`,
              ];
              await BluetoothService.sendCommands(commands);
              await StorageService.saveConfig(profile.config);
              Alert.alert(
                'Success',
                `Profile "${profile.name}" applied to ESP32`,
              );
            } catch (err) {
              console.error('Failed to apply profile:', err);
              Alert.alert('Error', 'Failed to apply profile to ESP32');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const formatConfigSummary = (config: ClockConfig): string => {
    const parts = [];
    if (config.wifiSSID) parts.push(`WiFi: ${config.wifiSSID}`);
    parts.push(`Offset: UTC${config.timeOffset >= 0 ? '+' : ''}${config.timeOffset}`);
    parts.push(`DST: ${config.dstEnabled ? 'ON' : 'OFF'}`);
    if (config.alarmTime) {
      parts.push(
        `Alarm: ${config.alarmTime} (${config.alarmEnabled ? 'ON' : 'OFF'})`,
      );
    }
    parts.push(`Brightness: ${config.brightness}`);
    return parts.join(' • ');
  };

  const renderCardActions = (profile: ConfigProfile) => (
    <View style={styles.actions}>
      <IconButton
        icon="delete"
        onPress={() => handleDeleteProfile(profile)}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <ConnectionStatusCard
          status={connectionStatus}
          onDisconnect={() => BluetoothService.disconnect()}
        />

        <Card style={styles.card}>
          <Card.Title title="Configuration Profiles" />
          <Card.Content>
            <Text variant="bodyMedium" style={styles.description}>
              Save and manage different configurations for your alarm clock.
            </Text>
            <Button
              mode="contained"
              onPress={handleSaveCurrentConfig}
              style={styles.button}
              icon="content-save">
              Save Current Config as Profile
            </Button>
          </Card.Content>
        </Card>

        {profiles.length === 0 ? (
          <Card style={styles.card}>
            <Card.Content>
              <Text
                variant="bodyMedium"
                style={[styles.emptyText, {color: theme.colors.onSurfaceVariant}]}>
                No profiles saved yet. Configure your alarm clock settings and
                save them as a profile.
              </Text>
            </Card.Content>
          </Card>
        ) : (
          profiles.map(profile => (
            <Card key={profile.id} style={styles.card}>
              <Card.Title
                title={profile.name}
                subtitle={`Last updated: ${new Date(profile.updatedAt).toLocaleDateString()}`}
                right={() => renderCardActions(profile)}
              />
              <Card.Content>
                <Text
                  variant="bodySmall"
                  style={{color: theme.colors.onSurfaceVariant}}>
                  {formatConfigSummary(profile.config)}
                </Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={() => handleLoadProfile(profile)}>
                  Load
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleApplyProfile(profile)}
                  disabled={!connectionStatus.isConnected}>
                  Apply to ESP32
                </Button>
              </Card.Actions>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Save Profile Dialog */}
      <Portal>
        <Dialog visible={showSaveDialog} onDismiss={() => setShowSaveDialog(false)}>
          <Dialog.Title>Save Profile</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Profile Name"
              value={profileName}
              onChangeText={setProfileName}
              mode="outlined"
              placeholder="e.g., Weekend Settings"
              autoFocus
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSaveDialog(false)}>Cancel</Button>
            <Button onPress={saveProfile}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Load Profile Dialog */}
      <Portal>
        <Dialog visible={showLoadDialog} onDismiss={() => setShowLoadDialog(false)}>
          <Dialog.Title>Load Profile</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              Load "{selectedProfile?.name}"? This will replace your current
              configuration.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowLoadDialog(false)}>Cancel</Button>
            <Button onPress={loadProfile}>Load</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  card: {
    margin: 16,
    marginBottom: 8,
  },
  description: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 24,
  },
  actions: {
    flexDirection: 'row',
  },
});

export default ProfilesScreen;
