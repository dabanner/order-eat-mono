import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { Html5Qrcode } from 'html5-qrcode';
import { BarCodeScanner } from 'expo-barcode-scanner';

const { width } = Dimensions.get('window');

export default function TabletScannerPage() {
  const [manualCode, setManualCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (showScanner) {
      if (Platform.OS === 'web') {
        initializeWebScanner();
      } else {
        initializeNativeScanner();
      }
    }

    return () => {
      stopScanner();
    };
  }, [showScanner]);

  const initializeWebScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);

      const scanner = new Html5Qrcode('reader');
      scannerRef.current = scanner;

      await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            handleQRCode(decodedText);
          },
          (error) => {
            console.warn(error);
          }
      );
    } catch (err) {
      console.error('Scanner error:', err);
      setShowScanner(false);
    }
  };

  const initializeNativeScanner = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  };

  const stopScanner = () => {
    if (Platform.OS === 'web' && scannerRef.current) {
      try {
        scannerRef.current.stop().catch(console.error);
        scannerRef.current = null;
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  const handleManualSubmit = () => {
    if (manualCode) {
      alert(`Manually entered code: ${manualCode}`);
      setManualCode('');
    } else {
      alert('Please enter a code');
    }
  };

  const openScanner = () => {
    setShowScanner(true);
  };

  const handleQRCode = (data: string) => {
    alert(`QR Code scanned: ${data}`);
    closeScanner();
  };

  const closeScanner = () => {
    stopScanner();
    setShowScanner(false);
  };

  const handleBarCodeScanned = ({ data }) => {
    handleQRCode(data);
  };

  const renderScanner = () => {
    if (Platform.OS === 'web') {
      return (
          <div className="scanner-container" style={{
            width: '100%',
            maxWidth: '600px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <div id="reader" style={{
              width: '100%',
              height: '400px',
              marginBottom: '20px'
            }} />
            <button
                onClick={closeScanner}
                style={{
                  backgroundColor: '#F4804F',
                  color: 'white',
                  padding: '12px 30px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
            >
              Close Scanner
            </button>
          </div>
      );
    } else {
      return (
          <View style={styles.scannerContainer}>
            <BarCodeScanner
                onBarCodeScanned={handleBarCodeScanned}
                style={styles.camera}
                barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
            />
            <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={closeScanner}
            >
              <Text style={styles.buttonText}>Close Scanner</Text>
            </TouchableOpacity>
          </View>
      );
    }
  };

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
              renderScanner()
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
                <TouchableOpacity style={styles.button} onPress={openScanner}>
                  <Text style={styles.buttonText}>Scan QR Code</Text>
                </TouchableOpacity>
              </View>
          )}
        </View>
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  scannerContainer: {
    width: width * 0.8,
    aspectRatio: 1,
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    bottom: -60,
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
  button: {
    backgroundColor: '#F4804F',
    height: 48,
    borderRadius: 8,
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});