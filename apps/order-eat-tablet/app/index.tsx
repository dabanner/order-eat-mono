import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import TabletScannerPage from '@/components/TabletScannerPage';

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

