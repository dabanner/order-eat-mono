import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodCategoryStore, FoodCategory } from '@repo/store/src/foodCaregoryStore';
import { RestaurantHeader } from '@/components/RestaurantHeader';
import { ImageGallery } from '@repo/ui/src/ImageGallery';
import { MenuList } from '@/components/MenuList';
import { Footer } from '@/components/Footer';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const { restaurants } = useRestaurantStore();
  const { getFoodCategoryById } = useFoodCategoryStore();
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<FoodCategory | null>(null);
  const router = useRouter();

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

  const handleMenuItemClick = useCallback((itemId: string) => {
    router.push(`/restaurant/${id}/menu-item/${itemId}`);
  }, [id, router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
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
        <View style={styles.menuList}>
                  <MenuList 
          menuItems={filteredMenuItems} 
          categories={categories}
          selectedCategory={selectedFoodCategory}
          onCategorySelect={handleCategorySelect}
          onItemClick={handleMenuItemClick}
          restaurant={restaurant}
          showAddButton={false}
        />
        </View>
      </ScrollView>
      <Footer
          text="Make Reservation"
          counter={1}
          buttonText="Reserve Now"
          updateText={() => {}}
          updateCounter={() => {}}
          onClickButton={() => router.push(`/restaurant/${id}/reservation`)}
          hideCounter
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? -35 : 0,
    
  },
  container: {
    flex: 1,
    
  },
  header: {
    position: 'relative',
  },
  headerContent: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    ...Platform.select({
      web: {
        padding: 20,
      },
      android: {
        padding: 5,
      },
      ios: {
        padding: 5,
      },
    }),
  },
  gallerySection: {
    flex: Platform.OS === 'web' ? 3 : 1,
  },
  infoSection: {
    flex: 2,
    paddingLeft: Platform.OS === 'web' ? 40 : 0,
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
  menuList: {
    marginHorizontal: 20,
    marginBottom: Platform.OS === 'web' ? 200 : 0,
  },
});

