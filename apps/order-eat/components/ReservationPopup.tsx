import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, TextInput, Platform, Pressable } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

interface ReservationPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (details: { date: string; time: string; numberOfPersons: number }) => void;
}

export const ReservationPopup: React.FC<ReservationPopupProps> = ({ visible, onClose, onSubmit }) => {
  const [date, setDate] = useState(new Date());
  const [numberOfPersons, setNumberOfPersons] = useState('1');

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const handleSubmit = () => {
    if (!date || !numberOfPersons) {
      alert('Please fill in all fields');
      return;
    }

    onSubmit({
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      numberOfPersons: parseInt(numberOfPersons, 10),
    });
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

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.buttonCancel]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.buttonSubmit]} 
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    borderRadius: 8,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonCancel: {
    backgroundColor: '#E5E7EB',
  },
  buttonSubmit: {
    backgroundColor: '#FF8C00',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
});

