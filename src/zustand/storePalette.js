import { create } from "zustand";

export const StorePalette = create((set) => ({
  colorData: "",
  selectedFrame: "",
  setColor: (newColor) =>
    set(() => ({ colorDataName: "color", colorData: newColor })),
  setSelectedFrame: (frame) =>
    set(() => ({ colorDataName: "frame", selectedFrame: frame })),
}));
