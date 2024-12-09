import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { BarCodeScanner } from 'expo-barcode-scanner';

const { width, height } = Dimensions.get('window');

export default function TabletScannerPage() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [isScanning, setIsScanning] = useState(true);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);
    alert(`Bar code with data ${data} has been scanned!`);
  };

  const handleManualSubmit = () => {
    if (manualCode) {
      alert(`Manually entered code: ${manualCode}`);
      setManualCode('');
    }
  };

  const toggleScanningMode = () => {
    setIsScanning(!isScanning);
    setScanned(false);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tablet Scanner</Text>
      </View>
      <View style={styles.content}>
        {isScanning ? (
          <View style={styles.scannerContainer}>
            <Camera
              style={styles.camera}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
            >
              <View style={styles.overlay}>
                <View style={styles.scanArea} />
              </View>
            </Camera>
            {scanned && (
              <TouchableOpacity style={styles.button} onPress={() => setScanned(false)}>
                <Text style={styles.buttonText}>Tap to Scan Again</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.manualEntryContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setManualCode}
              value={manualCode}
              placeholder="Enter code manually"
              keyboardType="number-pad"
            />
            <TouchableOpacity style={styles.button} onPress={handleManualSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.toggleButton} onPress={toggleScanningMode}>
          <Text style={styles.buttonText}>
            {isScanning ? 'Switch to Manual Entry' : 'Switch to QR Scanner'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  header: {
    height: 60,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    width: width * 0.8,
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: width * 0.6,
    height: width * 0.6,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  manualEntryContainer: {
    width: width * 0.8,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
});

