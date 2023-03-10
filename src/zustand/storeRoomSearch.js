import {create} from "zustand";



const useStoreRoomSearch = create((set) => ({
  roomSearchValue: "",
  loading: false,
  hasErrors: false,
  roomSearch: async (payload) => {
    set(() => ({ roomSearchValue : payload }));
  },
}));

export default useStoreRoomSearch;