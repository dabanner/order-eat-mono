import { create } from 'zustand';
import { Restaurant, MenuItem } from './restaurantStore.js';

export interface ReservationDetails {
  date: string;
  time: string;
  numberOfPersons: number;
  isIndoor: boolean;
}

export interface Command {
  id?: string;
  restaurant: Restaurant;
  userId: string;
  reservationDetails: ReservationDetails;
  menuItems: (MenuItem & { quantity: number })[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface CommandStore {
  currentCommand: Command | null;
  setCurrentCommand: (command: Command | null) => void;
  updateReservationDetails: (details: Partial<ReservationDetails>) => void;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (itemId: string) => void;
  updateMenuItemQuantity: (itemId: string, quantity: number) => void;
  clearCommand: () => void;
}

export const useCommandStore = create<CommandStore>((set) => ({
  currentCommand: null,
  setCurrentCommand: (command) => set({ currentCommand: command }),
  updateReservationDetails: (details) =>
    set((state) => ({
      currentCommand: state.currentCommand
        ? {
            ...state.currentCommand,
            reservationDetails: { ...state.currentCommand.reservationDetails, ...details },
          }
        : null,
    })),
  addMenuItem: (item) =>
    set((state) => {
      if (!state.currentCommand) return { currentCommand: null };
      const existingItem = state.currentCommand.menuItems.find((i) => i.id === item.id);
      let updatedMenuItems;
      if (existingItem) {
        updatedMenuItems = state.currentCommand.menuItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updatedMenuItems = [...state.currentCommand.menuItems, { ...item, quantity: 1 }];
      }
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        currentCommand: {
          ...state.currentCommand,
          menuItems: updatedMenuItems,
          totalAmount,
        },
      };
    }),
  removeMenuItem: (itemId) =>
    set((state) => {
      if (!state.currentCommand) return { currentCommand: null };
      const updatedMenuItems = state.currentCommand.menuItems.filter((item) => item.id !== itemId);
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        currentCommand: {
          ...state.currentCommand,
          menuItems: updatedMenuItems,
          totalAmount,
        },
      };
    }),
  updateMenuItemQuantity: (itemId, quantity) =>
    set((state) => {
      if (!state.currentCommand) return { currentCommand: null };
      const updatedMenuItems = state.currentCommand.menuItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      return {
        currentCommand: {
          ...state.currentCommand,
          menuItems: updatedMenuItems,
          totalAmount,
        },
      };
    }),
  clearCommand: () => set({ currentCommand: null }),
}));

