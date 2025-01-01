import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { Camera, CameraView } from 'expo-camera';

const { width } = Dimensions.get('window');

const CustomAlert = ({ visible, data, onConfirm, onRetake, onCancel }) => {
  let reservationData;
  try {
    reservationData = JSON.parse(data || '{}');
    console.log("reservation data : ", reservationData);
  } catch (error) {
    return null;
  }

  if (!data) return null;

  return (
      <Modal
          transparent={true}
          visible={visible}
          animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertBox}>
            <Text style={styles.alertTitle}>Reservation Details</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>ID:</Text>
              <Text style={styles.detailText}>{reservationData.id}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailText}>
                {new Date(reservationData.reservationTime).toLocaleString()}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text style={[styles.detailText, styles.statusText]}>
                {reservationData.status}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Type:</Text>
              <Text style={styles.detailText}>{reservationData.type}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Items:</Text>
              <Text style={styles.detailText}>{reservationData.itemCount}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount:</Text>
              <Text style={styles.detailText}>
                ${reservationData.totalAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.alertButtonContainer}>
              <TouchableOpacity
                  style={[styles.alertButton, styles.navigateButton]}
                  onPress={onConfirm}
              >
                <Text style={styles.alertButtonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                  style={[styles.alertButton, styles.retakeButton]}
                  onPress={onRetake}
              >
                <Text style={styles.alertButtonText}>Scan Again</Text>
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
};

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

const ManualEntry = ({ code, onCodeChange, onSubmit, onScannerOpen }) => (
    <View style={styles.manualEntryContainer}>
      <TextInput
          style={styles.input}
          onChangeText={onCodeChange}
          value={code}
          placeholder="Enter reservation code manually"
          keyboardType="default"
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

const useScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [scannedData, setScannedData] = useState('');

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
    setScannedData('');
  };

  const closeScanner = () => {
    setShowScanner(false);
    setScanned(false);
    setShowAlert(false);
    setScannedData('');
  };

  return {
    showScanner,
    hasPermission,
    scanned,
    showAlert,
    scannedData,
    setScanned,
    setShowAlert,
    setScannedData,
    openScanner,
    closeScanner,
  };
};

export default function TabletScannerPage() {
  const [manualCode, setManualCode] = useState('');
  const {
    showScanner,
    hasPermission,
    scanned,
    showAlert,
    scannedData,
    setScanned,
    setShowAlert,
    setScannedData,
    openScanner,
    closeScanner,
  } = useScanner();

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;

    try {
      const parsedData = JSON.parse(data);
      const requiredFields = ['id', 'reservationTime', 'status', 'type', 'itemCount', 'totalAmount'];

      if (!requiredFields.every(field => field in parsedData)) {
        throw new Error('Missing required reservation fields');
      }

      setScanned(true);
      setScannedData(data);
      setShowAlert(true);
    } catch (error) {
      alert('Invalid reservation QR code');
      setScanned(false);
    }
  };

  const handleConfirm = () => {
    console.log('Reservation confirmed:', JSON.parse(scannedData));
    closeScanner();
  };

  const handleRetake = () => {
    setScanned(false);
    setShowAlert(false);
    setScannedData('');
  };

  const handleCancel = () => {
    closeScanner();
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      try {
        const parsedData = JSON.parse(manualCode);
        const requiredFields = ['id', 'reservationTime', 'status', 'type', 'itemCount', 'totalAmount'];

        if (!requiredFields.every(field => field in parsedData)) {
          throw new Error('Missing required reservation fields');
        }

        setScannedData(manualCode);
        setShowAlert(true);
        setManualCode('');
      } catch (error) {
        alert('Invalid reservation code format');
      }
    } else {
      alert('Please enter a reservation code');
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
            data={scannedData}
            onConfirm={handleConfirm}
            onRetake={handleRetake}
            onCancel={handleCancel}
        />
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  statusText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  alertButtonContainer: {
    width: '100%',
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
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