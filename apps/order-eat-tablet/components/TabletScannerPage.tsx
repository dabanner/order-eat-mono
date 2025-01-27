import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Dimensions, Modal, Alert, ScrollView } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { ReservationData, CustomAlertProps, NativeScannerProps, ManualEntryProps, ScannerHook, StylesType } from './types';
import { useRouter } from 'expo-router';
import { Command, useCommandStore } from '@repo/store/src/commandStore';
import { MenuItem, useRestaurantStore } from '@repo/store/src/restaurantStore';

const { width, height } = Dimensions.get('window');

const colors: Record<string, string> = {
  orange: '#FF7622',
  onyx: '#121223',
  evergreen: '#059C6A',
  lightSlate: '#A0A5BA',
  dorian: '#F0F5FA',
  cloud: '#FAFCFE',
};

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, data, onConfirm, onRetake, onCancel, isLoading }) => {
  let reservationData: any = null;
  try {
    reservationData = JSON.parse(data || '{}');
  } catch (error) {
    return null;
  }

  if (!data) return null;

  const timeDisplay = reservationData.reservationDetails?.time || reservationData.reservationTime || '13:30';
  const dateDisplay = reservationData.reservationDetails?.date || '01/05/2025';

  return (
      <Modal
          transparent={true}
          visible={visible}
          animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.alertBox}>
              <Text style={styles.alertTitle}>Reservation Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID:</Text>
                <Text style={styles.detailText}>{reservationData.id}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date:</Text>
                <Text style={styles.detailText}>{dateDisplay}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Time:</Text>
                <Text style={styles.detailText}>{timeDisplay}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status:</Text>
                <Text style={[styles.detailText, styles.statusText]}>
                  {reservationData.status}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type:</Text>
                <Text style={styles.detailText}>
                  {reservationData.type === 'dinein' ? 'Dine In' : 'Take Away'}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Persons:</Text>
                <Text style={styles.detailText}>
                  {reservationData.reservationDetails?.numberOfPersons || 4}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Items:</Text>
                <Text style={styles.detailText}>
                  {reservationData.menuItems?.length || reservationData.itemCount || 0} items
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount:</Text>
                <Text style={styles.detailText}>
                  ${reservationData.totalAmount.toFixed(2)}
                </Text>
              </View>

              {reservationData.menuItems && reservationData.menuItems.length > 0 && (
                  <View style={styles.menuItemsContainer}>
                    <Text style={styles.menuItemsTitle}>Order Details:</Text>
                    {reservationData.menuItems.map((item: any, index: number) => (
                        <View key={index} style={styles.menuItem}>
                          <Text style={styles.menuItemName}>
                            {item.name} x{item.quantity}
                          </Text>
                          <Text style={styles.menuItemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Text>
                        </View>
                    ))}
                  </View>
              )}

              <View style={styles.alertButtonContainer}>
                <TouchableOpacity
                    style={[styles.alertButton, styles.navigateButton]}
                    onPress={onConfirm}
                    disabled={isLoading}
                >
                  <Text style={styles.alertButtonText}>
                    {isLoading ? 'Processing...' : 'Confirm'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.alertButton, styles.retakeButton]}
                    onPress={onRetake}
                    disabled={isLoading}
                >
                  <Text style={styles.alertButtonText}>Scan Again</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.alertButton, styles.cancelButton]}
                    onPress={onCancel}
                    disabled={isLoading}
                >
                  <Text style={styles.alertButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>
  );
};

const NativeScanner: React.FC<NativeScannerProps> = ({ onScan, onClose, scanned }) => (
    <View style={styles.scannerContainer}>
      <View style={styles.scanFrameContainer}>
        <View style={styles.cameraWrapper}>
          <CameraView
              style={styles.camera}
              onBarcodeScanned={scanned ? undefined : onScan}
              barcodeScannerSettings={{
                barcodeTypes: ['qr'],
              }}
          />
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onClose}>
        <Text style={styles.buttonText}>Close Scanner</Text>
      </TouchableOpacity>
    </View>
);

