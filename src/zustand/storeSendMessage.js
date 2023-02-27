import { create } from "zustand";
import produce from "immer";

export const sendMessage = create((set) => ({
  data: [],
  fetch: (receive) =>
    set(
      produce((state) => {
        state.data.push({ receive });
      })
    ),
}));

export const removeMessage = create((set) => ({
  data: [],
  clearData: () =>
    set(
      produce((state) => {
        state.data = null;
      })
    ),
}));
