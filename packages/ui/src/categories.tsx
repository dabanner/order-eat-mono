import { View, Text, Image, StyleSheet, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useFoodCategoryStore } from '@repo/store/src/foodCaregoryStore';
import { MaterialIcons } from '@expo/vector-icons';

export default function Categories({isKidsMode}: {isKidsMode?: boolean}) {
  const categories = useFoodCategoryStore((state) => state.categories);

  return (
    <>
      <View style={styles.categoriesHeader}>
        <Text style={[
          styles.sectionTitle,
          isKidsMode && styles.kidsSectionTitle
        ]}>
          {isKidsMode ? "🍽️ Choose Your Food Adventure !" : "All Categories"}
        </Text>
        <TouchableOpacity style={[
          styles.seeAllContainer,
          isKidsMode && styles.kidsSeeAllContainer
        ]}>
          <Text style={[
            styles.seeAll,
            isKidsMode && styles.kidsSeeAll
          ]}>
            {isKidsMode ? "More Fun!" : "See All"}
          </Text>
          <MaterialIcons 
            name={isKidsMode ? "stars" : "chevron-right"} 
            size={24} 
            color={isKidsMode ? "#FFD700" : "#666"} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={Platform.OS === 'web'}
        style={[
          styles.categoriesScroll,
          isKidsMode && styles.kidsCategoriesScroll
        ]}
      >
        {categories.map((item) => (
          <View 
            key={item.id} 
            style={[
              styles.categoryCard,
              isKidsMode && styles.kidsCategoryCard
            ]}
          >
            <View style={[
              styles.categoryImageContainer,
              isKidsMode && styles.kidsCategoryImageContainer
            ]}>
              <Image
                source={isKidsMode ? item.imageKids : item.image}
                style={styles.categoryImage}
              />
            </View>
            <Text style={[
              styles.categoryName,
              isKidsMode && styles.kidsCategoryName
            ]}>
              {item.name}
            </Text>
            <Text style={[
              styles.categoryPrice,
              isKidsMode && styles.kidsCategoryPrice
            ]}>
              Starting at <Text style={[
                styles.price,
                isKidsMode && styles.kidsPrice
              ]}>${item.price}</Text>
            </Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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
  kidsSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff7622',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  kidsSeeAllContainer: {
    backgroundColor: '#FFE5E5',
    padding: 8,
    borderRadius: 20,
  },
  seeAll: {
    color: '#666',
    marginRight: 4,
  },
  kidsSeeAll: {
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  categoriesScroll: {
    marginBottom: 24,
  },
  kidsCategoriesScroll: {
    marginBottom: 32,
    padding: 16,
  },
  categoryCard: {
    marginRight: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        width: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        width: 140,
        elevation: 3,
      },
      web: {
        width: 180,
        boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  kidsCategoryCard: {
    backgroundColor: '#ffeee3',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#ffa66e',
    transform: [{ scale: 1.05 }],
    ...Platform.select({
      ios: {
        shadowColor: '#ff7622',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 4px 8px rgba(255,215,0,0.3)',
      },
    }),
  },
  categoryImageContainer: {
    width: '100%',
    ...Platform.select({
      ios: { height: 100 },
      android: { height: 100 },
      web: { height: 150 },
    }),
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 8,
  },
  kidsCategoryImageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    padding: 8,
    transform: [{ scale: 1.1 }],
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
  kidsCategoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginTop: 8,
  },
  categoryPrice: {
    fontSize: 14,
    color: '#666',
  },
  kidsCategoryPrice: {
    fontSize: 14,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '500',
  },
  price: {
    color: '#FF8C00',
    fontWeight: '600',
  },
  kidsPrice: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
