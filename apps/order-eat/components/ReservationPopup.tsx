import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Platform, Pressable, ScrollView } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useCommandStore } from '@repo/store/src/commandStore';
import { useUserStore } from '@repo/store/src/userStore';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ReservationPopupProps {
  visible: boolean;
  onClose: () => void;
}

export const ReservationPopup: React.FC<ReservationPopupProps> = ({ visible, onClose }) => {
  const [date, setDate] = useState(new Date());
  const [numberOfPersons, setNumberOfPersons] = useState('1');
  const [reservationType, setReservationType] = useState<'takeaway' | 'dinein'>('dinein');
  const [wantToPreOrder, setWantToPreOrder] = useState(false);
  const [isCloseHovered, setIsCloseHovered] = useState(false);
  const { addCommand } = useCommandStore();
  const { user } = useUserStore();
  const { restaurants } = useRestaurantStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleSubmit = () => {
    if (!date || !numberOfPersons || !user || !id) {
      alert('Please fill in all fields');
      return;
    }

    const restaurant = restaurants.find(r => r.id === id);
    if (!restaurant) {
      alert('Restaurant not found');
      return;
    }

    const newCommand = {
      restaurant,
      userId: user.userId,
      reservationDetails: {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
        numberOfPersons: parseInt(numberOfPersons, 10),
        type: reservationType,
        wantToPreOrder: reservationType === 'dinein' ? wantToPreOrder : true,
      },
      menuItems: [],
      totalAmount: 0,
      status: 'pending' as const,
      type: reservationType,
    };

    addCommand(newCommand);
    onClose();

    // Navigate to menu selection if it's takeaway or if the user wants to pre-order
    if (reservationType === 'takeaway' || (reservationType === 'dinein' && wantToPreOrder)) {
      router.push(`/restaurant/${id}/menu-selection`);
    }
  };

  const renderDateTimePicker = () => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.webDateTime}>
          <Text style={styles.label}>Select Date and Time:</Text>
          <input
            type="datetime-local"
            onChange={(e) => setDate(new Date(e.target.value))}
            style={{
              fontSize: '16px',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              width: '100%',
              marginTop: 8,
            }}
          />
        </View>
      );
    } else if (Platform.OS === "android") {
      const showMode = (currentMode: 'date' | 'time') => {
        DateTimePickerAndroid.open({
          value: date,
          onChange,
          mode: currentMode,
          is24Hour: false,
        });
      };

      const showDatepicker = () => {
        showMode('date');
      };

      const showTimepicker = () => {
        showMode('time');
      };

      return (
        <View style={styles.androidDateTime}>
          <Pressable 
            onPress={showDatepicker}
            style={styles.dateTimeButton}
          >
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString([], {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              })}
            </Text>
          </Pressable>
          <Pressable 
            onPress={showTimepicker}
            style={styles.dateTimeButton}
          >
            <Text style={styles.dateTimeText}>
              {date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </Pressable>
        </View>
      );
    } else {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          onChange={onChange}
          style={styles.picker}
        />
      );
    }
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
            
            {renderDateTimePicker()}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Number of Persons:</Text>
              <TextInput
                style={styles.input}
                placeholder="Number of Persons"
                keyboardType="number-pad"
                value={numberOfPersons}
                onChangeText={setNumberOfPersons}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Reservation Type:</Text>
              <View style={styles.toggleContainer}>
                <TouchableOpacity 
                  style={[styles.toggleButton, reservationType === 'takeaway' && styles.toggleButtonActive]}
                  onPress={() => setReservationType('takeaway')}
                >
                  <Text style={[styles.toggleText, reservationType === 'takeaway' && styles.toggleTextActive]}>Take Away</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.toggleButton, reservationType === 'dinein' && styles.toggleButtonActive]}
                  onPress={() => setReservationType('dinein')}
                >
                  <Text style={[styles.toggleText, reservationType === 'dinein' && styles.toggleTextActive]}>Dine In</Text>
                </TouchableOpacity>
              </View>
            </View>

            {reservationType === 'dinein' && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Do you want to pre-order menu items?</Text>
                <View style={styles.toggleContainer}>
                  <TouchableOpacity 
                    style={[styles.toggleButton, wantToPreOrder && styles.toggleButtonActive]}
                    onPress={() => setWantToPreOrder(true)}
                  >
                    <Text style={[styles.toggleText, wantToPreOrder && styles.toggleTextActive]}>Yes</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.toggleButton, !wantToPreOrder && styles.toggleButtonActive]}
                    onPress={() => setWantToPreOrder(false)}
                  >
                    <Text style={[styles.toggleText, !wantToPreOrder && styles.toggleTextActive]}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={handleSubmit}
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1A1A1A',
  },
  webDateTime: {
    width: '100%',
    marginBottom: 20,
  },
  androidDateTime: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  dateTimeButton: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#1A1A1A',
    textAlign: 'center',
  },
  picker: {
    width: 320,
    height: 40,
    marginBottom: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#1A1A1A',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#FF8C00',
  },
  toggleText: {
    fontSize: 16,
    color: '#666',
  },
  toggleTextActive: {
    color: 'white',
    fontWeight: '500',
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
});

