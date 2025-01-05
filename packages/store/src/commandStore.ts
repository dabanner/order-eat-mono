import { create } from 'zustand';
import { Restaurant, MenuItem } from './restaurantStore.js';

export interface ReservationDetails {
  date: string;
  time: string;
  numberOfPersons: number;
  type: 'takeaway' | 'dinein';
  wantToPreOrder: boolean;
}

export interface Command {
  id?: string;
  restaurant: Restaurant;
  userId: string;
  reservationDetails: ReservationDetails;
  menuItems: (MenuItem & { quantity: number })[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'takeaway' | 'dinein';
}

interface CommandStore {
  currentCommand: Command | null;
  pendingCommands: Command[];
  confirmedCommands: Command[];
  setCurrentCommand: (command: Command | null) => void;
  updateReservationDetails: (commandId: string, details: Partial<ReservationDetails>) => void;
  addMenuItem: (item: MenuItem) => void;
  removeMenuItem: (itemId: string) => void;
  updateMenuItemQuantity: (itemId: string, quantity: number) => void;
  clearCommand: () => void;
  addCommand: (command: Omit<Command, 'id'>) => string;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useCommandStore = create<CommandStore>((set, get) => ({
  currentCommand: null,
  pendingCommands: [],
  confirmedCommands: [],
  setCurrentCommand: (command) => set({ currentCommand: command }),
  updateReservationDetails: (commandId, details) =>
    set((state) => ({
      pendingCommands: state.pendingCommands.map((command) =>
        command.id === commandId
          ? {
              ...command,
              reservationDetails: { ...command.reservationDetails, ...details },
            }
          : command
      ),
    })),
  addCommand: (command) => {
    const id = generateId();
    set((state) => ({
      pendingCommands: [...state.pendingCommands, { ...command, id }],
      currentCommand: { ...command, id },
    }));
    return id;
  },
  addMenuItem: (item) =>
    set((state) => {
      if (!state.currentCommand) return state;
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
      const updatedCommand = {
        ...state.currentCommand,
        menuItems: updatedMenuItems,
        totalAmount,
      };
      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),
  removeMenuItem: (itemId) =>
    set((state) => {
      if (!state.currentCommand) return state;
      const updatedMenuItems = state.currentCommand.menuItems.filter((item) => item.id !== itemId);
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedCommand = {
        ...state.currentCommand,
        menuItems: updatedMenuItems,
        totalAmount,
      };
      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),
  updateMenuItemQuantity: (itemId, quantity) =>
    set((state) => {
      if (!state.currentCommand) return state;
      const updatedMenuItems = state.currentCommand.menuItems.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      );
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const updatedCommand = {
        ...state.currentCommand,
        menuItems: updatedMenuItems,
        totalAmount,
      };
      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),
  clearCommand: () => set({ currentCommand: null }),
}));

