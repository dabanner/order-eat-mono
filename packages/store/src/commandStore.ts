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

// Mock reservation data
const MOCK_RESERVATIONS: Record<string, Command> = {
    "mock_reservation_1": {
        id: "ORDER-3630",
        userId: "KarimCHARLEUX",
        status: "confirmed",
        type: "dinein",
        totalAmount: 29.80,
        restaurant: {
            id: "1",
            name: "L'Alivia",
            type: 'Italian & Mediterranean',
            address: '123 avenue Saint-Philippe, 06410 BIOT',
            description: 'Experience authentic Italian and Mediterranean cuisine in a charming setting on the French Riviera.',
            shortDescription: 'Italian - Mediterranean - Pizza - Pasta',
            rating: 4.8,
            images: [
                require('@repo/ui/assets/images/restaurants/alivia/alivia-exterior.jpeg'),
                require('@repo/ui/assets/images/restaurants/alivia/alivia-interior.jpeg'),
                require('@repo/ui/assets/images/restaurants/alivia/alivia-terrace.jpeg'),
              ],
            latitude: 43.615632,
            longitude: 7.071891,
            time: "25 min",
            menuItems: []
        },
        menuItems: [
            {
                id: 'al_p1',
                quantity: 1,
                name: 'Margherita Royale',
                description: 'Our signature Margherita Royale showcases the finest Italian ingredients: creamy buffalo mozzarella DOP from Campania, hand-picked San Marzano tomatoes grown in the volcanic soils of Mount Vesuvius, fresh organic basil from our herb garden, and premium extra virgin olive oil from Tuscany. Each pizza is carefully crafted by our master pizzaiolo and baked to perfection in our wood-fired oven at 400°C, creating the perfect balance of flavors and textures with a slightly charred, pillowy crust.',
                descriptionForKids: 'A yummy pizza with melty cheese, sweet tomato sauce, and green basil leaves that look like little stars! 🌟 Just like in Italy! 🍕',
                price: 16.90,
                images: [
                require('@repo/ui/assets/images/restaurants/alivia/margherita-pizza-1.jpg'),
                require('@repo/ui/assets/images/restaurants/alivia/margherita-pizza-2.jpeg'),
                ],
                foodCategoryId: 'f1',
                mealTypeId: 'm1',
                preparationTime: 20,
                paid: true,
                submitted: true,
                sizes: ['S', 'M', 'L'],
                keyIngredients: [
                { name: 'Mozzarella', icon: 'cheese' },
                { name: 'Tomatoes', icon: 'seedling' },
                { name: 'Basil', icon: 'leaf' },
                { name: 'Olive Oil', icon: 'oil-can' }
                ],
                allergens: ['Milk', 'Gluten'],
                nutrition: {
                carbs: 42,
                proteins: 15,
                calories: 450,
                fats: 12,
                fiber: 2.5,
                servingSize: '30cm pizza',
                description: 'Our signature Margherita pizza combines premium ingredients for a classic Italian taste.',
                details: {
                    totalFat: { value: 12, saturatedFat: 5, transFat: 0 },
                    totalCarbohydrates: { value: 42, fiber: 2.5, sugars: 3 },
                    protein: { value: 15, source: 'buffalo mozzarella' },
                    minerals: { sodium: 680, potassium: 210, calcium: 25, iron: 8 },
                    vitamins: { vitaminA: 12, vitaminC: 15, vitaminD: 2 }
                }
                }
            },
            {
                id: 'al_f1',
                quantity: 1,
                name: 'Truffle Parmesan Fries',
                description: 'Hand-cut fries made from premium Agria potatoes, double-cooked to golden perfection in premium olive oil. Finished with shaved black truffle, aged Parmigiano Reggiano DOP, fresh parsley, and our signature truffle-infused sea salt. Served with a trio of house-made dipping sauces: black truffle aioli, roasted garlic mayonnaise, and spicy tomato coulis. Each portion is carefully arranged in a copper serving vessel lined with herb-scented paper.',
                descriptionForKids: 'Magic golden fries sprinkled with special cheese dust and fancy mushroom sparkles! They come with three yummy dipping sauces for extra fun! ✨🍟',
                price: 12.90,
                images: [
                  require('@repo/ui/assets/images/restaurants/alivia/truffle-fries-1.jpg'),
                ],
                foodCategoryId: 'f7',
                mealTypeId: 'm2',
                preparationTime: 10,
                sizes: ['Regular', 'Large'],
                paid: true,
                submitted: true,
                keyIngredients: [
                  { name: 'Potatoes', icon: 'carrot' },
                  { name: 'Truffle', icon: 'mushroom' },
                  { name: 'Parmesan', icon: 'cheese' },
                  { name: 'Herbs', icon: 'leaf' }
                ],
                allergens: ['Milk', 'Eggs'],
                nutrition: {
                  carbs: 48,
                  proteins: 8,
                  calories: 420,
                  fats: 22,
                  fiber: 4,
                  servingSize: '200g',
                  description: 'Premium hand-cut fries with truffle and parmesan.',
                  details: {
                    totalFat: { value: 22, saturatedFat: 6, transFat: 0 },
                    totalCarbohydrates: { value: 48, fiber: 4, sugars: 1 },
                    protein: { value: 8, source: 'cheese and potato' },
                    minerals: { sodium: 580, potassium: 820, calcium: 180, iron: 2 },
                    vitamins: { vitaminA: 4, vitaminC: 28, vitaminD: 1 }
                  }
                }
              },
        ],
        waitstaffRequests: [],
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
  commands: Record<string, Command>
  addCommand: (sectionId: string, command: Omit<Command, "id">) => string
  updateCommand: (sectionId: string, commandId: string, updates: Partial<Command>) => void
  removeCommand: (sectionId: string, commandId: string) => void
  getCommandBySection: (sectionId: string) => Command | undefined
  addMenuItem: (sectionId: string, item: MenuItem) => void
  removeMenuItem: (sectionId: string, itemId: string) => void
  updateMenuItemQuantity: (sectionId: string, itemId: string, quantity: number) => void
  toggleItemPaidStatus: (sectionId: string, itemId: string) => void
  toggleItemSubmittedStatus: (sectionId: string, itemId: string) => void
  submitUnsubmittedItems: (sectionId: string) => void
  addWaitstaffRequest: (sectionId: string, type: WaitstaffRequest["type"]) => void
  completeWaitstaffRequest: (sectionId: string, timestamp: string) => void
}

const generateId = () => Math.random().toString(36).substr(2, 9)

export const useCommandStore = create<CommandStore>((set, get) => ({
  commands: {},

  addCommand: (sectionId, command) => {
    const id = generateId()
    const newCommand = { ...command, id }
    set((state) => ({
      commands: {
        ...state.commands,
        [sectionId]: newCommand,
      },
    }))
    return id
  },

  updateCommand: (sectionId, commandId, updates) => {
    set((state) => ({
      commands: {
        ...state.commands,
        [sectionId]: {
          ...state.commands[sectionId],
          ...updates,
        },
      },
    }))
  },

  removeCommand: (sectionId, commandId) => {
    set((state) => {
      const { [sectionId]: _, ...rest } = state.commands
      return { commands: rest }
    })
  },

  getCommandBySection: (sectionId) => {
    return get().commands[sectionId]
  },

  addMenuItem: (sectionId, item) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const newItem = { ...item, quantity: 1, paid: false, submitted: false }
      const updatedMenuItems = [...command.menuItems, newItem]
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            menuItems: updatedMenuItems,
            totalAmount,
          },
        },
      }
    })
  },

  removeMenuItem: (sectionId, itemId) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const updatedMenuItems = command.menuItems.filter((item) => item.id !== itemId)
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            menuItems: updatedMenuItems,
            totalAmount,
          },
        },
      }
    })
  },

  updateMenuItemQuantity: (sectionId, itemId, quantity) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const updatedMenuItems = command.menuItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      const totalAmount = updatedMenuItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            menuItems: updatedMenuItems,
            totalAmount,
          },
        },
      }
    })
  },

  toggleItemPaidStatus: (sectionId, itemId) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const updatedMenuItems = command.menuItems.map((item) =>
        item.id === itemId ? { ...item, paid: !item.paid } : item,
      )

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            menuItems: updatedMenuItems,
          },
        },
      }
    })
  },

  toggleItemSubmittedStatus: (sectionId, itemId) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const updatedMenuItems = command.menuItems.map((item) =>
        item.id === itemId && !item.paid ? { ...item, submitted: !item.submitted } : item,
      )

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            menuItems: updatedMenuItems,
          },
        },
      }
    })
  },

  submitUnsubmittedItems: (sectionId) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const updatedMenuItems = command.menuItems.map((item) => (!item.submitted ? { ...item, submitted: true } : item))

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            menuItems: updatedMenuItems,
          },
        },
      }
    })
  },

  addWaitstaffRequest: (sectionId, type) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const newRequest: WaitstaffRequest = {
        type,
        status: "pending",
        timestamp: new Date().toISOString(),
      }

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            waitstaffRequests: [...(command.waitstaffRequests || []), newRequest],
          },
        },
      }
    })
  },

  completeWaitstaffRequest: (sectionId, timestamp) => {
    set((state) => {
      const command = state.commands[sectionId]
      if (!command) return state

      const updatedWaitstaffRequests =
        command.waitstaffRequests?.map((request) =>
          request.timestamp === timestamp ? { ...request, status: "completed" } : request,
        ) || []

      return {
        commands: {
          ...state.commands,
          [sectionId]: {
            ...command,
            waitstaffRequests: updatedWaitstaffRequests,
          },
        },
      }
    })
  },
}))

