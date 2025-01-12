import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopBar from '@repo/ui/src/topbar';
import { useCommandStore } from '@repo/store/src/commandStore';

SplashScreen.preventAutoHideAsync();

export default function TabletRootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

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
      <ThemeProvider value={DefaultTheme}>
        <View style={styles.container}>
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
  content: {
    flex: 1,
  },
});

