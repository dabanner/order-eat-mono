import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { WaitstaffRequest } from '@repo/store/src/commandStore';
import { GenericModal } from './GenericModal';

interface WaitstaffModalProps {
  visible: boolean;
  onClose: () => void;
  onAction: (type: WaitstaffRequest['type']) => void;
}

export const WaitstaffModal: React.FC<WaitstaffModalProps> = ({ visible, onClose, onAction }) => {
  const [selectedAction, setSelectedAction] = React.useState<WaitstaffRequest['type'] | null>(null);

  const handleAction = (type: WaitstaffRequest['type']) => {
    setSelectedAction(type);
    onAction(type);
  };

  const getModalContent = () => {
    switch (selectedAction) {
      case 'checkout':
        return {
          image: 'https://unblast.com/wp-content/uploads/2021/07/Checkout-Process-Illustration.jpg',
          title: 'Checkout Requested',
          description: 'A staff member will be with you shortly to process your payment.',
        };
      case 'water':
        return {
          image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQcHyPmtwrBuDxuVR6Qhc4e0fAXtm23N-3ug&s',
          title: 'Water is on the way!',
          description: 'A staff member will bring you water shortly.',
        };
      case 'other':
        return {
          image: 'https://media.istockphoto.com/id/1440553933/fr/vectoriel/illustration-vectorielle-de-beaux-serveurs-sc%C3%A8ne-de-dessin-anim%C3%A9-avec-des-serveurs-hommes.jpg?s=612x612&w=0&k=20&c=koAeVczxGXzcH4WvQJPWOy0i1D7XgVrdimcRD2YQ1JM=',
          title: 'Help is on the way!',
          description: 'A staff member will be with you shortly to assist you.',
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <GenericModal
        visible={visible && !selectedAction}
        onClose={onClose}
        image="https://img.freepik.com/free-vector/waiters-concept-illustration_114360-2782.jpg"
        title="How can we help?"
        description="Select an option below"
        buttonText="Close"
      >
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.checkoutButton]}
            onPress={() => handleAction('checkout')}
          >
            <MaterialIcons name="payment" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Checkout</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.waterButton]}
            onPress={() => handleAction('water')}
          >
            <MaterialCommunityIcons name="water" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Add Water</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.modalButton, styles.otherButton]}
            onPress={() => handleAction('other')}
          >
            <MaterialIcons name="more-horiz" size={24} color="#fff" />
            <Text style={styles.modalButtonText}>Others</Text>
          </TouchableOpacity>
        </View>
      </GenericModal>
      
      {modalContent && (
        <GenericModal
          visible={!!selectedAction}
          onClose={() => {
            setSelectedAction(null);
            onClose();
          }}
          image={modalContent.image}
          title={modalContent.title}
          description={modalContent.description}
          buttonText="Gotcha!"
          autoCloseTime={4}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalButtons: {
    gap: 16,
    paddingBottom: 16,
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
});

