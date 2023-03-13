import { create } from "zustand";

export const StorePalette = create((set) => ({
  colorData: "",
  selectedFrame: "",
  colorDataName:"",
  setColor: (newColor) =>
    set(() => ({ colorDataName: "color", colorData: newColor })),
  setSelectedFrame: (frame) =>
    set(() => ({ colorDataName: "frame", colorData: frame })),
}));
