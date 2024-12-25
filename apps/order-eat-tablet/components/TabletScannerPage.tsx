import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Linking, Modal } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

const { width } = Dimensions.get('window');

// Custom Alert Component
const CustomAlert = ({ visible, url, onNavigate, onRetake, onCancel }) => (
    <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>QR Code Detected</Text>
          <Text style={styles.alertMessage}>Would you like to navigate to:</Text>
          <Text style={styles.urlText}>{url}</Text>
          <View style={styles.alertButtonContainer}>
            <TouchableOpacity
                style={[styles.alertButton, styles.navigateButton]}
                onPress={onNavigate}
            >
              <Text style={styles.alertButtonText}>Navigate</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.alertButton, styles.retakeButton]}
                onPress={onRetake}
            >
              <Text style={styles.alertButtonText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.alertButton, styles.cancelButton]}
                onPress={onCancel}
            >
              <Text style={styles.alertButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
);

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
          placeholder="Enter URL manually"
          keyboardType="url"
          autoCapitalize="none"
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
const useScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [scannedUrl, setScannedUrl] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openScanner = () => {
    setShowScanner(true);
    setScanned(false);
    setShowAlert(false);
    setScannedUrl('');
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanned(false);
    setShowAlert(false);
    setScannedUrl('');
  };

  const handleUrl = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('Cannot open this URL');
      }
    } catch (error) {
      alert('An error occurred while opening the URL');
    }
  };

  return {
    showScanner,
    hasPermission,
    scanned,
    showAlert,
    scannedUrl,
    setScanned,
    setShowAlert,
    setScannedUrl,
    openScanner,
    closeScanner,
    handleUrl,
  };
};

// Main component
export default function TabletScannerPage() {
  const [manualCode, setManualCode] = useState('');
  const {
    showScanner,
    hasPermission,
    scanned,
    showAlert,
    scannedUrl,
    setScanned,
    setShowAlert,
    setScannedUrl,
    openScanner,
    closeScanner,
    handleUrl,
  } = useScanner();

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setScannedUrl(data);
      setShowAlert(true);
    }
  };

  const handleNavigate = () => {
    handleUrl(scannedUrl);
    closeScanner();
  };

  const handleRetake = () => {
    setScanned(false);
    setShowAlert(false);
    setScannedUrl('');
  };

  const handleCancel = () => {
    closeScanner();
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      setScannedUrl(manualCode);
      setShowAlert(true);
      setManualCode('');
    } else {
      alert('Please enter a URL');
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
        <CustomAlert
            visible={showAlert}
            url={scannedUrl}
            onNavigate={handleNavigate}
            onRetake={handleRetake}
            onCancel={handleCancel}
        />
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
    justifyContent: 'center',
    alignItems: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: width * 0.8,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 10,
  },
  urlText: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButtonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
  },
  alertButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigateButton: {
    backgroundColor: '#007AFF',
  },
  retakeButton: {
    backgroundColor: '#F4804F',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  alertButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});