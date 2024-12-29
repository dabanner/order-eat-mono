import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Platform, Pressable } from 'react-native';
import { Command, useCommandStore } from '@repo/store/src/commandStore';
import { useUserStore } from '@repo/store/src/userStore';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ReservationForm } from './ReservationForm';

interface ReservationPopupProps {
  visible: boolean;
  onClose: () => void;
}

export const ReservationPopup: React.FC<ReservationPopupProps> = ({ visible, onClose }) => {
  const [isCloseHovered, setIsCloseHovered] = React.useState(false);
  const { addCommand } = useCommandStore();
  const { user } = useUserStore();
  const { restaurants } = useRestaurantStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const handleSubmit = (details: Partial<Command['reservationDetails']>) => {
    if (!user || !id) {
      alert('User or restaurant not found');
      return;
    }

    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) {
      alert('Restaurant not found');
      return;
    }

    // Create new pending command
    const newCommand = {
      restaurant,
      userId: user.userId,
      reservationDetails: details,
      menuItems: [],
      totalAmount: 0,
      status: 'pending' as const,
      type: details.type || 'dinein',
    };

    const commandId = addCommand(newCommand);
    onClose();

    // Navigate to the new reservation page
    router.push(`/restaurant/${id}/reservation/${commandId}`);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable 
            style={[
              styles.closeButton, 
              isCloseHovered && styles.closeButtonHovered
            ]} 
            onPress={onClose}
            onHoverIn={() => setIsCloseHovered(true)}
            onHoverOut={() => setIsCloseHovered(false)}
          >
            <Ionicons name="close" size={32} color="#ef4444" />
          </Pressable>
          <Text style={styles.modalTitle}>Make a Reservation</Text>
          
          <ReservationForm
            initialDetails={{}}
            onUpdate={handleSubmit}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => handleSubmit({})}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonHovered: {
    backgroundColor: '#fecaca',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    backgroundColor: '#FF8C00',
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

