import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Image } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SideMenu } from '../components/SideMenu/side-menu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { pendingCommands, confirmedCommands } = useCommandStore();

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
  const totalCommands = pendingCommands.length + confirmedCommands.length;

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={[styles.header]}>
          {isChildRoute ? (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity onPress={() => router.push('/')} style={styles.logoButton}>
            <Image
              source={require('../assets/images/LogoLong.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={openSideMenu} style={styles.menuButton}>
            <MaterialIcons name="menu" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartButton}>
            <MaterialCommunityIcons name="shopping-outline" size={24} color="#000" />
            {totalCommands > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCommands}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: Platform.OS === 'web' ? 64 : 56,
  },
  logoButton: {
    padding: 8,
    position: 'absolute',
    left: 5,
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  logoImage: {
    width: 160,
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    marginRight: 8,
  },
  backButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 50,
    position: 'absolute',
    left: 16,
    zIndex: 10,
    visibility: Platform.OS === 'web' ? 'hidden' : 'visible',
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
  content: {
    flex: 1,
  },
});

