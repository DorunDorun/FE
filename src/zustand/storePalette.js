import { create } from "zustand";

export const storePalette = create((set) => ({
  paleteeColor: "",
  loading: false,
  hasErrors: false,
  paleteeColorStatus: async (payload) => {
    set(() => ({ paleteeColor: payload }));
  },
}));
