import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { ReservationDetails } from '@repo/store/src/commandStore';

interface ReservationFormProps {
  initialDetails: Partial<ReservationDetails>;
  onUpdate: (details: Partial<ReservationDetails>) => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ initialDetails, onUpdate }) => {
  const [date, setDate] = useState(() => {
    const initialDate = new Date(initialDetails.date || Date.now());
    return isNaN(initialDate.getTime()) ? new Date() : initialDate;
  });
  const [numberOfPersons, setNumberOfPersons] = useState(initialDetails.numberOfPersons?.toString() || '1');
  const [reservationType, setReservationType] = useState<'takeaway' | 'dinein'>(initialDetails.type || 'dinein');
  const [wantToPreOrder, setWantToPreOrder] = useState(initialDetails.wantToPreOrder || false);

  const onChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    onUpdate({
      date: currentDate.toLocaleDateString(),
      time: currentDate.toLocaleTimeString(),
    });
  };

  const handleNumberOfPersonsChange = (value: string) => {
    setNumberOfPersons(value);
    onUpdate({ numberOfPersons: parseInt(value, 10) });
  };

  const handleReservationTypeChange = (type: 'takeaway' | 'dinein') => {
    setReservationType(type);
    onUpdate({ type });
  };

  const handleWantToPreOrderChange = (value: boolean) => {
    setWantToPreOrder(value);
    onUpdate({ wantToPreOrder: value });
  };

  const renderDateTimePicker = () => {
    if (Platform.OS === "web") {
      return (
        <View style={styles.webDateTime}>
          <Text style={styles.label}>Select Date and Time:</Text>
          <input
            type="datetime-local"
            value={date instanceof Date && !isNaN(date.getTime()) 
              ? date.toISOString().slice(0, 16) 
              : ''}
            onChange={(e) => onChange(null, new Date(e.target.value))}
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

      return (
        <View style={styles.androidDateTime}>
          <TouchableOpacity onPress={() => showMode('date')} style={styles.dateTimeButton}>
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString([], {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => showMode('time')} style={styles.dateTimeButton}>
            <Text style={styles.dateTimeText}>
              {date.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </TouchableOpacity>
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
    <View style={styles.container}>
      {renderDateTimePicker()}

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Number of Persons:</Text>
        <TextInput
          style={styles.input}
          placeholder="Number of Persons"
          keyboardType="number-pad"
          value={numberOfPersons}
          onChangeText={handleNumberOfPersonsChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Reservation Type:</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity 
            style={[styles.toggleButton, reservationType === 'takeaway' && styles.toggleButtonActive]}
            onPress={() => handleReservationTypeChange('takeaway')}
          >
            <Text style={[styles.toggleText, reservationType === 'takeaway' && styles.toggleTextActive]}>Take Away</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.toggleButton, reservationType === 'dinein' && styles.toggleButtonActive]}
            onPress={() => handleReservationTypeChange('dinein')}
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
              onPress={() => handleWantToPreOrderChange(true)}
            >
              <Text style={[styles.toggleText, wantToPreOrder && styles.toggleTextActive]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleButton, !wantToPreOrder && styles.toggleButtonActive]}
              onPress={() => handleWantToPreOrderChange(false)}
            >
              <Text style={[styles.toggleText, !wantToPreOrder && styles.toggleTextActive]}>No</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
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
});

