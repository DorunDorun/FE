import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

export const Landingstore = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async (token) => {
    set(() => ({ loading: true }));
    try {
      console.log("fetch data : ", token);
      const data = await axios.post("https://dorundorun.shop", token);
      set((state) => ({ data: (state.data = data.data), loading: false }));
    } catch (err) {
      console.log(err);
      // set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));
