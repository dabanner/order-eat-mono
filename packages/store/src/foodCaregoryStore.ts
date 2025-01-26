import { create } from 'zustand';

export interface FoodCategory {
  id: string;
  name: string;
  emoji: string;
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
  { id: 'STARTER', name: 'Starter', emoji: '🍕', price: 25, image: require('@repo/ui/assets/images/categories/pizza.png'), imageKids: require('@repo/ui/assets/images/categories/pizzaKids.png') },
  { id: 'MAIN', name: 'Main', emoji: '🍝', price: 30, image: require('@repo/ui/assets/images/categories/pasta.png'), imageKids: require('@repo/ui/assets/images/categories/pastaKids.png') },
  { id: 'DESSERT', name: 'Dessert', emoji: '🍰', price: 13, image: require('@repo/ui/assets/images/categories/dessert.png'), imageKids: require('@repo/ui/assets/images/categories/dessertKids.png') },
  { id: 'BEVERAGE', name: 'Beverage', emoji: '🥤', price: 11, image: require('@repo/ui/assets/images/categories/beverage.png'), imageKids: require('@repo/ui/assets/images/categories/beverageKids.png') },
];

export const useFoodCategoryStore = create<FoodCategoryStore>((set) => ({
  categories: initialCategories,
  setCategories: (categories) => set({ categories }),
  getFoodCategoryById: (id: string) => initialCategories.find(category => category.id === id),
}));
