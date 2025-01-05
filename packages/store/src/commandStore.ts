import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Restaurant, MenuItem } from './restaurantStore.js';

const STORAGE_KEY = 'order-eat-reservations';

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

// Mock reservation data for fallback
const MOCK_RESERVATIONS: Record<string, Command> = {
    "mock_reservation_1": {
        id: "mock_reservation_1",
        userId: "user123",
        status: "confirmed",
        type: "dinein",
        totalAmount: 89.97,
        restaurant: {
            id: "1",
            name: "Pizza De La Mama",
            type: "Italian",
            address: "123 avenue Saint-Philippe, 06410 BIOT",
            description: "Authentic Italian pizzas and pasta made with love and tradition.",
            shortDescription: "Pizza - Pasta - Tiramisu",
            rating: 4.7,
            categoryId: "c1",
            images: [
                "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D",
                "https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg",
                "https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg"
            ],
            latitude: 43.623428,
            longitude: 7.046175,
            time: "20 min",
            menuItems: []
        },
        menuItems: [
            {
                id: "p2",
                name: "Pepperoni Pizza",
                price: 14.99,
                description: "Pizza topped with pepperoni and mozzarella",
                preparationTime: 20,
                quantity: 3,
                foodCategoryId: "f1",
                mealTypeId: "m1",
                images: [],
                allergens: [],
                keyIngredients: [],
                nutrition: {},
                sizes: []
            },
            {
                id: "p1",
                name: "Pizza Calzone European",
                price: 32,
                description: "Pizza folded in half with chicken, mushrooms, and cheese",
                preparationTime: 20,
                quantity: 1,
                selectedSize: "14\"",
                foodCategoryId: "f1",
                mealTypeId: "m1",
                images: [],
                allergens: [],
                keyIngredients: [],
                nutrition: {},
                sizes: []
            }
        ],
        reservationDetails: {
            date: "01/05/2025",
            time: "13:30",
            numberOfPersons: 4,
            type: "dinein",
            wantToPreOrder: false
        }
    }
};

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
    getCommandById: (commandId: string) => Promise<Command | undefined>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const saveToStorage = async (commands: Record<string, Command>) => {
    try {
        const jsonValue = JSON.stringify(commands);
        await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
        console.log('Successfully saved to storage');
    } catch (error) {
        console.error('Error saving to storage:', error);
    }
};

const loadFromStorage = async (): Promise<Record<string, Command>> => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (error) {
        console.error('Error loading from storage:', error);
        return {};
    }
};

// Initialize storage
let reservationsDB: Record<string, Command> = {};
loadFromStorage().then(data => {
    reservationsDB = data;
    console.log('Loaded reservations from storage:', Object.keys(data).length);
});

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
        const newCommand = { ...command, id };

        reservationsDB[id] = newCommand;
        saveToStorage(reservationsDB);
        console.log('Added new command:', newCommand);

        set((state) => ({
            pendingCommands: [...state.pendingCommands, newCommand],
            currentCommand: { ...command, id },
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

            reservationsDB[commandId] = confirmedCommand;
            saveToStorage(reservationsDB);
            console.log('Updated command:', confirmedCommand);

            return {
                pendingCommands: state.pendingCommands.filter(cmd => cmd.id !== commandId),
                currentCommand: null,
                confirmedCommands: [...state.confirmedCommands, confirmedCommand]
            };
        }),

    async getCommandById(commandId) {
        console.log('Searching for command:', commandId);

        // Check storage first
        const stored = await loadFromStorage();
        const command = stored[commandId];

        if (command) {
            console.log('Found command in storage:', command);

            // Update local state
            set(state => ({
                confirmedCommands: [
                    ...state.confirmedCommands.filter(cmd => cmd.id !== commandId),
                    command
                ]
            }));

            return command;
        }

        console.log('Command not found in storage, returning mock data');
        return MOCK_RESERVATIONS.mock_reservation_1;
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

