import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function ReservationsPage() {
  const router = useRouter();
  const { pendingCommands, confirmedCommands } = useCommandStore();
  const allCommands = [...pendingCommands, ...confirmedCommands];

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Reservations</Text>
      </View>
      <ScrollView style={styles.content}>
        {allCommands.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="calendar-today" size={48} color="#ccc" />
            <Text style={styles.emptyStateText}>No reservations yet</Text>
          </View>
        ) : (
          allCommands.map((command) => (
            <TouchableOpacity
              key={command.id}
              style={styles.reservationCard}
              onPress={() => router.push(`/reservation/${command.id}`)}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.restaurantName}>{command.restaurant.name}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: command.status === 'confirmed' ? '#4CAF50' : '#FF8C00' }
                ]}>
                  <Text style={styles.statusText}>{command.status}</Text>
                </View>
              </View>

              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <MaterialIcons name="event" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {formatDate(command.reservationDetails.date)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="schedule" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {command.reservationDetails.time}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <MaterialIcons name="people" size={20} color="#666" />
                  <Text style={styles.detailText}>
                    {command.reservationDetails.numberOfPersons} {command.reservationDetails.numberOfPersons === 1 ? 'Person' : 'People'}
                  </Text>
                </View>
              </View>

              {command.menuItems.length > 0 && (
                <View style={styles.preorderBadge}>
                  <MaterialIcons name="restaurant" size={16} color="#FF8C00" />
                  <Text style={styles.preorderText}>
                    {command.menuItems.length} items pre-ordered
                  </Text>
                </View>
              )}

              <View style={styles.cardFooter}>
                <Text style={styles.totalAmount}>
                  Total: ${command.totalAmount.toFixed(2)}
                </Text>
                <MaterialIcons name="chevron-right" size={24} color="#666" />
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
  },
  reservationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  preorderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5E6',
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  preorderText: {
    fontSize: 14,
    color: '#FF8C00',
    marginLeft: 8,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
  },
});

