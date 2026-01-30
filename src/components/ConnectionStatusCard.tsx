// Connection status indicator component

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';
import { ConnectionStatus } from '../types';

interface Props {
  status: ConnectionStatus;
  onDisconnect?: () => void;
}

const ConnectionStatusCard: React.FC<Props> = ({ status, onDisconnect }) => {
  const getStatusColor = () => {
    if (status.error) return '#B00020';
    return status.isConnected ? '#4CAF50' : '#757575';
  };

  const getStatusText = () => {
    if (status.error) return `Error: ${status.error}`;
    if (status.isConnected) return `Connected to ${status.deviceName}`;
    return 'Not connected';
  };

  const getStatusIcon = () => {
    if (status.error) return 'alert-circle';
    return status.isConnected ? 'bluetooth-connect' : 'bluetooth-off';
  };

  return (
    <Card style={[styles.card, { borderLeftColor: getStatusColor() }]}>
      <Card.Content style={styles.content}>
        <View style={styles.leftContent}>
          <IconButton
            icon={getStatusIcon()}
            iconColor={getStatusColor()}
            size={24}
          />
          <View style={styles.textContainer}>
            <Text variant="titleSmall" style={styles.statusText}>
              {getStatusText()}
            </Text>
            {status.isConnected && status.deviceAddress && (
              <Text variant="bodySmall" style={styles.addressText}>
                {status.deviceAddress}
              </Text>
            )}
          </View>
        </View>
        {status.isConnected && onDisconnect && (
          <IconButton
            icon="close"
            size={20}
            onPress={onDisconnect}
            style={styles.disconnectButton}
          />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
    backgroundColor: '#1E1E1E',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
  },
  statusText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  addressText: {
    color: '#B0B0B0',
    marginTop: 2,
  },
  disconnectButton: {
    margin: 0,
  },
});

export default ConnectionStatusCard;
