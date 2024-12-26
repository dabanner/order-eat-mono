import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { SideMenu } from '../components/SideMenu/side-menu';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const openSideMenu = () => {
    setIsSideMenuOpen(true);
  };

  const isChildRoute = pathname.split('/').length > 2;

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaView style={styles.container}>
        <View style={[styles.header, isChildRoute && styles.headerWithBackButton]}>
          {isChildRoute ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={openSideMenu} style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton}>
            <MaterialCommunityIcons name="shopping-outline" size={24} color="#000" />
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Slot />
      </SafeAreaView>
      <StatusBar style="auto" />
      {isSideMenuOpen && (
        <SideMenu
          visible={isSideMenuOpen}
          onClose={() => setIsSideMenuOpen(false)}
        />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        paddingVertical: 8,
      }
    }),
  },
  headerWithBackButton: {
    justifyContent: 'flex-end',
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    ...Platform.select({
      ios: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
      },
      android: {
        position: 'absolute',
        left: 16,
        zIndex: 10,
      },
      web: {
        display: 'none',
      },
    }),
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
});

