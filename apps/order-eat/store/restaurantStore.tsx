import { create } from 'zustand';

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  rating: number;
  delivery: string;
  time: string;
  image: string;
}

interface RestaurantStore {
  restaurants: Restaurant[];
  setRestaurants: (restaurants: Restaurant[]) => void;
}

const initialRestaurants: Restaurant[] = [
  { id: '1', name: 'Rose Garden Restaurant', type: 'Burger - Chicken - Ribs - Wings', rating: 4.7, delivery: 'Free', time: '20 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '2', name: 'Sushi Paradise', type: 'Japanese - Sushi - Asian', rating: 4.5, delivery: '$2.99', time: '25 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '3', name: 'Pasta Palace', type: 'Italian - Pasta - Pizza', rating: 4.3, delivery: 'Free', time: '30 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '4', name: 'Taco Town', type: 'Mexican - Tacos - Burritos', rating: 4.6, delivery: '$1.99', time: '15 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '5', name: 'Green Leaf Salads', type: 'Salads - Healthy - Vegan', rating: 4.4, delivery: 'Free', time: '20 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '6', name: 'Steakhouse 66', type: 'Steak - Grill - American', rating: 4.8, delivery: '$3.99', time: '35 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '7', name: 'Noodle House', type: 'Asian - Noodles - Soup', rating: 4.2, delivery: '$1.50', time: '25 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '8', name: 'Pizza Planet', type: 'Pizza - Italian - Fast Food', rating: 4.0, delivery: 'Free', time: '30 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '9', name: 'Seafood Shack', type: 'Seafood - Fish - Grill', rating: 4.6, delivery: '$2.50', time: '40 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
  { id: '10', name: 'Sweet Tooth Desserts', type: 'Desserts - Ice Cream - Bakery', rating: 4.9, delivery: '$1.99', time: '15 min', image: 'https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D' },
];

export const useRestaurantStore = create<RestaurantStore>((set) => ({
  restaurants: initialRestaurants,
  setRestaurants: (restaurants) => set({ restaurants }),
}));
