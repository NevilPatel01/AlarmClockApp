// Global loading overlay component
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal, Modal, ActivityIndicator, Text } from 'react-native-paper';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ visible, message = 'Loading...' }) => {
  return (
    <Portal>
      <Modal visible={visible} dismissable={false} contentContainerStyle={styles.modal}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#64B5F6" />
          <Text variant="bodyLarge" style={styles.message}>
            {message}
          </Text>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
    elevation: 8,
  },
  message: {
    marginTop: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default LoadingOverlay;
