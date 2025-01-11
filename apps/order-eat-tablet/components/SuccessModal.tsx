import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SuccessModal({ visible, onClose }: SuccessModalProps) {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (visible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    if (countdown === 0) {
      onClose();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible, countdown, onClose]);

  useEffect(() => {
    if (visible) {
      setCountdown(4);
    }
  }, [visible]);

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
            source={{ uri: "https://cdn.prod.website-files.com/6364b6fd26e298b11fb9391f/6364b6fd26e298312bb93c5a_63158fe13a6379546cdc4dcb_DrawKit0026_Cooking_%2526_Food_Banner.png" }}
            style={styles.illustration}
            resizeMode="contain"
          />
          <Text style={styles.title}>Your order has been received!</Text>
          <Text style={styles.description}>
            The chef will start prepping your order shortly! We'll serve you when the dishes are ready! Meanwhile feel free to add more to the shopping bag if you like!
          </Text>
          <TouchableOpacity style={styles.button} onPress={onClose}>
            <Text style={styles.buttonText}>Gotcha! ({countdown}s)</Text>
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

