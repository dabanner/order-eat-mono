import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestaurantStore } from '../../../store/restaurantStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodCategoryStore, FoodCategory } from '@/store/foodCaregoryStore';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { restaurants } = useRestaurantStore();
  const { getFoodCategoryById } = useFoodCategoryStore();
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<FoodCategory>();

  const restaurant = restaurants?.find((r) => r.id === id);

  // Safeguard against null/undefined restaurant
  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
      </View>
    );
  }

  // Extract unique categories from menuItems with proper naming
  const categories = restaurant.menuItems
    ? Array.from(
        new Set(restaurant.menuItems.map((item) => item.foodCategoryId))
      ).map((categoryId) => ({
        //useFoodCategoryStore
        id: categoryId,
        name: getFoodCategoryById(categoryId)?.name || 'Unknown',
      }))
    : [];

  useEffect(() => {
    if (categories.length > 0) {
      setSelectedFoodCategory(getFoodCategoryById(categories[0].id)); 
    }
  }, []);

  // Filter menu items based on the selected category
  const filteredMenuItems = selectedFoodCategory
    ? restaurant.menuItems.filter((item) => item.foodCategoryId === selectedFoodCategory.id)
    : restaurant.menuItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* Header Image Carousel */}
        <View style={styles.carousel}>
          <Image source={{ uri: restaurant.images[0] }} style={styles.headerImage} />
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <MaterialIcons name="more-horiz" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Restaurant Info */}
        <View style={styles.infoContainer}>
          <View style={styles.ratingContainer}>
            <MaterialIcons name="star" size={24} color="#FF8C00" />
            <Text style={styles.rating}>{restaurant.rating}</Text>
          </View>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
          <Text style={styles.description}>{restaurant.description}</Text>
        </View>

        {/* Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedFoodCategory?.id === category.id && styles.categoryButtonActiveView,
              ]}
              onPress={() => setSelectedFoodCategory(category)} 
            >
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedFoodCategory?.id === category.id && styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>
            {selectedFoodCategory ? `${selectedFoodCategory.name} (${filteredMenuItems.length})` : 'All Items'}
          </Text>
          <View style={styles.menuGrid}>
            {filteredMenuItems.map((item) => (
              <View key={item.id} style={styles.menuItem}>
                <Image source={{ uri: item.image }} style={styles.menuItemImage} />
                <Text style={styles.menuItemName}>{item.name}</Text>
                <Text style={styles.menuItemDescription}>{item.description}</Text>
                <View style={styles.menuItemFooter}>
                  <Text style={styles.menuItemPrice}>${item.price}</Text>
                  <TouchableOpacity style={styles.addButton}>
                    <MaterialIcons name="add" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  carousel: {
    position: 'relative',
    height: 300,
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
  },
  moreButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    padding: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f5f5f5',
  },
  categoryButtonActiveView: {
    backgroundColor: '#FF8C00',
  },
  categoryButtonText: {
    fontSize: 16,
    color: '#666',
  },
  categoryButtonTextActive: {
    color: 'white',
  },
  menuContainer: {
    padding: 16,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuGrid: {
    ...Platform.select({
      web: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 16,
      },
      default: {
        flexDirection: 'column',
      },
    }),
  },
  menuItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
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
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  menuItemImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 12,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 12,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 20,
    padding: 8,
  },
  notFoundText: {
    fontSize: 24,
    textAlign: 'center',
    marginTop: 16,
  },
});
