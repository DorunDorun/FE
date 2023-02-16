import {create} from "zustand";
import axios from "axios";
import {api} from '../shared/api'



const useStoreRoomCreate = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async (payload) => {
    set(() => ({ loading: true }));
    try {
        console.log('fetch data : ', payload)
      const data = await api.post(
        "api/create/room" , payload
      );
      set((state) => ({ data: (state.data = data.data), loading: false }));
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
    }
  },
}));

export default useStoreRoomCreate;