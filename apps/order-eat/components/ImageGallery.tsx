import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';

interface ImageGalleryProps {
  images: string[];
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const viewWidth = event.nativeEvent.layoutMeasurement.width;
    const newIndex = Math.round(contentOffsetX / viewWidth);

    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  return (
    <View style={styles.gallery}>
      <View style={styles.thumbnails}>
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setCurrentIndex(index)}
            style={styles.thumbnail}
          >
            <Image
              source={{ uri: image }}
              style={[
                styles.thumbnailImage,
                currentIndex === index && styles.thumbnailActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.mainImageContainer}>
        {Platform.OS === 'web' ? (
          <Image
            source={{ uri: images[currentIndex] }}
            style={styles.mainImage}
          />
        ) : (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.mainImage} />
            ))}
          </ScrollView>
        )}
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
    </View>
  );
};

const styles = StyleSheet.create({
  gallery: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    gap: 20,
  },
  thumbnails: {
    ...Platform.select({
      android: {
        display: 'none',
      },
      ios: {
        display: 'none',
      },
      web: {
        width: 100,
      },
    }),
  },
  thumbnail: {
    width: 100,
    height: 100,
    marginBottom: Platform.OS === 'web' ? 10 : 0,
    marginRight: Platform.OS === 'web' ? 0 : 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  thumbnailActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  mainImageContainer: {
    flex: 1,
    position: 'relative',
    width: '100%',
  },
  mainImage: {
    ...Platform.select({
      web: {
        width: '100%',
        height: '100%',
      },
      default: {
        width: 330,
        height: 300,
      },
    }),
    borderRadius: 12,
    marginHorizontal: 8,
  },
  pageIndicatorContainer: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'box-none',
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
});

