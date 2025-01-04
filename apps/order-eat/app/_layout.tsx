import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopBar from "@repo/ui/src/topbar";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
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

  const isChildRoute = pathname.split('/').length > 2;

  return (
      <SafeAreaProvider>
        <ThemeProvider value={DefaultTheme}>
          <View style={styles.container}>
            <TopBar
                onBack={() => router.back()}
                onHome={() => router.push('/')}
                onActionButton={() => router.push('/reservation')}
                isChildRoute={isChildRoute}
                isPhone={true}
            />
            <View style={styles.content}>
              <Slot />
            </View>
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