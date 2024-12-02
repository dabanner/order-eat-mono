import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons, Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useCategoryStore } from '../store/categoryStore';
import { useRestaurantStore } from '../store/restaurantStore';
import { useUserStore } from '../store/userStore';
import { SideMenu } from '../components/SideMenu/side-menu';

export default function HomeScreen() {
  const categories = useCategoryStore((state) => state.categories);
  const restaurants = useRestaurantStore((state) => state.restaurants);
  const { user, setUser } = useUserStore();
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setUser();
    }
  }, [user, setUser]);

  const openSideMenu = () => {
    setIsSideMenuOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={openSideMenu} style={styles.menuButton}>
              <MaterialIcons name="menu" size={24} color="#000" />
            </TouchableOpacity>
            <View style={styles.deliverTo}>
              <Text style={styles.deliverToLabel}>DELIVER TO</Text>
              <View style={styles.locationRow}>
                <Text style={styles.location}>Halal Lab office</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="#000" />
              </View>
            </View>
            <TouchableOpacity style={styles.cartButton}>
              <MaterialCommunityIcons name="shopping-outline" size={24} color="#000" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Greeting */}
          <Text style={styles.greeting}>Hey {user?.name}, <Text style={styles.greetingTime}>Good Afternoon!</Text></Text>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search dishes, restaurants"
              placeholderTextColor="#666"
            />
          </View>

          {/* Categories Section */}
          <View style={styles.categoriesHeader}>
            <Text style={styles.sectionTitle}>All Categories</Text>
            <TouchableOpacity style={styles.seeAllContainer}>
              <Text style={styles.seeAll}>See All</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={Platform.OS === 'web'}
            style={styles.categoriesScroll}
          >
            {categories.map((item) => (
              <View key={item.id} style={styles.categoryCard}>
                <View style={styles.categoryImageContainer}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.categoryImage}
                  />
                </View>
                <Text style={styles.categoryName}>{item.name}</Text>
                <Text style={styles.categoryPrice}>Starting <Text style={styles.price}>${item.price}</Text></Text>
              </View>
            ))}
          </ScrollView>

          {/* Restaurants Section */}
          <View style={styles.categoriesHeader}>
            <Text style={styles.sectionTitle}>Open Restaurants</Text>
            <TouchableOpacity style={styles.seeAllContainer}>
              <Text style={styles.seeAll}>See All</Text>
              <MaterialIcons name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.restaurantsGrid}>
            {restaurants.map((item) => (
              <View key={item.id} style={styles.restaurantCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.restaurantImage}
                />
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantType}>{item.type}</Text>
                <View style={styles.restaurantInfo}>
                  <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={16} color="#FF8C00" />
                    <Text style={styles.rating}>{item.rating}</Text>
                  </View>
                  <View style={styles.deliveryContainer}>
                    <MaterialCommunityIcons name="truck-delivery-outline" size={16} color="#FF8C00" />
                    <Text style={styles.deliveryText}>{item.delivery}</Text>
                  </View>
                  <View style={styles.timeContainer}>
                    <Ionicons name="time-outline" size={16} color="#FF8C00" />
                    <Text style={styles.timeText}>{item.time}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      {isSideMenuOpen && (
        <SideMenu
          visible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      )}
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
  content: {
    padding: 16,
    ...Platform.select({
      web: {
        
maxWidth: '100%',
        width: '100%',
        marginHorizontal: 'auto',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
  },
  deliverTo: {
    flex: 1,
    marginHorizontal: 16,
  },
  deliverToLabel: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    fontWeight: '500',
  },
  cartButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FF8C00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
  },
  greetingTime: {
    fontWeight: '400',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  categoriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAll: {
    color: '#666',
    marginRight: 4,
  },
  categoriesScroll: {
    marginBottom: 24,
    ...(Platform.select({
      web: {
        overflow: 'auto' as any,
        WebkitOverflowScrolling: 'touch',
      },
    }) as any),
  },
  categoryCard: {
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        width: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        width: 120,
        elevation: 3,
      },
      web: {
        width: 180,
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  categoryImageContainer: {
    width: '100%',
    ...Platform.select({
      ios: {
        height: 100,
      },
      android: {
        height: 100,
      },
      web: {
        height: 150,
      },
    }),
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  categoryPrice: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    color: '#FF8C00',
    fontWeight: '600',
  },
  restaurantsGrid: {
    ...Platform.select({
      web: {
        display: 'grid' as 'flex',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: 16,
      },
    }),
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
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
        marginBottom: 0,
      },
    }),
  },
  restaurantImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  restaurantType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: '500',
  },
  deliveryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    marginLeft: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
  },
});