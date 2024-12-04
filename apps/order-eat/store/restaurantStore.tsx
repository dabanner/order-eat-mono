import { create } from 'zustand';

export interface NutritionInfo {
  carbs: number;
  proteins: number;
  calories: number;
  fats: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
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
  nutrition: NutritionInfo;
}

export interface Restaurant {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  rating: number;
  time: string;
  images: string[];
  description: string;
  menuItems: MenuItem[];
}

interface RestaurantStore {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
}

const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    categoryId: 'c1',
    name: 'Pizza De La Mama',
    type: 'Italian',
    rating: 4.7,
    time: '20 min',
    images: [
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
      'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
    ],
    description: 'Authentic Italian pizzas and pasta made with love and tradition.',
    menuItems: [
      {
        id: 'p1',
        name: 'Pizza Calzone European',
        description: 'Pizza folded in half with chicken, mushrooms, and cheese',
        price: 32,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: ['10"', '14"', '16"'],
        selectedSize: '14"',
        keyIngredients: [
          { name: 'Chicken', icon: 'drumstick-bite' },
          { name: 'Onion', icon: 'pepper-hot', isAllergy: true },
          { name: 'Cheese', icon: 'cheese' },
          { name: 'Bread', icon: 'bread-slice' },
          { name: 'Olive Oil', icon: 'oil-can' },
        ],
        allergens: ['Salt', 'Gluten', 'Nuts', 'Shellfish', 'Egg'],
        nutrition: {
          carbs: 65,
          proteins: 27,
          calories: 120,
          fats: 91
        }
      },
      {
        id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with pepperoni and mozzarella',
        price: 14.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: ['10"', '14"', '16"'],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'p3',
        name: 'Spaghetti Carbonara',
        description: 'Spaghetti with eggs, cheese, and pancetta',
        price: 13.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f2',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'p4',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 5.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f3',
        mealTypeId: 'm2',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'p5',
        name: 'Tiramisu',
        description: 'Classic Italian coffee-flavored dessert',
        price: 6.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f4',
        mealTypeId: 'm3',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
    ],
  },
  {
    id: '2',
    categoryId: 'c2',
    name: 'Burger Bliss',
    type: 'American',
    rating: 4.5,
    time: '15 min',
    images: [
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    description: 'Juicy burgers and crispy fries for the perfect comfort meal.',
    menuItems: [
      {
        id: 'b1',
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
        price: 9.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f5',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'b2',
        name: 'Bacon Deluxe Burger',
        description: 'Beef patty with bacon, cheese, onion rings, and BBQ sauce',
        price: 12.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f5',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'b3',
        name: 'Crispy Chicken Sandwich',
        description: 'Crispy chicken breast with pickles and spicy mayo',
        price: 9.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f6',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'b4',
        name: 'Loaded Fries',
        description: 'Crispy fries topped with cheese, bacon, and green onions',
        price: 6.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f7',
        mealTypeId: 'm2',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
      {
        id: 'b5',
        name: 'Chocolate Milkshake',
        description: 'Rich and creamy chocolate milkshake',
        price: 4.99,
        images: [
          'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
          'https://cdn.sortiraparis.com/images/80/100789/834071-too-restaurant-too-hotel-paris-photos-menu-entrees.jpg',
          'https://www.tourisme-rennes.com/voy_content/uploads/2023/09/Hotel-Balthazar-restaurant.jpg',
        ],
        foodCategoryId: 'f8',
        mealTypeId: 'm3',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [],
        allergens: [],
        nutrition: {
          carbs: 0,
          proteins: 0,
          calories: 0,
          fats: 0
        }
      },
    ],
  },
];

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: initialRestaurants,
  setRestaurants: (restaurants) => set({ restaurants }),
  selectedRestaurant: null,
  setSelectedRestaurant: (restaurant) => set({ selectedRestaurant: restaurant }),
}));

