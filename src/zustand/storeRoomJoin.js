import {create} from "zustand";
import {api} from '../shared/api'



const useStoreRoomJoin = create((set) => ({
  data: [],
  roomInfo:[],
  roomPassword:"",
  loading: false,
  hasErrors: false,
  fetchPostRoomJoin: async (payload) => {
    set(() => ({ loading: true }));
    try {
      console.log("방 입장 payload:", payload)
      const data = await api.post(
        `api/rooms/${payload}`
      );
      set((state) => ({ data: (state.data = data.data), loading: false }));
      set((state) => ({ roomInfo: (state.roomInfo = data.data.data), loading: false }));
      console.log("방 입장 data ", data)
      console.log("방 입장 roomInfo ", data.data.data)
      return data
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('방 목록 불러오기 에러 : ' , err)
    }
  },
  fetchPostRoomJoinPassword: async (payload) => {
    set(() => ({ loading: true }));
    try {
      console.log("비번 방 입장 패치 payload : ", payload)
      const data = await api.post(
        `api/rooms/${payload.sessionId}`,
        {password:payload.password}
      );
      set((state) => ({ data: (state.data = data.data), loading: false }));
      set((state) => ({ roomInfo: (state.roomInfo = data.data.data), loading: false }));
      console.log("방 입장 data ", data)
      console.log("방 입장 roomInfo ", data.data.data)
      return data
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('방 목록 불러오기 에러 : ' , err)
    }
  },
  
}));

export default useStoreRoomJoin;