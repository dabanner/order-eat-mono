import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WaitstaffRequest } from '@repo/store/src/commandStore';

interface WaitstaffModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: (type: WaitstaffRequest['type']) => void;
}

export const WaitstaffModal: React.FC<WaitstaffModalProps> = ({ visible, onClose, onAction }) => (
  <Modal
    visible={visible}
    transparent={true}
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>How can we help?</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.checkoutButton]}
            onPress={() => {
              onAction('checkout');
              onClose();
            }}
          >
            <MaterialIcons name="payment" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Checkout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.waterButton]}
            onPress={() => {
              onAction('water');
              onClose();
            }}
          >
            <MaterialCommunityIcons name="water" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Add Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.otherButton]}
            onPress={() => {
              onAction('other');
              onClose();
            }}
          >
            <MaterialIcons name="more-horiz" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Others</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
        >
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    gap: 16,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
  },
  waterButton: {
    backgroundColor: '#2196F3',
  },
  otherButton: {
    backgroundColor: '#FF9800',
  },
  closeButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  closeButtonText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
});

