import {create} from "zustand";
import {api} from '../shared/api'



const useStoreRoomDelete = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  fetchDeleteRoom: async (payload) => {
    set(() => ({ loading: true }));
    try {
      console.log("방 삭제 payload:", payload)
      const data = await api.delete(
        `api/rooms/${payload.sessionId}?prev=${payload.prevStatus}`
      );
      set((state) => ({ data: (state.data = data.data), loading: false }));
      return data
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      //alert("방 삭제 error")
    }
  },
}));

export default useStoreRoomDelete;