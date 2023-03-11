import { create } from "zustand";

export const StoreDesign = create((set) => ({
  colorData: "",
  setColor: (newColor) => set(() => ({ color: newColor })),
}));
