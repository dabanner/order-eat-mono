import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Dimensions } from 'react-native';
import { DetailedNutritionInfo } from '@repo/store/src/restaurantStore';

interface NutritionDisplayProps {
  nutrition: DetailedNutritionInfo;
  image: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const calculateSize = (baseSize: number) => {
  const scaleFactor = Math.min(SCREEN_WIDTH / 320, 1.5); 
  return Math.round(baseSize * scaleFactor);
};

export function WebNutritionDisplay({ nutrition, image }: NutritionDisplayProps) {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;

  return (
    <View style={[styles.content, isSmallScreen && styles.contentSmall]}>
      <View style={[styles.textContent, isSmallScreen && styles.textContentSmall]}>
        <View>
          <Text style={styles.size}>SIZE: {nutrition.servingSize}</Text>
          <Text style={styles.description}>{nutrition.description}</Text>
        </View>
      </View>

      <View style={[styles.circleWrapper, isSmallScreen && styles.circleWrapperSmall]}>
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <View style={styles.imageContainer}>
              <Image
                source={image}
                style={styles.image}
              />
            </View>

            {/* Nutrition values */}
            <View style={[styles.nutritionItem, styles.carbsPosition]}>
              <Text style={styles.nutritionValue}>{nutrition.carbs}G</Text>
              <Text style={styles.nutritionLabel}>Carbs</Text>
            </View>

            <View style={[styles.nutritionItem, styles.fiberPosition]}>
              <Text style={styles.nutritionValue}>{nutrition.fiber}G</Text>
              <Text style={styles.nutritionLabel}>Fiber</Text>
            </View>

            <View style={[styles.nutritionItem, styles.caloriesPosition]}>
              <Text style={styles.nutritionValue}>{nutrition.calories}</Text>
              <Text style={styles.nutritionLabel}>Calories</Text>
            </View>

            <View style={[styles.nutritionItem, styles.proteinPosition]}>
              <Text style={styles.nutritionValue}>{nutrition.proteins}G</Text>
              <Text style={styles.nutritionLabel}>Protein</Text>
            </View>

            <View style={[styles.nutritionItem, styles.fatPosition]}>
              <Text style={styles.nutritionValue}>{nutrition.fats}G</Text>
              <Text style={styles.nutritionLabel}>Fat</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    marginHorizontal: 'auto',
    maxHeight: 400,
  },
  contentSmall: {
    maxHeight: 200,
  },
  textContent: {
    flex: 1,
    marginRight: 40,
  },
  textContentSmall: {
    marginRight: 20,
  },
  size: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#A0A0A0',
    lineHeight: 24,
  },
  circleWrapper: {
    width: '50%',
    aspectRatio: 1,
    position: 'relative',
  },
  circleWrapperSmall: {
    width: '40%',
  },
  circleContainer: {
    width: '70%',
    height: '70%',
    position: 'relative',
  },
  circle: {
    width: '70%',
    height: '70%',
    borderRadius: 9999,
    backgroundColor: '#FFF2F0',
    position: 'relative',
  },
  imageContainer: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    top: '13%',
    left: '15%',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  nutritionItem: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: calculateSize(7),
    borderRadius: 9999,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    minWidth: calculateSize(44),
    minHeight: calculateSize(44)
  },
  nutritionValue: {
    fontSize: calculateSize(11),
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 2,
  },
  nutritionLabel: {
    fontSize: calculateSize(9),
    color: '#A0A0A0',
    fontWeight: '500',
  },
  carbsPosition: {
    top: '0%',
    left: '60%',
    transform: [{ translateX: -calculateSize(40) }, { translateY: -calculateSize(20) }],
  },
  fiberPosition: {
    top: '25%',
    right: '-10%',
  },
  caloriesPosition: {
    bottom: '0%',
    right: '5%',
  },
  proteinPosition: {
    bottom: '15%',
    left: '25%',
    transform: [{ translateX: -calculateSize(40) }, { translateY: calculateSize(20) }],
  },
  fatPosition: {
    bottom: '45%',
    left: '-10%',
  },
});

