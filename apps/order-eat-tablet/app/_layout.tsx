import React, { useEffect, createContext, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Slot, useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TopBar from '@repo/ui/src/topbar';

SplashScreen.preventAutoHideAsync();

export const KidsModeContext = createContext<{
  isKidsMode: boolean;
  setIsKidsMode: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isKidsMode: false,
  setIsKidsMode: () => {},
});

export const useKidsMode = () => useContext(KidsModeContext);

export default function TabletRootLayout() {
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [isKidsMode, setIsKidsMode] = React.useState(false);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const kidsModeValue = { isKidsMode, setIsKidsMode };

  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <View style={styles.container}>
          <TopBar 
            isStandard={false} 
            isTablet={true} 
            isKidsMode={isKidsMode} 
            onKidsModeToggle={setIsKidsMode} 
            onActionButton={() => router.push('/restaurant/command')}
          />
          <KidsModeContext.Provider value={kidsModeValue}>
            <Slot />
          </KidsModeContext.Provider>
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

