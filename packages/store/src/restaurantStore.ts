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
const descriptions = [
  {
    shortName: "foie gras",
    description: "A luxurious French delicacy made from specially prepared duck or goose liver, with a rich, buttery texture and complex flavor",
    descriptionForKids: ""
  },
  {
    shortName: "soft-boiled egg",
    description: "An egg cooked until the white is set but the yolk remains creamy and runny",
    descriptionForKids: "A yummy egg that's a little runny inside, perfect for dipping toast soldiers"
  },
  {
    shortName: "goat cheese",
    description: "A tangy, creamy cheese made from goat's milk with a distinctive flavor",
    descriptionForKids: "A special white cheese that's soft and creamy"
  },
  {
    shortName: "salmon",
    description: "Fresh, tender pink fish that can be grilled, smoked, or served raw, rich in healthy omega-3 oils",
    descriptionForKids: "Tasty pink fish that's good for you and makes you strong"
  },
  {
    shortName: "crab maki",
    description: "Japanese sushi roll filled with crab meat, rice, and vegetables, wrapped in seaweed",
    descriptionForKids: "Fun rice rolls with yummy crab inside"
  },
  {
    shortName: "burrata",
    description: "A fresh Italian cheese made from mozzarella and cream, with a soft, creamy center",
    descriptionForKids: "Super creamy white cheese that's like a special treat"
  },
  {
    shortName: "pizza",
    description: "Italian flatbread topped with tomato sauce, cheese, and various toppings, baked until crispy",
    descriptionForKids: "Delicious round bread with melty cheese and toppings"
  },
  {
    shortName: "lasagna",
    description: "Layered Italian pasta dish with meat sauce, cheese, and bechamel",
    descriptionForKids: "Yummy layers of pasta, sauce, and cheese stacked together"
  },
  {
    shortName: "beef burger",
    description: "Ground beef patty served on a bun with various toppings and condiments",
    descriptionForKids: "Tasty meat patty on a soft bun with your favorite toppings"
  },
  {
    shortName: "beef chuck",
    description: "Tender, slow-cooked beef from the shoulder area, full of rich flavor",
    descriptionForKids: "Soft, juicy beef that melts in your mouth"
  },
  {
    shortName: "half cooked tuna",
    description: "Seared tuna steak, cooked on the outside while remaining rare in the center",
    descriptionForKids: ""
  },
  {
    shortName: "brownie",
    description: "Rich, dense chocolate cake square with a fudgy texture",
    descriptionForKids: "Chocolate cake square that's super chocolatey and delicious"
  },
  {
    shortName: "chocolate",
    description: "Sweet treat made from cocoa beans, available in dark, milk, or white varieties",
    descriptionForKids: "Sweet, creamy treat that makes you happy"
  },
  {
    shortName: "lemon",
    description: "Bright citrus fruit with tart, refreshing flavor",
    descriptionForKids: "Yellow fruit that's a little sour but fun to taste"
  },
  {
    shortName: "rasp and peaches",
    description: "Fresh combination of sweet peaches and tart raspberries",
    descriptionForKids: "Sweet peachy fruit with little red berries"
  },
  {
    shortName: "strawberries",
    description: "Sweet, bright red berries with a juicy texture",
    descriptionForKids: "Sweet red berries that are super yummy"
  },
  {
    shortName: "seasonal fruit",
    description: "Fresh fruits that are currently in season, ensuring peak flavor",
    descriptionForKids: "Fresh, tasty fruits picked when they're perfectly ready"
  },
  {
    shortName: "tiramisu",
    description: "Italian dessert made with coffee-soaked ladyfingers and mascarpone cream",
    descriptionForKids: "Creamy Italian dessert with soft cookies inside"
  },
  {
    shortName: "coke",
    description: "Carbonated cola beverage with a classic sweet taste",
    descriptionForKids: "Bubbly sweet drink for special occasions"
  },
  {
    shortName: "ice tea",
    description: "Chilled tea served over ice, often flavored with lemon or fruit",
    descriptionForKids: "Cold, refreshing tea that's perfect when it's hot outside"
  },
  {
    shortName: "bottled water",
    description: "Pure, still water served in a bottle",
    descriptionForKids: "Fresh, clean water in a bottle"
  },
  {
    shortName: "sparkling water",
    description: "Carbonated water with refreshing bubbles",
    descriptionForKids: "Water with fun bubbles that tickle your nose"
  },
  {
    shortName: "spritz",
    description: "Italian cocktail made with prosecco, bitter liqueur, and soda water",
    descriptionForKids: ""
  },
  {
    shortName: "margarita",
    description: "Cocktail made with tequila, lime juice, and triple sec, often served with salt",
    descriptionForKids: ""
  },
  {
    shortName: "tequila",
    description: "Mexican spirit made from the blue agave plant",
    descriptionForKids: ""
  },
  {
    shortName: "mojito",
    description: "Cuban cocktail made with rum, mint, lime, sugar, and soda water",
    descriptionForKids: ""
  },
  {
    shortName: "martini",
    description: "Classic cocktail made with gin or vodka and vermouth",
    descriptionForKids: ""
  },
  {
    shortName: "lemonade",
    description: "Refreshing drink made from lemon juice, water, and sugar",
    descriptionForKids: "Sweet and sour drink made from lemons"
  },
  {
    shortName: "apple juice",
    description: "Sweet beverage made from pressed apples",
    descriptionForKids: "Sweet drink made from fresh apples"
  },
  {
    shortName: "café",
    description: "Hot brewed coffee made from roasted coffee beans",
    descriptionForKids: ""
  }
]

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
        description: descriptions.find((desc)=> desc.shortName === backendItem.shortName)?.description, // Keep your default values
        descriptionForKids: descriptions.find((desc)=> desc.shortName === backendItem.shortName)?.descriptionForKids, // Keep your default values
        price: backendItem.price, // ✅ Map from backend
        images: backendItem.image ? [backendItem.image] : [], // ✅ Map from backend (as array)
        foodCategoryId: backendItem.category, // Default value
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