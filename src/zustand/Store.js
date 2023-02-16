import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";

const store = (set) => ({
  bears: 0,
  increase: () => set((state) => ({ bears: state.bears + 1 })),
  remove: () => set({ bears: 0 }),
});
const useStore = create(devtools(store));
export default useStore;

export const kakaoStore = create((set) => ({
  fetchdata: [],
  loading: false,
  hasErrors: false,
  fetch: async () => {
    set(() => ({ loading: true }));
    try {
      const response = await axios.post("https://dorundorun.shop");
      set((state) => ({
        fetchdata: (state.fetchdata = response.headers),
        loading: false,
      }));
      console.log(response);
    } catch (err) {
      console.log(err);
      // set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));

export const googleStore = create((set) => ({
  header: [],
  loading: false,
  hasErrors: false,
  fetch: async () => {
    set(() => ({ loading: true }));
    try {
      const response = await axios.post("https://dorundorun.shop");
      set((state) => ({
        header: (state.cookie = response.headers),
        loading: false,
      }));
      console.log(response);
    } catch (err) {
      console.log(err);
      // set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));

export const naverStore = create((set) => ({
  header: [],
  loading: false,
  hasErrors: false,
  fetch: async () => {
    set(() => ({ loading: true }));
    try {
      const response = await axios.post("https://dorundorun.shop");
      set((state) => ({
        header: (state.cookie = response.headers),
        loading: false,
      }));
      console.log(response);
    } catch (err) {
      console.log(err);
      // set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));
