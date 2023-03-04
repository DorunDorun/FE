import { create } from "zustand";

export const StorePalette = create((set) => ({
  colorData: "",
  setColor: (newColor) => set(() => ({ color: newColor })),
}));
