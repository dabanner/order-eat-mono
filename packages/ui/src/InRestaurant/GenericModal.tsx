import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface GenericModalProps {
  visible: boolean;
  onClose: () => void;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  autoCloseTime?: number;
  children?: React.ReactNode;
}

export function GenericModal({ 
  visible, 
  onClose, 
  image, 
  title, 
  description, 
  buttonText, 
  autoCloseTime = 0,
  children
}: GenericModalProps) {
  const [countdown, setCountdown] = useState(autoCloseTime);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible && autoCloseTime > 0 && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0 && autoCloseTime > 0) {
      onClose();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible, countdown, onClose, autoCloseTime]);

  useEffect(() => {
    if (visible) {
      setCountdown(autoCloseTime);
    }
  }, [visible, autoCloseTime]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Image
            source={{ uri: image }}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          {children}
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>
              {buttonText} {autoCloseTime > 0 && `(${countdown}s)`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  illustration: {
    width: '100%',
    height: 200,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#121223',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

