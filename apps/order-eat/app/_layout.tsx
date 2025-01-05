import React, { useEffect } from 'react';
import { View, StyleSheet, Platform, Image } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCommandStore } from '@repo/store/src/commandStore';
import 'react-native-reanimated';
import { LocationNotificationService } from '@/components/LocationNotificationService';
import TopBar from '@repo/ui/src/topbar';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
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

  const hasTopBar = !pathname.includes('/login') && !pathname.includes('/signup');

  const totalCommands = pendingCommands.length + confirmedCommands.length;

  return (
    <ThemeProvider value={DefaultTheme}>
      <LocationNotificationService />
      <SafeAreaView style={styles.container} edges={['top']}>
        <TopBar 
          isStandard={true} 
          isTablet={false} 
          visible={hasTopBar} 
          totalItems={totalCommands}
          backable={['reservation']}
          onActionButton={() => router.push('/reservation')} onHome={() => router.push('/')} 
        />
        <View style={styles.content}>
          <Slot />
        </View>
      </SafeAreaView>
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
