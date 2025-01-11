import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useCommandStore } from '@repo/store/dist/commandStore';
import { ItemCard } from '@/components/ItemCard';
import { WaitstaffModal } from '@/components/WaitstaffModal';

export default function CommandSection() {
  const [isWaitstaffModalVisible, setWaitstaffModalVisible] = useState(false);
  const {
    currentCommand,
    updateMenuItemQuantity,
    removeMenuItem,
    toggleItemPaidStatus,
    addWaitstaffRequest,
  } = useCommandStore();

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: number): void => {
    const newQuantity = currentQuantity + increment;
    if (newQuantity <= 0) {
      removeMenuItem(itemId);
    } else {
      updateMenuItemQuantity(itemId, newQuantity);
    }
  };

  const handleSubmitOrder = () => {
    console.log('Order submitted');
    // Handle order submission logic here
  };

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      onQuantityChange={handleQuantityChange}
      onPaymentStatusChange={() => toggleItemPaidStatus(item.id)}
    />
  );

  if (!currentCommand) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active command</Text>
      </View>
    );
  }

  const sortedMenuItems = [...currentCommand.menuItems].sort((a, b) => {
    if (a.paid === b.paid) return 0;
    return a.paid ? 1 : -1;
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Order</Text>
        <TouchableOpacity
          style={styles.callWaitstaffButton}
          onPress={() => setWaitstaffModalVisible(true)}
        >
          <Text style={styles.callWaitstaffButtonText}>Call Waitstaff</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedMenuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Items</Text>
            <Text style={styles.totalAmount}>
              Total: ${currentCommand.totalAmount.toFixed(2)}
            </Text>
          </View>
        )}
      />

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.defaultButton]}
          onPress={handleSubmitOrder}
        >
          <Text style={styles.actionButtonText}>Submit Order</Text>
        </TouchableOpacity>
      </View>

      <WaitstaffModal
        visible={isWaitstaffModalVisible}
        onClose={() => setWaitstaffModalVisible(false)}
        onAction={addWaitstaffRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    color: '#FF9800',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
  footer: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
  },
  defaultButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  callWaitstaffButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  callWaitstaffButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
