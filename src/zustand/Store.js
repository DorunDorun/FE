import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

/* const store = (set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async (payload) => {
    set(() => ({ loading: true }));
    try {
      console.log("fetch data : ", payload);
      // const data = await api.post("api/create/room", payload);
      // set((state) => ({ data: (state.data = data.data), loading: false }));
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
    }
  },
});

const useStore = create(devtools(store));
export default useStore; */

export const LoginStore = create((set) => ({
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
