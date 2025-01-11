import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useCommandStore } from '@repo/store/src/commandStore';
import { ItemCard } from '@/components/ItemCard';
import { WaitstaffModal } from '@/components/WaitstaffModal';
import { SuccessModal } from '@/components/SuccessModal';

export default function CommandSection() {
  const [isWaitstaffModalVisible, setWaitstaffModalVisible] = useState(false);
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
  const {
    currentCommand,
    updateMenuItemQuantity,
    removeMenuItem,
    toggleItemPaidStatus,
    toggleItemSubmittedStatus,
    addWaitstaffRequest,
    confirmCommand,
    addMenuItem,
    submitUnsubmittedItems,
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
    if (!currentCommand) return;
    
    if (currentCommand.menuItems.length === 0) {
      Alert.alert(
        "Empty Order",
        "Please add some items to your order before submitting.",
        [{ text: "OK" }]
      );
      return;
    }

    submitUnsubmittedItems();
    setSuccessModalVisible(true);
  };

  const renderItem = ({ item }) => (
    <ItemCard
      item={item}
      onQuantityChange={handleQuantityChange}
      onPaymentStatusChange={() => toggleItemPaidStatus(item.id)}
      onSubmitStatusChange={() => toggleItemSubmittedStatus(item.id)}
      onAddNewItem={() => addMenuItem(item)}
    />
  );

  const groupAndSortItems = (items) => {
    const groupedItems = items.reduce((acc, item) => {
      const key = `${item.id}-${item.submitted ? 'submitted' : 'unsubmitted'}-${item.paid ? 'paid' : 'unpaid'}`;
      if (!acc[key]) {
        acc[key] = { ...item, groupQuantity: item.quantity };
      } else {
        acc[key].groupQuantity += item.quantity;
      }
      return acc;
    }, {});

    return Object.values(groupedItems).sort((a, b) => {
      if (a.submitted === b.submitted) {
        if (a.paid === b.paid) return 0;
        return a.paid ? 1 : -1;
      }
      return a.submitted ? 1 : -1;
    });
  };

  const hasUnsubmittedItems = () => {
    return currentCommand?.menuItems.some(item => !item.submitted) ?? false;
  };

  if (!currentCommand) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active command</Text>
      </View>
    );
  }

  const groupedAndSortedItems = groupAndSortItems(currentCommand.menuItems);

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
        data={groupedAndSortedItems}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.id}-${item.submitted}-${item.paid}-${index}`}
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
        {hasUnsubmittedItems() ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.defaultButton]}
            onPress={handleSubmitOrder}
          >
            <Text style={styles.actionButtonText}>Submit Order</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.preparingText}>
            Please be patient, we are preparing your order...
          </Text>
        )}
      </View>

      <WaitstaffModal
        visible={isWaitstaffModalVisible}
        onClose={() => setWaitstaffModalVisible(false)}
        onAction={addWaitstaffRequest}
      />

      <SuccessModal
        visible={isSuccessModalVisible}
        onClose={() => setSuccessModalVisible(false)}
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
  preparingText: {
    textAlign: 'center',
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
});

