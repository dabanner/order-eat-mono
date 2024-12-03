import { create } from 'zustand';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  foodCategoryId: string;
  mealTypeId: string;
}

export interface Restaurant {
  id: string;
  categoryId: string;
  name: string;
  type: string;
  rating: number;
  images: string[];
  description: string;
  menuItems: MenuItem[];
}

interface RestaurantStore {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
}

const initialRestaurants: Restaurant[] = [
  {
    id: '1',
    categoryId: 'c1',
    name: 'Pizza De La Mama',
    type: 'Italian',
    rating: 4.7,
    images: [
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D',
    ],
    description: 'Authentic Italian pizzas and pasta made with love and tradition.',
    menuItems: [
      {
        id: 'p1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and basil',
        price: 12.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
      },
      {
        id: 'p2',
        name: 'Pepperoni Pizza',
        description: 'Pizza topped with pepperoni and mozzarella',
        price: 14.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f1',
        mealTypeId: 'm1',
      },
      {
        id: 'p3',
        name: 'Spaghetti Carbonara',
        description: 'Spaghetti with eggs, cheese, and pancetta',
        price: 13.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f2',
        mealTypeId: 'm1',
      },
      {
        id: 'p4',
        name: 'Garlic Bread',
        description: 'Toasted bread with garlic butter and herbs',
        price: 5.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f3',
        mealTypeId: 'm2',
      },
      {
        id: 'p5',
        name: 'Tiramisu',
        description: 'Classic Italian coffee-flavored dessert',
        price: 6.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f4',
        mealTypeId: 'm3',
      },
    ],
  },
  {
    id: '2',
    categoryId: 'c2',
    name: 'Burger Bliss',
    type: 'American',
    rating: 4.5,
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
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f5',
        mealTypeId: 'm1',
      },
      {
        id: 'b2',
        name: 'Bacon Deluxe Burger',
        description: 'Beef patty with bacon, cheese, onion rings, and BBQ sauce',
        price: 12.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f5',
        mealTypeId: 'm1',
      },
      {
        id: 'b3',
        name: 'Crispy Chicken Sandwich',
        description: 'Crispy chicken breast with pickles and spicy mayo',
        price: 9.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f6',
        mealTypeId: 'm1',
      },
      {
        id: 'b4',
        name: 'Loaded Fries',
        description: 'Crispy fries topped with cheese, bacon, and green onions',
        price: 6.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f7',
        mealTypeId: 'm2',
      },
      {
        id: 'b5',
        name: 'Chocolate Milkshake',
        description: 'Rich and creamy chocolate milkshake',
        price: 4.99,
        image: 'https://www.galbani.fr/wp-content/uploads/2017/07/Image7.jpg',
        foodCategoryId: 'f8',
        mealTypeId: 'm3',
      },
    ],
  },
];

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: initialRestaurants,
  setRestaurants: (restaurants) => set({ restaurants }),
}));