import { create } from 'zustand';

interface Location {
    latitude: number;
    longitude: number;
    name: string;
    id: string;
}

interface LocationStore {
    locations: Location[];
    selectedLocation: Location | null;
    setLocations: (locations: Location[]) => void;
    setSelectedLocation: (location: Location | null) => void;
    getLocationById: (id: string) => Location | undefined;
}

const initialLocations: Location[] = [
    {
        id: '1',
        name: 'Pizza De La Mama',
        latitude: 43.6236560,
        longitude: 7.0470517
    },
    {
        id: '2',
        name: 'Burger Bliss',
        latitude: 48.8606,
        longitude: 2.3376
    }
];

export const useLocationStore = create<LocationStore>((set, get) => ({
    locations: initialLocations,
    selectedLocation: initialLocations[0], // Set default selected location
    setLocations: (locations) => set({ locations }),
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    getLocationById: (id) => get().locations.find(location => location.id === id)
}));