import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

const { width } = Dimensions.get('window');

// Component for native scanner
const NativeScanner = ({ onScan, onClose, scanned }) => (
    <View style={styles.scannerContainer}>
      <View style={styles.cameraWrapper}>
        <CameraView
            style={styles.camera}
            onBarcodeScanned={scanned ? undefined : onScan}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Close Scanner</Text>
        </TouchableOpacity>
      </View>
    </View>
);

// Component for manual code entry
const ManualEntry = ({ code, onCodeChange, onSubmit, onScannerOpen }) => (
    <View style={styles.manualEntryContainer}>
      <TextInput
          style={styles.input}
          onChangeText={onCodeChange}
          value={code}
          placeholder="Enter code manually"
          keyboardType="number-pad"
      />
      <TouchableOpacity style={styles.button} onPress={onSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onScannerOpen}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
    </View>
);

// Custom hook for scanner functionality
const useScanner = (onScanComplete) => {
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openScanner = () => {
    setShowScanner(true);
    setScanned(false);
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  return {
    showScanner,
    hasPermission,
    scanned,
    setScanned,
    openScanner,
    closeScanner,
  };
};

// Main component
export default function TabletScannerPage() {
  const [manualCode, setManualCode] = useState('');

  const handleScanComplete = (data) => {
    alert(`QR Code scanned: ${data}`);
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      handleScanComplete(data);
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      alert(`Manually entered code: ${manualCode}`);
      setManualCode('');
    } else {
      alert('Please enter a code');
    }
  };

  const {
    showScanner,
    hasPermission,
    scanned,
    setScanned,
    openScanner,
    closeScanner,
  } = useScanner(handleScanComplete);

  if (hasPermission === false) {
    return (
        <View style={styles.container}>
          <Text>No access to camera</Text>
        </View>
    );
  }

  return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Tablet Scanner</Text>
        </View>
        <View style={styles.content}>
          {showScanner ? (
              <NativeScanner
                  onScan={handleBarCodeScanned}
                  onClose={closeScanner}
                  scanned={scanned}
              />
          ) : (
              <ManualEntry
                  code={manualCode}
                  onCodeChange={setManualCode}
                  onSubmit={handleManualSubmit}
                  onScannerOpen={openScanner}
              />
          )}
        </View>
      </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scannerContainer: {
    width: width * 0.8,
    height: "70%",
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  cameraWrapper: {
    width: '50%',
    aspectRatio: 1,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#F4804F',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#F4804F',
    height: 48,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    margin: 10,
    minWidth: 150,
  },
  closeButton: {
    width: '80%',
  },
  header: {
    height: 60,
    backgroundColor: '#F4804F',
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
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});