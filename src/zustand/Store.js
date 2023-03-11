import { create } from "zustand";
import axios from "axios";
import { server_url } from "../shared/api";

export const LoginStore = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async (token) => {
    set(() => ({ loading: true }));
    try {
      console.log("fetch data : ", token);
      const data = await axios.post(`${server_url}`, token);
      set((state) => ({ data: (state.data = data.data), loading: false }));
    } catch (err) {
      console.log(err);
      // set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));
