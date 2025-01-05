import { StyleProp, ViewStyle } from 'react-native';

export interface ReservationData {
  id: string;
  restaurantId: string;
  reservationTime: string;
  status: string;
  type: string;
  itemCount: number;
  totalAmount: number;
}

export interface CustomAlertProps {
  visible: boolean;
  data: string | null;
  onConfirm: () => void;
  onRetake: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export interface NativeScannerProps {
  onScan: (result: { type: string; data: string }) => void;
  onClose: () => void;
  scanned: boolean;
}

export interface ManualEntryProps {
  code: string;
  onCodeChange: (text: string) => void;
  onSubmit: () => void;
  onScannerOpen: () => void;
}

export interface ScannerHook {
  showScanner: boolean;
  hasPermission: boolean | null;
  scanned: boolean;
  showAlert: boolean;
  scannedData: string;
  setScanned: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setScannedData: React.Dispatch<React.SetStateAction<string>>;
  openScanner: () => void;
  closeScanner: () => void;
}

export interface StylesType {
  [key: string]: StyleProp<ViewStyle>;
}

