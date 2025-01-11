import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopBar from '@repo/ui/src/topbar';
import { useCommandStore } from '@repo/store/src/commandStore';
import { KidTheme, useThemeStore } from '@repo/ui/src/InRestaurant/theme';

SplashScreen.preventAutoHideAsync();

export default function TabletRootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const { currentCommand } = useCommandStore();
  const kidMode = useThemeStore((state) => state.kidMode);
  const toggleKidMode = useThemeStore((state) => state.toggleKidMode);
  const totalItems = currentCommand ? currentCommand.menuItems.reduce((sum, item) => sum + item.quantity, 0) : 0;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={KidTheme}>
        <View style={styles.container}>
          <TopBar 
            isStandard={false} 
            isTablet={true} 
            isKidsMode={kidMode} 
            totalItems={totalItems}
            onKidsModeToggle={toggleKidMode}
          />
          <Slot />
        </View>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

