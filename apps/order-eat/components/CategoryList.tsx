import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { FoodCategory } from '@/store/foodCaregoryStore';

interface CategoryListProps {
  categories: FoodCategory[];
  selectedCategory: FoodCategory | null;
  onSelectCategory: (category: FoodCategory | null) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.categoriesContainer}
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryButton,
            selectedCategory?.id === category.id && styles.categoryButtonActiveView,
          ]}
          onPress={() => onSelectCategory(selectedCategory?.id === category.id ? null : category)}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory?.id === category.id && styles.categoryButtonTextActive,
            ]}
          >
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
});

