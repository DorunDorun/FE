import {create} from "zustand";
import {api} from '../shared/api'



const useStoreRoomInfoGet = create((set) => ({
  data: [],
  roomInfo:[],
  loading: false,
  hasErrors: false,
  fetchRoomInfoGet: async (payload) => {
    set(() => ({ loading: true }));
    try {
      console.log("방 입장 payload:", payload)
      const data = await api.get(
        `api/rooms/${payload}/users`
      );
      set((state) => ({ data: (state.data = data.data), loading: false }));
      set((state) => ({ roomInfo: (state.roomInfo = data.data.data), loading: false }));
      console.log("🔥 방 정보 불러오기 data ", data)
      console.log("🔥 방 정보 불러오기 roomInfo ", data.data.data)
      return data
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('방 정보 불러오기 에러 : ' , err)
    }
  }
}));

export default useStoreRoomInfoGet;