import { create } from 'zustand';

export interface Category {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Pizza', price: 70, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '2', name: 'Burger', price: 50, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '3', name: 'Sushi', price: 80, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '4', name: 'Pasta', price: 60, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '5', name: 'Salad', price: 40, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '6', name: 'Steak', price: 90, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '7', name: 'Seafood', price: 85, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '8', name: 'Tacos', price: 45, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '9', name: 'Ramen', price: 55, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
  { id: '10', name: 'Dessert', price: 30, image: 'https://www.foodiesfeed.com/wp-content/uploads/2023/06/burger-with-melted-cheese.jpg' },
];

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: initialCategories,
  setCategories: (categories) => set({ categories }),
}));
