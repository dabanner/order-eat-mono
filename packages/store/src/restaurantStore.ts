import { create } from 'zustand';

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
  nutrition: DetailedNutritionInfo;
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
  shortDescription: string;
  menuItems: MenuItem[];
  address: string;
  latitude: number; 
  longitude: number;
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
    shortDescription: 'Pizza - Pasta - Tiramisu',
    address: '123 avenue Saint-Philippe, 06410 BIOT',
    latitude: 43.617667, 
    longitude: 7.080314, 
    menuItems: [
      {
        id: 'p1',
        name: 'Pizza Calzone European',
        description: 'Pizza folded in half with chicken, mushrooms, and cheese',
        price: 32,
        images: [
          'https://cdn.tasteatlas.com/Images/Dishes/2bfdf993487d4995b8ed4ce3e99c5703.jpg',
          'https://cdn.tasteatlas.com/images/dishes/2dd9d07402f9404bb1149da811a0c42d.jpg?m=facebook',
          'https://cdn.tasteatlas.com/Images/Dishes/2bfdf993487d4995b8ed4ce3e99c5703.jpg',
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: ['10"', '14"', '16"'],
        selectedSize: '14"',
        keyIngredients: [
          { name: 'Chicken', icon: 'drumstick-bite' },
          { name: 'Lemon', icon: 'lemon' },
          { name: 'Cheese', icon: 'cheese' },
          { name: 'Bread', icon: 'bread-slice' },
          { name: 'Olive Oil', icon: 'oil-can' },
          {name: 'Carrot', icon: 'carrot'}
        ],
        allergens: ['Salt', 'Gluten', 'Nuts', 'Shellfish', 'Egg'],
        nutrition: {
          carbs: 89,
          proteins: 12.2,
          calories: 850,
          fats: 10.4,
          fiber: 2.5,
          servingSize: '14" calzone (350g serving)',
          description: 'This handcrafted Italian calzone delivers a perfect blend of proteins and carbohydrates, with 850 calories per portion. Made with premium ingredients, it provides 32g of protein from free-range chicken and fresh mozzarella. The carbohydrate content (89g) comes primarily from our house-made dough.',
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
              source: 'free-range chicken and fresh mozzarella'
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
          carbs: 65,
          proteins: 18,
          calories: 750,
          fats: 12,
          fiber: 2,
          servingSize: '14" pizza (300g serving)',
          description: 'Our classic Pepperoni Pizza is a perfect balance of flavors, featuring our signature tomato sauce, mozzarella cheese, and premium pepperoni slices on our hand-tossed crust.',
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
              source: 'mozzarella cheese and pepperoni'
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
          carbs: 70,
          proteins: 22,
          calories: 680,
          fats: 15,
          fiber: 3,
          servingSize: '250g serving',
          description: 'Our Spaghetti Carbonara is a rich and creamy pasta dish made with authentic Italian ingredients, featuring a silky sauce of eggs, Pecorino Romano cheese, and crispy pancetta.',
          details: {
            totalFat: {
              value: 15,
              saturatedFat: 6,
              transFat: 0
            },
            totalCarbohydrates: {
              value: 70,
              fiber: 3,
              sugars: 2
            },
            protein: {
              value: 22,
              source: 'eggs, cheese, and pancetta'
            },
            minerals: {
              sodium: 850,
              potassium: 300,
              calcium: 18,
              iron: 12
            },
            vitamins: {
              vitaminA: 6,
              vitaminC: 2,
              vitaminD: 8
            }
          }
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
          carbs: 30,
          proteins: 4,
          calories: 220,
          fats: 8,
          fiber: 1,
          servingSize: '2 slices (80g)',
          description: 'Our Garlic Bread is a perfect side dish, made with freshly baked bread, slathered with our house-made garlic butter and sprinkled with aromatic herbs.',
          details: {
            totalFat: {
              value: 8,
              saturatedFat: 3,
              transFat: 0
            },
            totalCarbohydrates: {
              value: 30,
              fiber: 1,
              sugars: 1
            },
            protein: {
              value: 4,
              source: 'wheat flour'
            },
            minerals: {
              sodium: 320,
              potassium: 80,
              calcium: 4,
              iron: 6
            },
            vitamins: {
              vitaminA: 2,
              vitaminC: 1,
              vitaminD: 0
            }
          }
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
          carbs: 35,
          proteins: 5,
          calories: 300,
          fats: 18,
          fiber: 0.5,
          servingSize: '1 slice (120g)',
          description: 'Our Tiramisu is a heavenly Italian dessert made with layers of coffee-soaked ladyfingers and creamy mascarpone cheese, dusted with cocoa powder.',
          details: {
            totalFat: {
              value: 18,
              saturatedFat: 10,
              transFat: 0
            },
            totalCarbohydrates: {
              value: 35,
              fiber: 0.5,
              sugars: 25
            },
            protein: {
              value: 5,
              source: 'eggs and mascarpone cheese'
            },
            minerals: {
              sodium: 80,
              potassium: 120,
              calcium: 8,
              iron: 4
            },
            vitamins: {
              vitaminA: 12,
              vitaminC: 0,
              vitaminD: 2
            }
          }
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
    shortDescription: 'Burgers - Fries - Milkshakes',
    address: '12 rue Henry Pointcare, 06410 BIOT',
    latitude: 34.0720208,
    longitude: -6.7956928,
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
          carbs: 40,
          proteins: 25,
          calories: 550,
          fats: 35,
          fiber: 2,
          servingSize: '1 burger (200g)',
          description: 'Our Classic Cheeseburger features a juicy beef patty topped with melted cheese, crisp lettuce, ripe tomato, and our secret special sauce, all on a toasted bun.',
          details: {
            totalFat: {
              value: 35,
              saturatedFat: 15,
              transFat: 0.5
            },
            totalCarbohydrates: {
              value: 40,
              fiber: 2,
              sugars: 6
            },
            protein: {
              value: 25,
              source: 'beef patty and cheese'
            },
            minerals: {
              sodium: 980,
              potassium: 450,
              calcium: 20,
              iron: 15
            },
            vitamins: {
              vitaminA: 8,
              vitaminC: 4,
              vitaminD: 2
            }
          }
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
          carbs: 45,
          proteins: 30,
          calories: 750,
          fats: 50,
          fiber: 2,
          servingSize: '1 burger (250g)',
          description: 'Our Bacon Deluxe Burger is a flavor explosion featuring a juicy beef patty, crispy bacon, melted cheese, crunchy onion rings, and tangy BBQ sauce on a toasted bun.',
          details: {
            totalFat: {
              value: 50,
              saturatedFat: 20,
              transFat: 0.5
            },
            totalCarbohydrates: {
              value: 45,
              fiber: 2,
              sugars: 10
            },
            protein: {
              value: 30,
              source: 'beef patty, bacon, and cheese'
            },
            minerals: {
              sodium: 1200,
              potassium: 500,
              calcium: 25,
              iron: 20
            },
            vitamins: {
              vitaminA: 10,
              vitaminC: 6,
              vitaminD: 2
            }
          }
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
          carbs: 50,
          proteins: 28,
          calories: 600,
          fats: 30,
          fiber: 2,
          servingSize: '1 sandwich (220g)',
          description: 'Our Crispy Chicken Sandwich features a perfectly crispy chicken breast fillet topped with tangy pickles and a kick of spicy mayo, all on a soft brioche bun.',
          details: {
            totalFat: {
              value: 30,
              saturatedFat: 5,
              transFat: 0
            },
            totalCarbohydrates: {
              value: 50,
              fiber: 2,
              sugars: 5
            },
            protein: {
              value: 28,
              source: 'chicken breast'
            },
            minerals: {
              sodium: 1100,
              potassium: 400,
              calcium: 15,
              iron: 10
            },
            vitamins: {
              vitaminA: 6,
              vitaminC: 2,
              vitaminD: 1
            }
          }
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
          carbs: 45,
          proteins: 12,
          calories: 480,
          fats: 30,
          fiber: 3,
          servingSize: '1 serving (200g)',
          description: 'Our Loaded Fries are a indulgent side dish featuring crispy golden fries topped with melted cheese, crispy bacon bits, and fresh green onions.',
          details: {
            totalFat: {
              value: 30,
              saturatedFat: 10,
              transFat: 0
            },
            totalCarbohydrates: {
              value: 45,
              fiber: 3,
              sugars: 2
            },
            protein: {
              value: 12,
              source: 'cheese and bacon'
            },
            minerals: {
              sodium: 800,
              potassium: 600,
              calcium: 15,
              iron: 8
            },
            vitamins: {
              vitaminA: 4,
              vitaminC: 15,
              vitaminD: 0
            }
          }
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
          carbs: 60,
          proteins: 10,
          calories: 550,
          fats: 25,
          fiber: 2,
          servingSize: '1 milkshake (400ml)',
          description: 'Our Chocolate Milkshake is a decadent treat made with premium chocolate ice cream, whole milk, and a touch of vanilla, blended to creamy perfection.',
          details: {
            totalFat: {
              value: 25,
              saturatedFat: 15,
              transFat: 0
            },
            totalCarbohydrates: {
              value: 60,
              fiber: 2,
              sugars: 50
            },
            protein: {
              value: 10,
              source: 'milk and ice cream'
            },
            minerals: {
              sodium: 250,
              potassium: 500,
              calcium: 30,
              iron: 2
            },
            vitamins: {
              vitaminA: 15,
              vitaminC: 1,
              vitaminD: 25
            }
          }
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

