import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { useCommandStore, WaitstaffRequest } from '@repo/store/src/commandStore';
import { ItemCard } from '@/components/ItemCard';
import { WaitstaffModal } from '@/components/WaitstaffModal';

type OrderMenuItem = MenuItem & {
  quantity: number;
  paid: boolean;
};

export default function CommandItemsScreen() {
  const [isWaitstaffModalVisible, setWaitstaffModalVisible] = useState(false);
  const {
    currentCommand,
    updateMenuItemQuantity,
    removeMenuItem,
    toggleItemPaidStatus,
    addWaitstaffRequest,
  } = useCommandStore();
  const router = useRouter();

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: number): void => {
    const newQuantity = currentQuantity + increment;
    if (newQuantity <= 0) {
      removeMenuItem(itemId);
    } else {
      updateMenuItemQuantity(itemId, newQuantity);
    }
  };

  const handleSubmitOrder = () => {
    // Handle order submission
    console.log('Order submitted');
    router.back();
  };

  const renderItem = ({ item }: { item: OrderMenuItem }) => (
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
    <SafeAreaView style={styles.container}>
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
    </SafeAreaView>
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
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 18,
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
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 8,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  callWaitstaffButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

