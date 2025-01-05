import { DefaultTheme, Theme } from "@react-navigation/native";
import { create } from "zustand";

export interface KidTheme extends Theme {
    kidMode: boolean;
    toggleKidMode: (value: boolean) => void;
}

interface ThemeStore {
    kidMode: boolean;
    toggleKidMode: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
    kidMode: false,
    toggleKidMode: (value) => set({ kidMode: value }),
}));

export const KidTheme: KidTheme = {
    ...DefaultTheme,
    get kidMode() {
        return useThemeStore.getState().kidMode;
    },
    toggleKidMode: (value: boolean) => {
        useThemeStore.getState().toggleKidMode(value);
    },
};

