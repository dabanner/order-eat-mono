import { create } from 'zustand';

export interface FoodCategory {
  id: string;
  name: string;
  price: number;
  image: number;
  imageKids: number;
}

interface FoodCategoryStore {
  categories: FoodCategory[];
  setCategories: (categories: FoodCategory[]) => void;
  getFoodCategoryById: (id: string) => FoodCategory | undefined;
}

const initialCategories: FoodCategory[] = [
  { id: 'f1', name: 'Pizza', price: 70, image: require('@repo/ui/assets/images/categories/pizza.png'), imageKids: require('@repo/ui/assets/images/categories/pizzaKids.png') },
  { id: 'f2', name: 'Pasta', price: 50, image: require('@repo/ui/assets/images/categories/pasta.png'), imageKids: require('@repo/ui/assets/images/categories/pastaKids.png') },
  { id: 'f3', name: 'Bread', price: 30, image: require('@repo/ui/assets/images/categories/bread.png'), imageKids: require('@repo/ui/assets/images/categories/breadKids.png') },
  { id: 'f4', name: 'Dessert', price: 35, image: require('@repo/ui/assets/images/categories/dessert.png'), imageKids: require('@repo/ui/assets/images/categories/dessertKids.png') },
  { id: 'f5', name: 'Burger', price: 69, image: require('@repo/ui/assets/images/categories/burger.png'), imageKids: require('@repo/ui/assets/images/categories/burgerKids.png') },
  { id: 'f6', name: 'Sandwich', price: 10, image: require('@repo/ui/assets/images/categories/sandwich.png'), imageKids: require('@repo/ui/assets/images/categories/sandwichKids.png') },
  { id: 'f7', name: 'Fries', price: 20, image: require('@repo/ui/assets/images/categories/fries.png'), imageKids: require('@repo/ui/assets/images/categories/friesKids.png') },
  { id: 'f8', name: 'Beverage', price: 6, image: require('@repo/ui/assets/images/categories/beverage.png'), imageKids: require('@repo/ui/assets/images/categories/beverageKids.png') },
];

export const useFoodCategoryStore = create<FoodCategoryStore>((set) => ({
  categories: initialCategories,
  setCategories: (categories) => set({ categories }),
  getFoodCategoryById: (id: string) => initialCategories.find(category => category.id === id),
}));
