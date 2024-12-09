import { create } from 'zustand';

export interface FoodCategory {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface FoodCategoryStore {
  categories: FoodCategory[];
  setCategories: (categories: FoodCategory[]) => void;
  getFoodCategoryById: (id: string) => FoodCategory | undefined;
}

const initialCategories: FoodCategory[] = [
  { id: 'f1', name: 'Pizza', price: 70, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f2', name: 'Pasta', price: 50, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f3', name: 'Bread', price: 30, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f4', name: 'Dessert', price: 35, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f5', name: 'Burger', price: 69, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f6', name: 'Sandwich', price: 10, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f7', name: 'Fries', price: 20, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: 'f8', name: 'Beverage', price: 6, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
];

export const useFoodCategoryStore = create<FoodCategoryStore>((set) => ({
  categories: initialCategories,
  setCategories: (categories) => set({ categories }),
  getFoodCategoryById: (id: string) => initialCategories.find(category => category.id === id),
}));
