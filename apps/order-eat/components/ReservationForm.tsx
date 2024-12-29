import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ReservationDetails } from '@repo/store/src/commandStore';

interface ReservationFormProps {
  initialDetails: ReservationDetails;
  onUpdate: (details: Partial<ReservationDetails>) => void;
}

export const ReservationForm: React.FC<ReservationFormProps> = ({ initialDetails, onUpdate }) => {
  const [date, setDate] = useState(() => {
    if (initialDetails.date && initialDetails.time) {
      const [month, day, year] = initialDetails.date.split('/');
      const [hours, minutes] = initialDetails.time.split(':');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hours), parseInt(minutes));
    }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [numberOfPersons, setNumberOfPersons] = useState(initialDetails.numberOfPersons?.toString() || '1');
  const [reservationType, setReservationType] = useState<'takeaway' | 'dinein'>(initialDetails.type || 'dinein');
  const [wantToPreOrder, setWantToPreOrder] = useState(initialDetails.wantToPreOrder || false);

  useEffect(() => {
    onUpdate({
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      numberOfPersons: parseInt(numberOfPersons, 10),
      type: reservationType,
      wantToPreOrder,
    });
  }, [date, numberOfPersons, reservationType, wantToPreOrder, onUpdate]);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setFullYear(selectedDate.getFullYear());
        newDate.setMonth(selectedDate.getMonth());
        newDate.setDate(selectedDate.getDate());
        return newDate;
      });
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDate(prevDate => {
        const newDate = new Date(prevDate);
        newDate.setHours(selectedTime.getHours());
        newDate.setMinutes(selectedTime.getMinutes());
        return newDate;
      });
    }
  };

  const renderDateTimePicker = () => {
    if (Platform.OS === 'web') {
      return (
        <View style={styles.webDateTime}>
          <Text style={styles.label}>Select Date and Time:</Text>
          <input
            type="datetime-local"
            value={date.toISOString().slice(0, 16)}
            onChange={(e) => setDate(new Date(e.target.value))}
            style={styles.webDateTimeInput}
          />
        </View>
      );
    } else {
      return (
        <View style={styles.mobileDateTime}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateTimeButton}>
            <Text style={styles.dateTimeText}>
              {date.toLocaleDateString([], { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit' })}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.dateTimeButton}>
            <Text style={styles.dateTimeText}>
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={date}
              mode="time"
              display="default"
              onChange={onChangeTime}
            />
          )}
        </View>
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
  webDateTimeInput: {
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    width: '100%',
    marginTop: 8,
  },
  mobileDateTime: {
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

