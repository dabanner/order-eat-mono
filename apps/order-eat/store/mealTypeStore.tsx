import { create } from 'zustand';

export interface MealType {
  id: string;
  name: string;
}

interface MealTypeStore {
  types: MealType[];
  setTypes: (types: MealType[]) => void;
}

const initialTypes: MealType[] = [
  { id: 'm1', name: 'Main Course' },
  { id: 'm2', name: 'Appetizer' },
  { id: 'm3', name: 'Dessert' },
  { id: 'm4', name: 'Drink' },
];

export const useMealTypeStore = create<MealTypeStore>((set) => ({
  types: initialTypes,
  setTypes: (types) => set({ types }),
}));

