import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import TabletScannerPage from '@/components/TabletScannerPage';
import * as ScreenOrientation from "expo-screen-orientation";
import { Platform } from 'react-native';
if (Platform.OS !== 'web'){
  ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);
}

export default function Index() {
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

