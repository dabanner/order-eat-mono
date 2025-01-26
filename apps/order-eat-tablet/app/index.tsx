import React, { useEffect } from 'react';
import { StyleSheet, Platform, ScrollView, SafeAreaView } from 'react-native';
import TabletScannerPage from '@/components/TabletScannerPage';
import { useRestaurantStore } from '@repo/store/src/restaurantStore';
import * as ScreenOrientation from "expo-screen-orientation";
if (Platform.OS !== 'web'){
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
}

export default function Index() {
  useEffect(() => {
    const init = async () => {
      await useRestaurantStore.getState().fetchMenuItems();
    };
    init();
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <TabletScannerPage />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
});

