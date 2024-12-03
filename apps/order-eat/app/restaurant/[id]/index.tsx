import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestaurantStore } from '../../../store/restaurantStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodCategoryStore, FoodCategory } from '@/store/foodCaregoryStore';
import { RestaurantHeader } from '@/components/RestaurantHeader';
import { ImageGallery } from '@/components/ImageGallery';
import { CategoryList } from '@/components/CategoryList';
import { MenuList } from '@/components/MenuList';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const { restaurants } = useRestaurantStore();
  const { getFoodCategoryById } = useFoodCategoryStore();
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<FoodCategory | null>(null);

  const restaurant = useMemo(() => restaurants?.find((r) => r.id === id), [restaurants, id]);

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
      </View>
    );
  }

  const categories = useMemo(() => 
    restaurant.menuItems
      ? Array.from(
          new Set(restaurant.menuItems.map((item) => item.foodCategoryId))
        ).map((categoryId) => {
          const category = getFoodCategoryById(categoryId);
          return {
            id: categoryId,
            name: category?.name || 'Unknown',
            price: category?.price || 0,
            image: category?.image || '',
          };
        })
      : [],
    [restaurant.menuItems, getFoodCategoryById]
  );

  const filteredMenuItems = useMemo(() => 
    selectedFoodCategory
      ? restaurant.menuItems.filter((item) => item.foodCategoryId === selectedFoodCategory.id)
      : restaurant.menuItems,
    [restaurant.menuItems, selectedFoodCategory]
  );

  const handleCategorySelect = useCallback((category: FoodCategory | null) => {
    setSelectedFoodCategory(category);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoriteButton}>
            <MaterialIcons name="favorite" size={24} color="#FF8C00" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <View style={styles.gallerySection}>
              <ImageGallery images={restaurant.images || []} />
            </View>
            {Platform.OS === 'web' && (
              <View style={styles.infoSection}>
                <RestaurantHeader restaurant={restaurant} />
              </View>
            )}
          </View>
        </View>
        {Platform.OS !== 'web' && <RestaurantHeader restaurant={restaurant} />}
        <CategoryList 
          categories={categories} 
          selectedCategory={selectedFoodCategory} 
          onSelectCategory={handleCategorySelect} 
        />
        <MenuList 
          menuItems={filteredMenuItems} 
          selectedCategory={selectedFoodCategory} 
        />
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
  header: {
    position: 'relative',
  },
  headerContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    padding: 20,
  },
  gallerySection: {
    flex: Platform.OS === 'web' ? 3 : 1,
  },
  infoSection: {
    flex: 2,
    paddingLeft: Platform.OS === 'web' ? 40 : 0,
    borderLeftWidth: Platform.OS === 'web' ? 1 : 0,
    borderLeftColor: '#eee',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
    ...Platform.select({
      web: {
        display: 'none',
      },
    }),
  },
  favoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50,
    zIndex: 10,
    borderWidth: Platform.OS === 'web' ? 1 : 0,
    borderColor: '#FF8C00',
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});
