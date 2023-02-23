import {create} from "zustand";
import {api} from '../shared/api'



const useStoreRoomCreate = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetch: async (payload) => {
    set(() => ({ loading: true }));
    try {
        console.log('fetch 할 data : ', payload)
      const data = await api.post(
        "api/rooms" , payload
      );
      set((state) => ({ data: (state.data = data.data), loading: false }));
      return data
      
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('fetch 에러 : ' , err)
    }
  },
}));

export default useStoreRoomCreate;