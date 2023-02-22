import { create } from "zustand";
import produce from "immer";

export const sendMessage = create((set) => ({
  data: [],
  fetch: (receive) =>
    set(
      produce((draft) => {
        // draft.data = { receive };
        draft.data.push({ receive });
      })
    ),
}));
