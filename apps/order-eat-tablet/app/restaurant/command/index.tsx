import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ListRenderItem,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MenuItem } from '@repo/store/src/restaurantStore';
import { useCommandStore } from '@repo/store/src/commandStore';

type RootStackParamList = {
  CommandItems: undefined;
};

type CommandItemsScreenProps = NativeStackScreenProps<RootStackParamList, 'CommandItems'>;

type OrderMenuItem = MenuItem & {
  quantity: number;
};

interface QuantityControlsProps {
  itemId: string;
  quantity: number;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
}

interface ItemCardProps {
  item: OrderMenuItem;
  onQuantityChange: (itemId: string, currentQuantity: number, increment: number) => void;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({ itemId, quantity, onQuantityChange }) => (
  <View style={styles.quantityControls}>
    <TouchableOpacity
      style={styles.quantityButton}
      onPress={() => onQuantityChange(itemId, quantity, -1)}
    >
      <Text style={styles.quantityButtonText}>-</Text>
    </TouchableOpacity>
    
    <Text style={styles.quantityText}>{quantity}</Text>
    
    <TouchableOpacity
      style={styles.quantityButton}
      onPress={() => onQuantityChange(itemId, quantity, 1)}
    >
      <Text style={styles.quantityButtonText}>+</Text>
    </TouchableOpacity>
  </View>
);

const ItemCard: React.FC<ItemCardProps> = ({ item, onQuantityChange }) => (
  <View style={styles.itemContainer}>
    <Image
     source={{ uri: item.images[0] }}
      style={styles.itemImage}
    />
    
    <View style={styles.itemDetails}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription} numberOfLines={2}>
        {item.description}
      </Text>
      
      <View style={styles.priceQuantityContainer}>
        <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
        <QuantityControls
          itemId={item.id}
          quantity={item.quantity}
          onQuantityChange={onQuantityChange}
        />
      </View>
    </View>
  </View>
);

const CommandItemsScreen: React.FC<CommandItemsScreenProps> = () => {
  const { currentCommand, updateMenuItemQuantity, removeMenuItem } = useCommandStore();

  const handleQuantityChange = (itemId: string, currentQuantity: number, increment: number): void => {
    const newQuantity = currentQuantity + increment;
    if (newQuantity <= 0) {
      removeMenuItem(itemId);
    } else {
      updateMenuItemQuantity(itemId, newQuantity);
    }
  };

  const renderItem: ListRenderItem<OrderMenuItem> = ({ item }) => (
    <ItemCard item={item} onQuantityChange={handleQuantityChange} />
  );

  if (!currentCommand) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No active command</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList<OrderMenuItem>
        data={currentCommand.menuItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Order Items</Text>
            <Text style={styles.totalAmount}>
              Total: ${currentCommand.totalAmount.toFixed(2)}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>No items in the order</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  totalAmount: {
    fontSize: 18,
    color: '#FF9800',
    fontWeight: '600',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  priceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF9800',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FF9800',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 24,
  },
});

export default CommandItemsScreen;