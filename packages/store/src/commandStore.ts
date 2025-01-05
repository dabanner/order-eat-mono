import { create } from 'zustand';
import { Restaurant, MenuItem } from './restaurantStore.js';

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
    menuItems: (MenuItem & { quantity: number })[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    type: 'takeaway' | 'dinein';
}

// Mock reservation data
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
                description: "Pizza topped with pepperoni and mozzarella",
                price: 14.99,
                images: [
                    "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
                ],
                foodCategoryId: "f1",
                mealTypeId: "m1",
                preparationTime: 20,
                quantity: 3,
                sizes: ["10\"", "14\"", "16\""],
                keyIngredients: [
                    { name: "Pepperoni", icon: "drumstick-bite", isAllergy: false },
                    { name: "Mozzarella", icon: "cheese", isAllergy: true },
                    { name: "Tomato Sauce", icon: "pepper-hot", isAllergy: false }
                ],
                allergens: ["dairy", "gluten", "pork"],
                nutrition: {
                    carbs: 65,
                    proteins: 18,
                    calories: 750,
                    fats: 12,
                    fiber: 2,
                    servingSize: "14\" pizza (300g serving)",
                    description: "Our classic Pepperoni Pizza is a perfect balance of flavors, featuring our signature tomato sauce, mozzarella cheese, and premium pepperoni slices on our hand-tossed crust.",
                    details: {
                        totalFat: {
                            value: 12,
                            saturatedFat: 5,
                            transFat: 0
                        },
                        totalCarbohydrates: {
                            value: 65,
                            fiber: 2,
                            sugars: 4
                        },
                        protein: {
                            value: 18,
                            source: "mozzarella cheese and pepperoni"
                        },
                        minerals: {
                            sodium: 1200,
                            potassium: 280,
                            calcium: 20,
                            iron: 15
                        },
                        vitamins: {
                            vitaminA: 10,
                            vitaminC: 8,
                            vitaminD: 4
                        }
                    }
                }
            },
            {
                id: "p1",
                name: "Pizza Calzone European",
                description: "Pizza folded in half with chicken, mushrooms, and cheese",
                price: 32,
                images: [
                    "https://cdn.tasteatlas.com/Images/Dishes/2bfdf993487d4995b8ed4ce3e99c5703.jpg"
                ],
                foodCategoryId: "f1",
                mealTypeId: "m1",
                preparationTime: 20,
                quantity: 1,
                selectedSize: "14\"",
                sizes: ["10\"", "14\"", "16\""],
                keyIngredients: [
                    { name: "Chicken", icon: "drumstick-bite", isAllergy: false },
                    { name: "Mushrooms", icon: "seedling", isAllergy: false },
                    { name: "Mozzarella", icon: "cheese", isAllergy: true }
                ],
                allergens: ["dairy", "gluten"],
                nutrition: {
                    carbs: 89,
                    proteins: 12.2,
                    calories: 850,
                    fats: 10.4,
                    fiber: 2.5,
                    servingSize: "14\" calzone (350g serving)",
                    description: "This handcrafted Italian calzone delivers a perfect blend of proteins and carbohydrates.",
                    details: {
                        totalFat: {
                            value: 10.4,
                            saturatedFat: 4.2,
                            transFat: 0
                        },
                        totalCarbohydrates: {
                            value: 89,
                            fiber: 2.5,
                            sugars: 3.2
                        },
                        protein: {
                            value: 12.2,
                            source: "free-range chicken and fresh mozzarella"
                        },
                        minerals: {
                            sodium: 980,
                            potassium: 320,
                            calcium: 15,
                            iron: 10
                        },
                        vitamins: {
                            vitaminA: 8,
                            vitaminC: 12,
                            vitaminD: 6
                        }
                    }
                }
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
    getCommandById: (commandId: string) => Command | undefined;
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
        console.log('Searching for command:', commandId);
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