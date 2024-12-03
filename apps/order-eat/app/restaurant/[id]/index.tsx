import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useRestaurantStore } from '../../../store/restaurantStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFoodCategoryStore, FoodCategory } from '@/store/foodCaregoryStore';

export default function RestaurantScreen() {
  const { id } = useLocalSearchParams();
  const { restaurants } = useRestaurantStore();
  const { getFoodCategoryById } = useFoodCategoryStore();
  const [selectedFoodCategory, setSelectedFoodCategory] = useState<FoodCategory | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('14"');
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isWideScreen = width >= 768;

  const restaurant = restaurants?.find((r) => r.id === id);

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFoundText}>Restaurant not found</Text>
      </View>
    );
  }

  const images = restaurant.images || [];

  const categories = restaurant.menuItems
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
    : [];

  const filteredMenuItems = selectedFoodCategory
    ? restaurant.menuItems.filter((item) => item.foodCategoryId === selectedFoodCategory.id)
    : restaurant.menuItems;

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const newIndex = Math.round(contentOffsetX / viewWidth);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  const renderMobileLayout = () => (
    <ScrollView style={styles.container}>
      <View style={styles.carouselContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.carouselImage} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite" size={24} color="#FF8C00" />
        </TouchableOpacity>

        <View style={styles.pageIndicatorContainer}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentIndex(index)}
              style={[
                styles.pageIndicator,
                currentIndex === index && styles.pageIndicatorActive,
              ]}
            />
          ))}
        </View>
      </View>

      {renderRestaurantInfo()}
      {renderCategories()}
      {renderMenuItems()}
    </ScrollView>
  );

  const renderWebLayout = () => (
    <ScrollView style={styles.container}>
    <View style={styles.webContainer}>
      <View style={styles.webSidebar}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentIndex(index)}
            style={styles.webThumbnail}
          >
            <Image
              source={{ uri: image }}
              style={[
                styles.webThumbnailImage,
                currentIndex === index && styles.webThumbnailActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.webMainImage}>
        <Image
          source={{ uri: images[currentIndex] }}
          style={styles.webLargeImage}
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <MaterialIcons name="favorite" size={24} color="#FF8C00" />
        </TouchableOpacity>
      </View>

      <View style={styles.webContent}>
        <View style={styles.webHeader}>
          <Text style={styles.restaurantName}>{restaurant.name}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <MaterialIcons name="star" size={24} color="#FF8C00" />
          <Text style={styles.rating}>{restaurant.rating}</Text>
          <MaterialIcons name="schedule" size={24} color="#FF8C00" style={styles.time} />
          <Text style={styles.rating}>{restaurant.time}</Text>
        </View>
        <Text style={styles.description}>{restaurant.description}</Text>
      </View>
    </View>
    {renderCategories()}
    {renderMenuItems()}
    </ScrollView>
    
  );

  const renderRestaurantInfo = () => (
    <View style={styles.infoContainer}>
      <View style={styles.ratingContainer}>
        <MaterialIcons name="star" size={24} color="#FF8C00" />
        <Text style={styles.rating}>{restaurant.rating}</Text>
        <MaterialIcons name="schedule" size={24} color="#FF8C00" style={styles.time} />
        <Text style={styles.rating}>{restaurant.time}</Text>
      </View>
      <Text style={styles.restaurantName}>{restaurant.name}</Text>
      <Text style={styles.description}>{restaurant.description}</Text>
    </View>
  );

  const renderCategories = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedFoodCategory?.id === category.id && styles.categoryButtonActiveView,
          ]}
          onPress={() =>
            setSelectedFoodCategory(
              selectedFoodCategory?.id === category.id ? null : category
            )
          }
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
  );

  const renderMenuItems = () => (
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
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {isWeb && isWideScreen ? renderWebLayout() : renderMobileLayout()}
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
  webContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  webSidebar: {
    width: 100,
    marginRight: 20,
  },
  webThumbnail: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  webThumbnailImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  webThumbnailActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  webMainImage: {
    flex: 2,
    position: 'relative',
    marginRight: 20,
  },
  webLargeImage: {
    width: '100%',
    height: 500,
    borderRadius: 12,
  },
  webContent: {
    flex: 1,
    paddingTop: 20,
  },
  webHeader: {
    marginBottom: 20,
  },
  webBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  brandName: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
  },
  sizeContainer: {
    marginTop: 24,
  },
  sizeLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
  sizeOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#f5f5f5',
  },
  sizeButtonActive: {
    backgroundColor: '#FF8C00',
  },
  sizeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  sizeButtonTextActive: {
    color: 'white',
  },
  priceContainer: {
    marginTop: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
    marginRight: 12,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  // Existing styles remain the same
  carouselContainer: {
    position: 'relative',
    marginBottom: 5,
    width: '100%',
    height: 300,
  },
  carouselImage: {
    width: 330,
    height: 300,
    borderRadius: 12,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    pointerEvents: 'box-none',
    alignItems: 'center',
  },
  pageIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  pageIndicatorActive: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    padding: 10,
    borderRadius: 50,
    zIndex: 1,
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
  time: {
    marginLeft: 16,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  menuItemImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  menuItemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  menuItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    padding: 10,
    borderRadius: 50,
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
});