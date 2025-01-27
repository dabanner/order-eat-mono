import { create } from 'zustand';
import { Restaurant, MenuItem } from './restaurantStore.js';

export interface WaitstaffRequest {
  type: 'checkout' | 'water' | 'other';
  status: 'pending' | 'completed';
  timestamp: string;
}

interface DetailedNutritionInfo {
    fiber: number;
    servingSize: string;
    description: string;
    details: {
        totalFat: {
            value: number;
            saturatedFat: number;
            transFat: number;
        };
        totalCarbohydrates: {
            value: number;
            fiber: number;
            sugars: number;
        };
        protein: {
            value: number;
            source: string;
        };
        minerals: {
            sodium: number;
            potassium: number;
            calcium: number;
            iron: number;
        };
        vitamins: {
            vitaminA: number;
            vitaminC: number;
            vitaminD: number;
        };
    };
}

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
  menuItems: (MenuItem & { quantity: number; paid: boolean; submitted: boolean })[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  type: 'takeaway' | 'dinein';
  waitstaffRequests: WaitstaffRequest[];
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
    confirmCommand: (commandId: string) => void;
    getCommandById: (commandId: string) => Command | undefined;
    toggleItemPaidStatus: (itemId: string) => void;
    addWaitstaffRequest: (type: WaitstaffRequest['type']) => void;
    completeWaitstaffRequest: (timestamp: string) => void;
    toggleItemSubmittedStatus: (itemId: string) => void;
    submitUnsubmittedItems: () => void;
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

    addMenuItem: (item: MenuItem) =>
    set((state) => {
      if (!state.currentCommand) return state;
      
      // Create a new entry for the item
      const newItem = { ...item, quantity: 1, paid: false, submitted: false };
      
      const updatedMenuItems = [...state.currentCommand.menuItems, newItem];
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

    addCommand: (command) => {
        const id = generateId();
        const newCommand = { ...command, id };

        set((state) => ({
            pendingCommands: [...state.pendingCommands, newCommand],
            currentCommand: newCommand,
        }));

        return id;
    },

    confirmCommand: (commandId) =>
        set((state) => {
            const commandToConfirm = state.pendingCommands.find(cmd => cmd.id === commandId) ||
                state.currentCommand;

            if (!commandToConfirm) return state;

            const confirmedCommand = {
                ...commandToConfirm,
                status: 'confirmed' as const
            };

            return {
                pendingCommands: state.pendingCommands.filter(cmd => cmd.id !== commandId),
                currentCommand: null,
                confirmedCommands: [...state.confirmedCommands, confirmedCommand]
            };
      }),

    getCommandById(commandId) {
      const commands = [...this.pendingCommands, ...this.confirmedCommands]

      return commands.find((command)=> command.id === commandId)
    },

    toggleItemPaidStatus: (itemId: string) =>
    set((state) => {
      if (!state.currentCommand) return state;
      const updatedMenuItems = state.currentCommand.menuItems.map((item) =>
        item.id === itemId ? { ...item, paid: !item.paid } : item
      );
      const updatedCommand = {
        ...state.currentCommand,
        menuItems: updatedMenuItems,
      };
      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),

    addWaitstaffRequest: (type: WaitstaffRequest['type']) =>
    set((state) => {
      if (!state.currentCommand) return state;

    const newRequest: WaitstaffRequest = {
      type,
      status: 'pending' as 'pending',
      timestamp: new Date().toISOString(),
    };

      const updatedCommand = {
        ...state.currentCommand,
        waitstaffRequests: [
          ...(state.currentCommand.waitstaffRequests || []),
          newRequest,
        ],
      };

      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),

  completeWaitstaffRequest: (timestamp: string) =>
    set((state) => {
      if (!state.currentCommand) return state;

    const updatedCommand = {
      ...state.currentCommand,
      waitstaffRequests: state.currentCommand.waitstaffRequests?.map((request) =>
        request.timestamp === timestamp
          ? { ...request, status: 'completed' as 'completed' }
          : request
      ) || [],
    };

      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),
    toggleItemSubmittedStatus: (itemId: string) =>
    set((state) => {
      if (!state.currentCommand) return state;
      const updatedMenuItems = state.currentCommand.menuItems.map((item) =>
        item.id === itemId && !item.paid ? { ...item, submitted: !item.submitted } : item
      );
      const updatedCommand = {
        ...state.currentCommand,
        menuItems: updatedMenuItems,
      };
      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),

    submitUnsubmittedItems: () =>
    set((state) => {
      if (!state.currentCommand) return state;
      const updatedMenuItems = state.currentCommand.menuItems.map((item) =>
        !item.submitted ? { ...item, submitted: true } : item
      );
      const updatedCommand = {
        ...state.currentCommand,
        menuItems: updatedMenuItems,
      };
      return {
        currentCommand: updatedCommand,
        pendingCommands: state.pendingCommands.map((command) =>
          command.id === updatedCommand.id ? updatedCommand : command
        ),
      };
    }),
}));

