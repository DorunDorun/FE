import { create } from "zustand";
import axios from "axios";
import { api } from "../shared/api";
import { devtools } from "zustand/middleware";

export const Landingstore = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async () => {
    set(() => ({ loading: true }));
    try {
      const data = await api.get(`api/rooms/info`);
      set((state) => ({ data: (state.data = data.data), loading: false }));
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log(err);
    }
  },
}));
