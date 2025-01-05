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
  descriptionForKids: string;
  price: number;
  images: number[];
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
  setRestaurants: (restaurants: Restaurant[]) => void;
  selectedRestaurant: Restaurant | null;
  setSelectedRestaurant: (restaurant: Restaurant | null) => void;
}

const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    categoryId: 'c1',
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
    latitude: 43.623428,
    longitude: 7.046175,
    menuItems: [
      {
        id: 'al_p1',
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
        preparationTime: 15,
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
        id: 'al_p2',
        name: 'Truffle Burrata',
        description: 'A luxurious creation featuring hand-selected black truffles from Périgord, paired with creamy burrata from Puglia that melts perfectly into a bed of wild mushrooms foraged from local forests. The pizza is finished with fresh arugula and a drizzle of white truffle oil, creating an aromatic symphony that celebrates the earthy flavors of the Mediterranean countryside. Each bite offers a perfect balance of delicate and intense flavors.',
        descriptionForKids: 'A special pizza with super creamy cheese and magic mushrooms! It\'s what fancy princes and princesses eat! 👑✨',
        price: 28.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/truffle-pizza-1.jpg'),
          require('@repo/ui/assets/images/restaurants/alivia/truffle-pizza-2.jpg'),
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 18,
        sizes: ['S', 'M', 'L'],
        keyIngredients: [
          { name: 'Burrata', icon: 'cheese' },
          { name: 'Truffle', icon: 'mushroom' },
          { name: 'Arugula', icon: 'leaf' },
          { name: 'Mushrooms', icon: 'mushroom' }
        ],
        allergens: ['Milk', 'Gluten'],
        nutrition: {
          carbs: 38,
          proteins: 18,
          calories: 520,
          fats: 24,
          fiber: 3,
          servingSize: '30cm pizza',
          description: 'A luxurious combination of premium ingredients featuring fresh burrata and black truffle.',
          details: {
            totalFat: { value: 24, saturatedFat: 12, transFat: 0 },
            totalCarbohydrates: { value: 38, fiber: 3, sugars: 2 },
            protein: { value: 18, source: 'burrata cheese' },
            minerals: { sodium: 720, potassium: 230, calcium: 30, iron: 6 },
            vitamins: { vitaminA: 8, vitaminC: 10, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_p3',
        name: 'Mediterranean Delight',
        description: 'A celebration of Mediterranean flavors featuring a colorful array of locally sourced grilled vegetables: sweet bell peppers, tender zucchini, and smoky eggplant. Topped with authentic Greek feta cheese, hand-picked Kalamata olives, and vine-ripened cherry tomatoes. The pizza is finished with aromatic oregano and a generous drizzle of our premium extra virgin olive oil, creating a harmonious blend of colors, textures, and flavors that transport you to a sunny Mediterranean terrace.',
        descriptionForKids: 'A rainbow pizza full of yummy vegetables! Each bite is like a tiny garden party with cheese! 🌈🥕',
        price: 19.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/mediterranean-pizza-1.jpeg'),
          require('@repo/ui/assets/images/restaurants/alivia/mediterranean-pizza-2.jpeg'),
          require('@repo/ui/assets/images/restaurants/alivia/mediterranean-pizza-3.jpeg'),
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 16,
        sizes: ['S', 'M', 'L'],
        keyIngredients: [
          { name: 'Feta', icon: 'cheese' },
          { name: 'Olives', icon: 'seedling' },
          { name: 'Tomatoes', icon: 'apple-whole' },
          { name: 'Zucchini', icon: 'carrot' }
        ],
        allergens: ['Milk', 'Gluten'],
        nutrition: {
          carbs: 36,
          proteins: 14,
          calories: 420,
          fats: 18,
          fiber: 4,
          servingSize: '30cm pizza',
          description: 'A vegetarian feast inspired by Mediterranean flavors.',
          details: {
            totalFat: { value: 18, saturatedFat: 8, transFat: 0 },
            totalCarbohydrates: { value: 36, fiber: 4, sugars: 4 },
            protein: { value: 14, source: 'feta cheese and vegetables' },
            minerals: { sodium: 890, potassium: 320, calcium: 20, iron: 10 },
            vitamins: { vitaminA: 15, vitaminC: 25, vitaminD: 1 }
          }
        }
      },
      {
        id: 'al_p4',
        name: 'Prosciutto & Rucola',
        description: 'An elegant combination of 24-month aged San Daniele prosciutto, delicately laid over our perfectly baked crust. The pizza is crowned with wild arugula harvested at dawn for maximum freshness, sweet cherry tomatoes, and generous shavings of aged Parmigiano Reggiano DOP. A final touch of house-made balsamic glaze, aged for 12 years, adds the perfect sweet and tangy finish to this sophisticated creation.',
        descriptionForKids: 'A fun pizza with special ham that\'s as thin as paper! We add crunchy green leaves that make you feel like a rabbit in a fancy restaurant! 🐰✨',
        price: 23.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/prosciutto-pizza-1.jpg'),
          require('@repo/ui/assets/images/restaurants/alivia/prosciutto-pizza-2.jpeg'),
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 17,
        sizes: ['S', 'M', 'L'],
        keyIngredients: [
          { name: 'Prosciutto', icon: 'bacon' },
          { name: 'Arugula', icon: 'leaf' },
          { name: 'Parmesan', icon: 'cheese' },
          { name: 'Tomatoes', icon: 'apple-whole' }
        ],
        allergens: ['Milk', 'Gluten', 'Pork'],
        nutrition: {
          carbs: 40,
          proteins: 22,
          calories: 480,
          fats: 16,
          fiber: 2,
          servingSize: '30cm pizza',
          description: 'A classic Italian combination of prosciutto and fresh arugula.',
          details: {
            totalFat: { value: 16, saturatedFat: 7, transFat: 0 },
            totalCarbohydrates: { value: 40, fiber: 2, sugars: 3 },
            protein: { value: 22, source: 'prosciutto and cheese' },
            minerals: { sodium: 950, potassium: 280, calcium: 28, iron: 12 },
            vitamins: { vitaminA: 10, vitaminC: 18, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_p5',
        name: 'Quattro Formaggi',
        description: 'A masterful blend of Italy\'s finest cheeses: aged Gorgonzola DOP providing a bold blue cheese intensity, fresh buffalo mozzarella for its creamy texture, 24-month aged Parmigiano Reggiano DOP offering nutty crystallized notes, and rich Taleggio DOP adding an aromatic complexity. Finished with fresh basil and freshly cracked black pepper, this pizza is a testament to Italy\'s cheese-making tradition, creating a rich and complex flavor profile that develops with each bite.',
        descriptionForKids: 'The ultimate cheese adventure! Four different super-tasty cheeses make this pizza extra special - it\'s like having a cheese party in your mouth! 🧀✨',
        price: 21.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/quattro-formaggi-1.jpg'),
          require('@repo/ui/assets/images/restaurants/alivia/quattro-formaggi-2.jpeg'),
        ],
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
        preparationTime: 15,
        sizes: ['S', 'M', 'L'],
        keyIngredients: [
          { name: 'Gorgonzola', icon: 'cheese' },
          { name: 'Mozzarella', icon: 'cheese' },
          { name: 'Parmesan', icon: 'cheese' },
          { name: 'Taleggio', icon: 'cheese' }
        ],
        allergens: ['Milk', 'Gluten'],
        nutrition: {
          carbs: 38,
          proteins: 24,
          calories: 560,
          fats: 28,
          fiber: 1.5,
          servingSize: '30cm pizza',
          description: 'A rich and indulgent combination of four premium Italian cheeses.',
          details: {
            totalFat: { value: 28, saturatedFat: 16, transFat: 0 },
            totalCarbohydrates: { value: 38, fiber: 1.5, sugars: 2 },
            protein: { value: 24, source: 'mixed cheeses' },
            minerals: { sodium: 1100, potassium: 190, calcium: 45, iron: 4 },
            vitamins: { vitaminA: 14, vitaminC: 2, vitaminD: 3 }
          }
        }
      },
      {
        id: 'al_pa1',
        name: 'Seafood Linguine',
        description: 'A coastal Mediterranean masterpiece featuring al dente linguine tossed with an abundance of fresh seafood: wild-caught red prawns from San Remo, tender calamari, sweet Mediterranean mussels, and fresh clams. The pasta is gently coated in a light sauce made with organic cherry tomatoes, white wine from the French Riviera, garlic confit, and fresh herbs. A touch of Espelette pepper adds a subtle warmth, while a drizzle of premium extra virgin olive oil and fresh parsley complete this elegant dish.',
        descriptionForKids: 'Yummy long noodles with treasure from the sea! Watch out for the cute little prawns swimming in your pasta - they\'re super tasty! 🦐🌊',
        price: 28.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/seafood-linguine-1.jpg'),
        ],
        foodCategoryId: 'f2',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [
          { name: 'Prawns', icon: 'shrimp' },
          { name: 'Mussels', icon: 'fish' },
          { name: 'Garlic', icon: 'seedling' },
          { name: 'White Wine', icon: 'wine-glass' }
        ],
        allergens: ['Shellfish', 'Gluten', 'Sulfites'],
        nutrition: {
          carbs: 68,
          proteins: 32,
          calories: 580,
          fats: 18,
          fiber: 4,
          servingSize: '350g',
          description: 'A protein-rich pasta dish featuring fresh Mediterranean seafood.',
          details: {
            totalFat: { value: 18, saturatedFat: 3, transFat: 0 },
            totalCarbohydrates: { value: 68, fiber: 4, sugars: 3 },
            protein: { value: 32, source: 'mixed seafood' },
            minerals: { sodium: 820, potassium: 450, calcium: 80, iron: 15 },
            vitamins: { vitaminA: 10, vitaminC: 12, vitaminD: 8 }
          }
        }
      },
      {
        id: 'al_pa2',
        name: 'Truffle Tagliatelle',
        description: 'Handcrafted fresh tagliatelle made daily with premium Italian flour and local farm-fresh eggs, tossed in a silky sauce made with mascarpone and aged Parmigiano Reggiano DOP. The pasta is generously garnished with freshly shaved black truffles from Périgord and wild mushrooms sautéed in French butter. A light touch of fresh thyme and a drizzle of white truffle oil enhance the earthy aromas, creating an unforgettable gastronomic experience that embodies the height of Italian luxury.',
        descriptionForKids: 'Magic ribbon pasta with special mushroom dust that makes it taste like gold! It\'s what Italian princes and princesses eat! 👑🍄',
        price: 32.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/truffle-tagliatelle-1.jpg'),
        ],
        foodCategoryId: 'f2',
        mealTypeId: 'm1',
        preparationTime: 18,
        sizes: [],
        keyIngredients: [
          { name: 'Fresh Pasta', icon: 'wheat-awn' },
          { name: 'Truffle', icon: 'mushroom' },
          { name: 'Parmesan', icon: 'cheese' },
          { name: 'Mascarpone', icon: 'cheese' }
        ],
        allergens: ['Eggs', 'Gluten', 'Milk'],
        nutrition: {
          carbs: 72,
          proteins: 24,
          calories: 680,
          fats: 28,
          fiber: 3,
          servingSize: '300g',
          description: 'A luxurious pasta dish showcasing black truffles and fresh egg pasta.',
          details: {
            totalFat: { value: 28, saturatedFat: 14, transFat: 0 },
            totalCarbohydrates: { value: 72, fiber: 3, sugars: 2 },
            protein: { value: 24, source: 'eggs and cheese' },
            minerals: { sodium: 680, potassium: 320, calcium: 220, iron: 12 },
            vitamins: { vitaminA: 15, vitaminC: 4, vitaminD: 6 }
          }
        }
      },
      {
        id: 'al_b1',
        name: 'Artisanal Garlic Bread',
        description: 'Our signature garlic bread begins with house-made sourdough, crafted from a century-old mother dough brought from Naples. The bread is generously brushed with a compound butter made from French cultured butter, roasted garlic confit, fresh Italian parsley, and Mediterranean herbs. Topped with a light dusting of Parmigiano Reggiano DOP and fresh rosemary, then baked in our wood-fired oven until golden and crispy on the outside while remaining perfectly soft inside. Finished with a drizzle of extra virgin olive oil and Maldon sea salt flakes.',
        descriptionForKids: 'Crunchy magic bread that makes your breath super strong like a dragon! With melty butter and yummy cheese on top! 🐉✨',
        price: 9.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/garlic-bread-1.jpg'),
        ],
        foodCategoryId: 'f3',
        mealTypeId: 'm1',
        preparationTime: 12,
        sizes: [],
        keyIngredients: [
          { name: 'Sourdough', icon: 'bread-slice' },
          { name: 'Garlic', icon: 'seedling' },
          { name: 'Parsley', icon: 'leaf' },
          { name: 'Parmesan', icon: 'cheese' }
        ],
        allergens: ['Gluten', 'Milk'],
        nutrition: {
          carbs: 32,
          proteins: 6,
          calories: 280,
          fats: 14,
          fiber: 2,
          servingSize: '150g (4 pieces)',
          description: 'Artisanal sourdough garlic bread with premium ingredients.',
          details: {
            totalFat: { value: 14, saturatedFat: 8, transFat: 0 },
            totalCarbohydrates: { value: 32, fiber: 2, sugars: 1 },
            protein: { value: 6, source: 'wheat and cheese' },
            minerals: { sodium: 580, potassium: 120, calcium: 60, iron: 2 },
            vitamins: { vitaminA: 8, vitaminC: 2, vitaminD: 1 }
          }
        }
      },
      {
        id: 'al_d1',
        name: 'Classic Tiramisu',
        description: 'Our time-honored tiramisu recipe passed down through generations of Italian pastry chefs. Layers of delicate Savoiardi biscuits soaked in single-origin Arabica espresso from Ethiopia, alternating with a velvety cream of mascarpone sourced from Lombardy, enriched with free-range eggs and a touch of Marsala wine. Each layer is meticulously crafted to achieve the perfect balance between coffee-soaked biscuits and airy mascarpone cream, finished with a dusting of premium Valrhona cocoa powder.',
        descriptionForKids: 'A magical layered dessert that looks like a chocolate cloud! It\'s like eating fluffy chocolate pillows with a secret coffee flavor! ☁️✨',
        price: 12.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/tiramisu-1.jpg'),
        ],
        foodCategoryId: 'f4',
        mealTypeId: 'm3',
        preparationTime: 10,
        sizes: [],
        keyIngredients: [
          { name: 'Mascarpone', icon: 'cheese' },
          { name: 'Coffee', icon: 'mug-hot' },
          { name: 'Cocoa', icon: 'seedling' },
          { name: 'Eggs', icon: 'egg' }
        ],
        allergens: ['Eggs', 'Milk', 'Gluten'],
        nutrition: {
          carbs: 38,
          proteins: 8,
          calories: 420,
          fats: 22,
          fiber: 2,
          servingSize: '180g portion',
          description: 'Traditional Italian tiramisu made with premium ingredients.',
          details: {
            totalFat: { value: 22, saturatedFat: 14, transFat: 0 },
            totalCarbohydrates: { value: 38, fiber: 2, sugars: 28 },
            protein: { value: 8, source: 'eggs and mascarpone' },
            minerals: { sodium: 160, potassium: 220, calcium: 15, iron: 4 },
            vitamins: { vitaminA: 18, vitaminC: 0, vitaminD: 4 }
          }
        }
      },
      {
        id: 'al_d2',
        name: 'Lemon Panna Cotta',
        description: 'A silky-smooth Italian cream dessert infused with the essence of sun-ripened Menton lemons from the French Riviera. Made with the finest Italian cream and Madagascar vanilla beans, set to a perfect wobble and topped with a vibrant citrus coulis made from fresh local citrus fruits. Garnished with candied lemon zest, edible flowers, and a delicate tuile crisp, creating a harmonious balance between creamy richness and bright citrus notes.',
        descriptionForKids: 'A wiggly-wobbly vanilla pudding with magical lemon sparkles on top! It dances on your spoon like jelly made from clouds! 🍋✨',
        price: 11.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/panna-cotta-1.jpg'),
        ],
        foodCategoryId: 'f4',
        mealTypeId: 'm3',
        preparationTime: 8,
        sizes: [],
        keyIngredients: [
          { name: 'Cream', icon: 'wine-glass' },
          { name: 'Lemon', icon: 'lemon' },
          { name: 'Vanilla', icon: 'seedling' },
          { name: 'Honey', icon: 'jar' }
        ],
        allergens: ['Milk'],
        nutrition: {
          carbs: 28,
          proteins: 4,
          calories: 320,
          fats: 18,
          fiber: 0,
          servingSize: '150g portion',
          description: 'Light and creamy panna cotta with fresh citrus flavors.',
          details: {
            totalFat: { value: 18, saturatedFat: 12, transFat: 0 },
            totalCarbohydrates: { value: 28, fiber: 0, sugars: 24 },
            protein: { value: 4, source: 'cream' },
            minerals: { sodium: 80, potassium: 160, calcium: 12, iron: 0 },
            vitamins: { vitaminA: 12, vitaminC: 15, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_d3',
        name: 'Chocolate Fondant',
        description: 'A decadent warm chocolate fondant crafted with single-origin 70% Guanaja dark chocolate from Valrhona, combined with French butter and free-range eggs. The carefully timed baking process creates a light, tender cake exterior while maintaining a molten chocolate heart that flows upon the first spoon. Served with house-made vanilla bean gelato, fresh raspberry coulis, and a delicate gold leaf garnish, creating a perfect harmony of warm and cold, rich and fresh flavors.',
        descriptionForKids: 'A magical chocolate cake with a secret melty center! When you break it open, warm chocolate flows like lava - it\'s like having a chocolate volcano for dessert! 🌋🍫',
        price: 14.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/fondant-1.jpg'),
        ],
        foodCategoryId: 'f4',
        mealTypeId: 'm3',
        preparationTime: 15,
        sizes: [],
        keyIngredients: [
          { name: 'Chocolate', icon: 'cookie' },
          { name: 'Butter', icon: 'cheese' },
          { name: 'Eggs', icon: 'egg' },
          { name: 'Vanilla', icon: 'ice-cream' }
        ],
        allergens: ['Eggs', 'Milk', 'Gluten'],
        nutrition: {
          carbs: 42,
          proteins: 8,
          calories: 480,
          fats: 28,
          fiber: 4,
          servingSize: '160g portion',
          description: 'Rich chocolate fondant with a molten center.',
          details: {
            totalFat: { value: 28, saturatedFat: 18, transFat: 0 },
            totalCarbohydrates: { value: 42, fiber: 4, sugars: 32 },
            protein: { value: 8, source: 'eggs and dairy' },
            minerals: { sodium: 180, potassium: 280, calcium: 8, iron: 6 },
            vitamins: { vitaminA: 15, vitaminC: 0, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_bu1',
        name: 'Riviera Truffle Burger',
        description: 'A masterpiece of French-Italian fusion featuring a hand-formed 180g patty of premium Piedmontese beef and wagyu, grilled to perfection over olive wood. Topped with melted Taleggio DOP, fresh black truffle shavings, caramelized shallots in aged balsamic, and wild rocket. Served on a house-made brioche bun brushed with truffle butter and garnished with a Parmesan tuile. Each burger is accompanied by our signature rosemary-salted hand-cut fries and truffle aioli.',
        descriptionForKids: 'The fanciest burger ever! It\'s like a super-hero sandwich with special cheese and magic mushrooms that make it taste like gold! 🦸‍♂️✨',
        price: 32.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/truffle-burger-1.jpeg'),
        ],
        foodCategoryId: 'f5',
        mealTypeId: 'm1',
        preparationTime: 20,
        sizes: [],
        keyIngredients: [
          { name: 'Wagyu Beef', icon: 'cow' },
          { name: 'Truffle', icon: 'mushroom' },
          { name: 'Taleggio', icon: 'cheese' },
          { name: 'Brioche', icon: 'bread-slice' }
        ],
        allergens: ['Milk', 'Gluten', 'Eggs'],
        nutrition: {
          carbs: 48,
          proteins: 42,
          calories: 890,
          fats: 52,
          fiber: 3,
          servingSize: '380g (with fries)',
          description: 'A luxurious burger featuring premium beef and fresh truffles.',
          details: {
            totalFat: { value: 52, saturatedFat: 22, transFat: 0 },
            totalCarbohydrates: { value: 48, fiber: 3, sugars: 6 },
            protein: { value: 42, source: 'premium beef blend' },
            minerals: { sodium: 980, potassium: 720, calcium: 25, iron: 18 },
            vitamins: { vitaminA: 12, vitaminC: 8, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_bu2',
        name: 'Mediterranean Lamb Burger',
        description: 'A celebration of Mediterranean flavors featuring a succulent 180g patty of hand-ground lamb from the French Alps, seasoned with our secret blend of Provençal herbs. Topped with whipped feta from Greece, grilled aubergine, sun-dried tomato tapenade, and fresh mint. Served on our house-made olive oil brioche with a light spread of harissa aioli. Accompanied by crispy za\'atar-dusted sweet potato fries and preserved lemon yogurt dip.',
        descriptionForKids: 'An adventure burger from the mountains! Soft and juicy with creamy cheese and sweet tomatoes, served with orange fries that taste like candy! 🏔️🍟',
        price: 29.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/lamb-burger-1.jpeg'),
        ],
        foodCategoryId: 'f5',
        mealTypeId: 'm1',
        preparationTime: 18,
        sizes: [],
        keyIngredients: [
          { name: 'Lamb', icon: 'drumstick-bite' },
          { name: 'Feta', icon: 'cheese' },
          { name: 'Aubergine', icon: 'carrot' },
          { name: 'Mint', icon: 'leaf' }
        ],
        allergens: ['Milk', 'Gluten', 'Eggs', 'Sesame'],
        nutrition: {
          carbs: 42,
          proteins: 38,
          calories: 820,
          fats: 46,
          fiber: 5,
          servingSize: '360g (with fries)',
          description: 'A Mediterranean-inspired lamb burger with artisanal accompaniments.',
          details: {
            totalFat: { value: 46, saturatedFat: 18, transFat: 0 },
            totalCarbohydrates: { value: 42, fiber: 5, sugars: 8 },
            protein: { value: 38, source: 'premium lamb' },
            minerals: { sodium: 890, potassium: 680, calcium: 20, iron: 22 },
            vitamins: { vitaminA: 15, vitaminC: 12, vitaminD: 1 }
          }
        }
      },
      {
        id: 'al_s1',
        name: 'Vitello Tonnato Sandwich',
        description: 'A refined interpretation of the classic Piedmontese dish transformed into an elegant sandwich. Thinly sliced milk-fed veal, slow-roasted and chilled, is layered with a silky tuna-flavored mayonnaise made with line-caught Mediterranean tuna, preserved lemons, and Pantelleria capers. Served on our house-made focaccia with crisp baby gem lettuce, semi-dried cherry tomatoes, and a light drizzle of extra virgin olive oil. Each sandwich is accompanied by our signature rosemary-sea salt crisps.',
        descriptionForKids: 'A super special sandwich with tender meat and a secret fishy sauce that tastes like mermaid magic! Served with crunchy potato chips! 🧜‍♀️✨',
        price: 24.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/vitello-sandwich-1.jpg'),
        ],
        foodCategoryId: 'f6',
        mealTypeId: 'm1',
        preparationTime: 15,
        sizes: [],
        keyIngredients: [
          { name: 'Veal', icon: 'drumstick-bite' },
          { name: 'Tuna', icon: 'fish' },
          { name: 'Capers', icon: 'seedling' },
          { name: 'Focaccia', icon: 'bread-slice' }
        ],
        allergens: ['Fish', 'Gluten', 'Eggs'],
        nutrition: {
          carbs: 42,
          proteins: 38,
          calories: 620,
          fats: 28,
          fiber: 3,
          servingSize: '280g (with crisps)',
          description: 'An elegant sandwich featuring premium veal and tuna sauce.',
          details: {
            totalFat: { value: 28, saturatedFat: 6, transFat: 0 },
            totalCarbohydrates: { value: 42, fiber: 3, sugars: 4 },
            protein: { value: 38, source: 'veal and tuna' },
            minerals: { sodium: 780, potassium: 420, calcium: 15, iron: 14 },
            vitamins: { vitaminA: 8, vitaminC: 12, vitaminD: 4 }
          }
        }
      },
      {
        id: 'al_s2',
        name: 'Mediterranean Vegetable Panini',
        description: 'A celebration of Provençal vegetables, featuring layers of chargrilled zucchini, eggplant, and sweet bell peppers, marinated in herb-infused olive oil. Topped with buffalo mozzarella from Campania, sun-dried tomato pesto, and fresh basil leaves. Pressed between our house-made ciabatta bread that\'s brushed with garlic-infused olive oil and grilled until perfectly crispy. Served with a side of marinated artichoke hearts and olive tapenade.',
        descriptionForKids: 'A rainbow sandwich filled with grilled veggies and stretchy cheese! When it\'s hot, the cheese pulls like magic strings! 🌈🧀',
        price: 19.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/veggie-panini-1.jpg'),
        ],
        foodCategoryId: 'f6',
        mealTypeId: 'm1',
        preparationTime: 12,
        sizes: [],
        keyIngredients: [
          { name: 'Vegetables', icon: 'carrot' },
          { name: 'Mozzarella', icon: 'cheese' },
          { name: 'Pesto', icon: 'leaf' },
          { name: 'Ciabatta', icon: 'bread-slice' }
        ],
        allergens: ['Milk', 'Gluten', 'Nuts'],
        nutrition: {
          carbs: 48,
          proteins: 18,
          calories: 520,
          fats: 24,
          fiber: 6,
          servingSize: '260g (with sides)',
          description: 'A vegetarian panini featuring grilled Mediterranean vegetables.',
          details: {
            totalFat: { value: 24, saturatedFat: 8, transFat: 0 },
            totalCarbohydrates: { value: 48, fiber: 6, sugars: 6 },
            protein: { value: 18, source: 'cheese and vegetables' },
            minerals: { sodium: 680, potassium: 520, calcium: 35, iron: 8 },
            vitamins: { vitaminA: 25, vitaminC: 45, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_s3',
        name: 'Riviera Club Sandwich',
        description: 'Our elevated take on the classic club sandwich features three layers of house-baked brioche, filled with herb-roasted French chicken breast, 24-month aged Parma ham, and perfectly ripe avocado. Enhanced with sun-dried tomato mayonnaise, organic free-range eggs, crispy pancetta, and butter lettuce. Each layer is thoughtfully constructed and cut into precise triangles, secured with gold-plated picks. Served with truffle-parmesan fries and our signature honey-mustard dipping sauce.',
        descriptionForKids: 'A triple-decker sandwich tower! It\'s like three yummy sandwiches stacked together with golden toothpicks holding the magic inside! 🏰✨',
        price: 26.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/club-sandwich-1.jpeg'),
        ],
        foodCategoryId: 'f6',
        mealTypeId: 'm1',
        preparationTime: 15,
        sizes: [],
        keyIngredients: [
          { name: 'Chicken', icon: 'drumstick-bite' },
          { name: 'Parma Ham', icon: 'bacon' },
          { name: 'Avocado', icon: 'seedling' },
          { name: 'Brioche', icon: 'bread-slice' }
        ],
        allergens: ['Eggs', 'Gluten', 'Milk'],
        nutrition: {
          carbs: 52,
          proteins: 42,
          calories: 780,
          fats: 38,
          fiber: 4,
          servingSize: '320g (with fries)',
          description: 'A luxurious triple-decker club sandwich with premium ingredients.',
          details: {
            totalFat: { value: 38, saturatedFat: 12, transFat: 0 },
            totalCarbohydrates: { value: 52, fiber: 4, sugars: 5 },
            protein: { value: 42, source: 'chicken and ham' },
            minerals: { sodium: 920, potassium: 580, calcium: 18, iron: 16 },
            vitamins: { vitaminA: 15, vitaminC: 20, vitaminD: 2 }
          }
        }
      },
      {
        id: 'al_f1',
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
      {
        id: 'al_f2',
        name: 'Provençal Sweet Potato Fries',
        description: 'Crispy sweet potato fries seasoned with our signature blend of Provençal herbs - lavender, thyme, rosemary, and sage - harvested from our kitchen garden. Tossed in extra virgin olive oil and finished with fleur de sel and cracked black pepper. Served with a Mediterranean-inspired trio of dips: saffron aioli, preserved lemon yogurt, and spiced honey. Presented in a rustic ceramic bowl with fresh herbs garnish.',
        descriptionForKids: 'Orange super-fries that taste like sweet candy sticks! They\'re crispy, sweet, and come with special dips that taste like sunshine! 🌞🍠',
        price: 10.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/sweet-potato-fries-1.jpeg'),
        ],
        foodCategoryId: 'f7',
        mealTypeId: 'm2',
        preparationTime: 10,
        sizes: ['Regular', 'Large'],
        keyIngredients: [
          { name: 'Sweet Potato', icon: 'carrot' },
          { name: 'Herbs', icon: 'leaf' },
          { name: 'Olive Oil', icon: 'oil-can' },
          { name: 'Honey', icon: 'jar' }
        ],
        allergens: ['Milk', 'Eggs'],
        nutrition: {
          carbs: 42,
          proteins: 4,
          calories: 380,
          fats: 18,
          fiber: 6,
          servingSize: '200g',
          description: 'Crispy sweet potato fries with Provençal herbs.',
          details: {
            totalFat: { value: 18, saturatedFat: 2, transFat: 0 },
            totalCarbohydrates: { value: 42, fiber: 6, sugars: 8 },
            protein: { value: 4, source: 'sweet potato' },
            minerals: { sodium: 460, potassium: 920, calcium: 60, iron: 1.5 },
            vitamins: { vitaminA: 120, vitaminC: 35, vitaminD: 0 }
          }
        }
      },
      {
        id: 'al_b1',
        name: 'Riviera Citrus Spritz',
        description: 'A refined Mediterranean twist on the classic spritz, featuring locally distilled orange liqueur, premium prosecco, and a blend of fresh citrus juices from Menton lemons and blood oranges. Garnished with dehydrated citrus wheels, fresh herbs from our garden, and finished with a splash of artisanal Mediterranean tonic water. Served in a hand-blown Murano glass with premium ice spheres.',
        descriptionForKids: 'A sparkly sunshine drink with bubbles that dance! Made with sweet orange juice and magical fizzy water, it\'s like drinking liquid gold! ✨🍊',
        price: 14.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/citrus-spritz-1.jpeg'),
        ],
        foodCategoryId: 'f8',
        mealTypeId: 'm4',
        preparationTime: 5,
        sizes: [],
        keyIngredients: [
          { name: 'Prosecco', icon: 'wine-glass' },
          { name: 'Orange', icon: 'lemon' },
          { name: 'Herbs', icon: 'leaf' },
          { name: 'Tonic', icon: 'glass-water' }
        ],
        allergens: ['Sulfites'],
        nutrition: {
          carbs: 18,
          proteins: 0,
          calories: 180,
          fats: 0,
          fiber: 0,
          servingSize: '250ml',
          description: 'A refreshing citrus-based spritz cocktail.',
          details: {
            totalFat: { value: 0, saturatedFat: 0, transFat: 0 },
            totalCarbohydrates: { value: 18, fiber: 0, sugars: 16 },
            protein: { value: 0, source: '' },
            minerals: { sodium: 10, potassium: 85, calcium: 0, iron: 0 },
            vitamins: { vitaminA: 0, vitaminC: 15, vitaminD: 0 }
          }
        }
      },
      {
        id: 'al_b2',
        name: 'Mediterranean Herb Lemonade',
        description: 'Artisanal lemonade crafted with hand-picked Menton lemons, infused with a bouquet of Mediterranean herbs including lavender, thyme, and basil from our garden. Sweetened with locally sourced lavender honey and finished with sparkling mineral water from the French Alps. Garnished with fresh herb sprigs and edible flowers. Served in a recycled glass carafe with fresh citrus ice cubes.',
        descriptionForKids: 'Fresh lemonade with rainbow flowers and magic garden herbs! It\'s like drinking from a fairy garden! 🌺🍋',
        price: 9.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/herb-lemonade-1.jpeg'),
        ],
        foodCategoryId: 'f8',
        mealTypeId: 'm4',
        preparationTime: 4,
        sizes: [],
        keyIngredients: [
          { name: 'Lemon', icon: 'lemon' },
          { name: 'Honey', icon: 'jar' },
          { name: 'Herbs', icon: 'leaf' },
          { name: 'Flowers', icon: 'seedling' }
        ],
        allergens: [],
        nutrition: {
          carbs: 22,
          proteins: 0,
          calories: 90,
          fats: 0,
          fiber: 0,
          servingSize: '300ml',
          description: 'A refreshing herbal lemonade with local ingredients.',
          details: {
            totalFat: { value: 0, saturatedFat: 0, transFat: 0 },
            totalCarbohydrates: { value: 22, fiber: 0, sugars: 20 },
            protein: { value: 0, source: '' },
            minerals: { sodium: 5, potassium: 100, calcium: 0, iron: 0 },
            vitamins: { vitaminA: 0, vitaminC: 25, vitaminD: 0 }
          }
        }
      },
      {
        id: 'al_b3',
        name: 'Artisanal Italian Coffee',
        description: 'Premium espresso crafted from a signature blend of single-origin Arabica beans, sourced from small-batch roasters in Northern Italy. Each cup is prepared using our restored vintage La Pavoni machine, ensuring perfect pressure and temperature. Served with house-made chocolate-dipped biscotti and sparkling mineral water on the side. Available as espresso, cappuccino, or caffè latte, made with organic local milk.',
        descriptionForKids: 'Grown-up magic potion that smells like chocolate and cookies! Comes with a tiny sweet treat on the side! ☕✨',
        price: 6.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/coffee-1.jpeg'),
        ],
        foodCategoryId: 'f8',
        mealTypeId: 'm4',
        preparationTime: 5,
        sizes: ['Espresso', 'Cappuccino', 'Latte'],
        keyIngredients: [
          { name: 'Coffee', icon: 'mug-hot' },
          { name: 'Milk', icon: 'wine-glass' },
          { name: 'Biscotti', icon: 'cookie' },
          { name: 'Water', icon: 'glass-water' }
        ],
        allergens: ['Milk', 'Gluten', 'Nuts'],
        nutrition: {
          carbs: 12,
          proteins: 8,
          calories: 120,
          fats: 6,
          fiber: 0,
          servingSize: '240ml (latte)',
          description: 'Premium Italian coffee with artisanal accompaniments.',
          details: {
            totalFat: { value: 6, saturatedFat: 4, transFat: 0 },
            totalCarbohydrates: { value: 12, fiber: 0, sugars: 10 },
            protein: { value: 8, source: 'milk' },
            minerals: { sodium: 95, potassium: 350, calcium: 300, iron: 0 },
            vitamins: { vitaminA: 4, vitaminC: 0, vitaminD: 25 }
          }
        }
      },
      {
        id: 'al_b4',
        name: 'Provence Berry Smoothie',
        description: 'A vibrant blend of seasonal berries from local Provence farms, including raspberries, strawberries, and blackberries, combined with organic Greek yogurt and a touch of lavender honey. Enhanced with antioxidant-rich chia seeds and fresh mint leaves. Served in a frosted glass with a garnish of fresh berries and edible flowers.',
        descriptionForKids: 'A pink princess smoothie made from magical berries! It\'s like drinking a rainbow with tiny fairy seeds inside! 👸🫐',
        price: 11.90,
        images: [
          require('@repo/ui/assets/images/restaurants/alivia/berry-smoothie-1.jpg'),
        ],
        foodCategoryId: 'f8',
        mealTypeId: 'm4',
        preparationTime: 6,
        sizes: ['Regular', 'Large'],
        keyIngredients: [
          { name: 'Berries', icon: 'apple-whole' },
          { name: 'Yogurt', icon: 'wine-glass' },
          { name: 'Honey', icon: 'jar' },
          { name: 'Chia', icon: 'seedling' }
        ],
        allergens: ['Milk'],
        nutrition: {
          carbs: 32,
          proteins: 8,
          calories: 220,
          fats: 4,
          fiber: 6,
          servingSize: '350ml',
          description: 'A nutritious smoothie featuring local Provence berries.',
          details: {
            totalFat: { value: 4, saturatedFat: 1, transFat: 0 },
            totalCarbohydrates: { value: 32, fiber: 6, sugars: 24 },
            protein: { value: 8, source: 'yogurt' },
            minerals: { sodium: 60, potassium: 400, calcium: 200, iron: 2 },
            vitamins: { vitaminA: 6, vitaminC: 85, vitaminD: 15 }
          }
        }
      }
    ]
  },
  {
    id: '2',
    categoryId: 'c1',
    name: 'Green 2.0',
    type: 'Italian',
    rating: 4.7,
    time: '20 min',
    images: [
      require('@repo/ui/assets/images/restaurants/green2/green2-1.jpg'),
    ],
    description: 'Authentic Italian pizzas and pasta made with love and tradition.',
    shortDescription: 'Pizza - Pasta - Tiramisu',
    address: '123 avenue Saint-Philippe, 06410 BIOT',
    latitude: 43.623428,
    longitude: 7.046175,
    menuItems: [
      {
        id: 'p1',
        name: 'Pizza Calzone European',
        description: 'Pizza folded in half with chicken, mushrooms, and cheese',
        descriptionForKids: 'Pizza folded in half with chicken, mushrooms, and cheese',
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
        descriptionForKids: 'Pizza topped with pepperoni and mozzarella',
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
        descriptionForKids: 'Spaghetti with eggs, cheese, and pancetta',
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
        descriptionForKids: 'Toasted bread with garlic butter and herbs',
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
        descriptionForKids: 'Classic Italian coffee-flavored dessert',
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
    id: '3',
    categoryId: 'c2',
    name: 'L’assiette Nature',
    type: 'Salad',
    rating: 4.5,
    time: '15 min',
    images: [
      require('@repo/ui/assets/images/restaurants/assietteNature/assietteNature-1.jpg'),
    ],
    description: 'Juicy burgers and crispy fries for the perfect comfort meal.',
    shortDescription: 'Burgers - Fries - Milkshakes',
    address: '12 rue Henry Pointcare, 06410 BIOT',
    latitude: 43.623428,
    longitude: 7.046175,
    menuItems: [
      {
        id: 'b1',
        name: 'Classic Cheeseburger',
        description: 'Beef patty with cheese, lettuce, tomato, and special sauce',
        descriptionForKids: 'Beef patty with cheese, lettuce, tomato, and special sauce',
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
        descriptionForKids: 'Beef patty with bacon, cheese, onion rings, and BBQ sauce',
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
        descriptionForKids: 'Crispy chicken breast with pickles and spicy mayo',
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
        descriptionForKids: 'Crispy fries topped with cheese, bacon, and green onions',
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
        descriptionForKids: 'Rich and creamy chocolate milkshake',
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