const ManualEntry: React.FC<ManualEntryProps> = ({ code, onCodeChange, onSubmit, onScannerOpen }) => (
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

const useScanner = (): ScannerHook => {
  const [showScanner, setShowScanner] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [scannedData, setScannedData] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const openScanner = (): void => {
    setShowScanner(true);
    setScanned(false);
    setShowAlert(false);
    setScannedData('');
  };

  const closeScanner = (): void => {
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

export default function TabletScannerPage(): JSX.Element {
  const [manualCode, setManualCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const router = useRouter();

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }): Promise<void> => {
  if (scanned) return;

  try {
    console.log('Scanned QR data:', data);
    const parsedData = JSON.parse(data);
    console.log('Parsed QR data:', parsedData);

    // Validate required fields
    const requiredFields = ['id', 'tableOrderId', 'userId', 'restaurantId', 
      'reservationTime', 'status', 'type', 'itemCount', 'totalAmount'];
    
    if (!requiredFields.every(field => field in parsedData)) {
      throw new Error('Missing required reservation fields');
    }

    // Fetch table order data
    const tableOrderResponse = await fetch(
      `https://adaptation.chhilif.com/dining/tableOrders/${parsedData.tableOrderId}`
    );
    
    if (!tableOrderResponse.ok) {
      throw new Error(`HTTP error! status: ${tableOrderResponse.status}`);
    }

    const tableOrderData = await tableOrderResponse.json();
    console.log('Table order data:', tableOrderData);

    // Get restaurant store data
    const restaurantStore = useRestaurantStore.getState();
    const restaurant = restaurantStore.restaurants.find(r => r.id === parsedData.restaurantId);
    
    if (!restaurant) {
      throw new Error('Restaurant not found in store');
    }

    // Create a map to count item quantities from lines
    const itemCountMap = tableOrderData.lines.reduce((acc: Record<string, number>, line: any) => {
      const itemId = line.item._id;
      acc[itemId] = (acc[itemId] || 0) + line.howMany;
      return acc;
    }, {});

    // Map to menu items with quantities
    const menuItemsWithQuantity = Object.entries(itemCountMap)
      .map(([itemId, quantity]) => {
        // Find matching menu item by ID or shortName
        const lineItem = tableOrderData.lines.find((line: any) => line.item._id === itemId)?.item;
        const menuItem = restaurant.menuItems.find(
          mi => mi.id === itemId || mi.shortName === lineItem?.shortName
        );

        if (!menuItem) {
          console.warn(`MenuItem not found for line item ID: ${itemId}`);
          return null;
        }

        return {
          ...menuItem,
          quantity,
          paid: false,
          submitted: false,
        };
      })
      .filter(Boolean) as (MenuItem & { quantity: number; paid: boolean; submitted: boolean })[];

    // Construct full command data
    const fullReservation: Command = {
      id: parsedData.id,
      userId: parsedData.userId,
      restaurant: {
        ...restaurant,
        address: restaurant.address || '',
        latitude: restaurant.latitude || 0,
        longitude: restaurant.longitude || 0,
      },
      reservationDetails: {
        time: parsedData.reservationTime,
        date: new Date().toISOString().split('T')[0],
        numberOfPersons: tableOrderData.customersCount || 4,
        type: 'dinein',
        wantToPreOrder: true,
      },
      menuItems: menuItemsWithQuantity,
      totalAmount: parsedData.totalAmount,
      status: parsedData.status,
      type: parsedData.type,
      waitstaffRequests: [],
    };

    // Update command store
    useCommandStore.getState().setCurrentCommand(fullReservation);
    
    console.log('Full reservation data:', fullReservation);
    setScannedData(JSON.stringify(fullReservation));
    setScanned(true);
    setShowAlert(true);

  } catch (error) {
    console.error('Error processing QR code:', error);
    setScanned(true);
    Alert.alert(
      'Invalid QR Code',
      'Failed to process reservation. Please check the QR code and try again.',
      [{
        text: 'OK',
        onPress: () => {
          setScanned(false);
          closeScanner();
        }
      }],
      { cancelable: false }
    );
  }
};

  const handleConfirm = async (): Promise<void> => {
    setIsLoading(true);
    const reservationData = JSON.parse(scannedData);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Reservation confirmed:', reservationData);
      Alert.alert(
          'Success',
          'Reservation confirmed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                router.push(`/restaurant?id=${reservationData.restaurantId}`);
              }
            }
          ]
      );
    } catch (error) {
      console.error('Error confirming reservation:', error);
      Alert.alert('Error', 'Failed to confirm reservation. Please try again.');
    } finally {
      setIsLoading(false);
      closeScanner();
      router.push(`/restaurant?id=${reservationData.restaurantId}`);
    }
  };

  const handleRetake = (): void => {
    setScanned(false);
    setShowAlert(false);
    setScannedData('');
  };

  const handleCancel = (): void => {
    closeScanner();
  };

  const handleManualSubmit = (): void => {
    if (manualCode.trim()) {
      try {
        const parsedData = JSON.parse(manualCode) as ReservationData;
        const requiredFields: (keyof ReservationData)[] = ['id', 'restaurantId', 'reservationTime', 'status', 'type', 'itemCount', 'totalAmount'];

        if (!requiredFields.every(field => field in parsedData)) {
          throw new Error('Missing required reservation fields');
        }

        setScannedData(manualCode);
        setShowAlert(true);
        setManualCode('');
      } catch (error) {
        Alert.alert(
            'Invalid Code',
            'Please enter a valid reservation code.',
            [{ text: 'OK' }],
            { cancelable: false }
        );
      }
    } else {
      Alert.alert(
          'Empty Code',
          'Please enter a reservation code.',
          [{ text: 'OK' }],
          { cancelable: false }
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
        <View style={styles.logoContainer}>
          <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          {showScanner ? (
              <>
                <Text style={styles.scannerTitle}>Scan QR Code Of Your Order</Text>
                <NativeScanner
                    onScan={handleBarCodeScanned}
                    onClose={closeScanner}
                    scanned={scanned}
                />
              </>
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
            isLoading={isLoading}
        />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoImage: {
    width: width * 0.6,
    height: 120,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scannerContainer: {
    width: width * 0.9,
    alignItems: 'center',
  },
  scanFrameContainer: {
    width: Math.min(width * 0.9, height * 0.5),
    aspectRatio: 1,
    marginBottom: 20,
  },
  cameraWrapper: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.dorian,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height : '100%',
  },
  cornerTL: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderColor: colors.orange,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 20,
  },
  cornerTR: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 40,
    height: 40,
    borderColor: colors.orange,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 20,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 40,
    height: 40,
    borderColor: colors.orange,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 20,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 40,
    height: 40,
    borderColor: colors.orange,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 20,
  },
  manualEntryContainer: {
    width: width * 0.8,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 180,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: "#b8b8b8",
    borderColor: colors.orange,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.orange,
    height: 48,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 30,
    margin: 10,
    minWidth: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  scannerTitle: {
    fontSize: 18,
    color: colors.onyx,
    textAlign: 'center',
    marginBottom: 20,
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
    color: colors.evergreen,
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
    backgroundColor: colors.evergreen,
  },
  retakeButton: {
    backgroundColor: colors.orange,
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
  alertButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuItemsContainer: {
    width: '100%',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 16,
  },
  menuItemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  menuItemName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  menuItemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.orange,
  },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
});