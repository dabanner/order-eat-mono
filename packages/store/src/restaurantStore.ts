import { create } from 'zustand';
import axios from 'axios';

export interface NutritionInfo {
  carbs: number;
  proteins: number;
  calories: number;
  fats: number;
}

export interface DetailedNutritionInfo extends NutritionInfo {
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

export interface MenuItem {
  id: string; //✅
  name: string;//✅
  description: string;
  descriptionForKids: string;
  price: number; //✅
  images: string[];//✅ (ONLY ONE IMAGE)
  foodCategoryId: string;
  mealTypeId: string;
  preparationTime: number;
  sizes: string[];
  selectedSize?: string;
  keyIngredients: {
    name: string;
    isAllergy?: boolean;
    icon: string;
  }[];
  allergens: string[];
  nutrition: DetailedNutritionInfo;
}

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  rating: number;
  time: string;
  images: number[];
  description: string;
  shortDescription: string;
  menuItems: MenuItem[];
  address: string;
  latitude: number;
  longitude: number;
}

interface RestaurantStore {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
  fetchMenuItems: () => Promise<void>;
}

const sampleRestaurant: Restaurant = {
  id: '1',
  name: "L'Alivia",
  type: 'Italian & Mediterranean',
  rating: 4.8,
  time: '25 min',
  images: [
    require('@repo/ui/assets/images/restaurants/alivia/alivia-exterior.jpeg'),
    require('@repo/ui/assets/images/restaurants/alivia/alivia-interior.jpeg'),
    require('@repo/ui/assets/images/restaurants/alivia/alivia-terrace.jpeg'),
  ],
  description: 'Experience authentic Italian and Mediterranean cuisine in a charming setting on the French Riviera.',
  shortDescription: 'Italian - Mediterranean - Pizza - Pasta',
  address: '123 avenue Saint-Philippe, 06410 BIOT',
  latitude: 43.615632,
  longitude: 7.071891,
  menuItems: []
};

const imageRegistry: { [key: number]: string } = {};

export const registerImage = (imageUrl: string): number => {
  // Generate a unique numeric ID for the image
  const imageId = Object.keys(imageRegistry).length + 1;
  imageRegistry[imageId] = imageUrl;
  return imageId;
};

export const getImageUrl = (imageId: number): string | undefined => {
  return imageRegistry[imageId];
};

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: [sampleRestaurant],
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),


  fetchMenuItems: async () => {
    try {
      const response = await axios.get('https://adaptation.chhilif.com/menu/menus');

      console.log('Sample menu item:', response.data[0]);
      console.log('Sample menu item image:', response.data[0].image);

      const mappedMenuItems = response.data.map((backendItem: any) => ({
        id: backendItem._id,  // ✅ Map from backend
        name: backendItem.fullName, // ✅ Map from backend
        description: "Default description", // Keep your default values
        descriptionForKids: "Default kids description",
        price: backendItem.price, // ✅ Map from backend
        images: backendItem.image ? [backendItem.image] : [], // ✅ Map from backend (as array)
        foodCategoryId: "f1", // Default value
        mealTypeId: "m1", // Default value
        preparationTime: 15, // Default value
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0,
          fiber: 0,
          servingSize: "",
          description: "",
          details: {
            totalFat: { value: 0, saturatedFat: 0, transFat: 0 },
            totalCarbohydrates: { value: 0, fiber: 0, sugars: 0 },
            protein: { value: 0, source: "" },
            minerals: { sodium: 0, potassium: 0, calcium: 0, iron: 0 },
            vitamins: { vitaminA: 0, vitaminC: 0, vitaminD: 0 }
          }
        }
      }));

      const updatedRestaurant = {
        ...sampleRestaurant,
        menuItems: mappedMenuItems
      };


      const menuItem = mappedMenuItems[0];
      if (menuItem.images.length > 0) {
        const imageUrl = getImageUrl(menuItem.images[0]);
        console.log('Image URL:', imageUrl); // This will give you the original URL
      }


      set({ restaurants: [updatedRestaurant] });
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    }
  }
}));