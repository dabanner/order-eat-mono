import React from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TabletScannerPage from '@/components/TabletScannerPage';

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={Platform.OS === 'web'}
      >
        <View style={styles.content}>
          <TabletScannerPage></TabletScannerPage>
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
  content: {
    padding: 16,
    paddingTop: 0,
    maxWidth: '100%',
    width: '100%',
    marginHorizontal: 'auto',
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
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  time: {
    marginLeft: 16,
  },
});

