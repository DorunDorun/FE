import {create} from "zustand";
import {api} from '../shared/api'



const useStoreRoomList = create((set) => ({
  data: [],
  roomList:[],
  loading: false,
  hasErrors: false,
  fetchGetRoomList: async (payload) => {
    set(() => ({ loading: true }))
    try {
      console.log("방 불러오기 payload:", payload)
      const data = await api.get(
        `api/rooms/${payload}`
      );
      console.log("방 불러오기 data , " , data)
      set((state) => ({ data: (state.data = data.data), loading: false }));
      set((state) => ({ roomList: (state.roomList = data.data.data.chattingRoomList), loading: false }));
      return data
      
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('방 목록 불러오기 에러 : ' , err)
    }
  },
  fetchGetRoomSearchList: async (payload) => {
    set(() => ({ loading: true }))
    try {
      console.log("검색한 방 불러오기 payload:", payload)
      const data = await api.get(
        `api/rooms/${payload.pageCount}/search?keyword=${payload.searchValue}`
      );
      console.log("검색한 방 불러오기 data , " , data)
      set((state) => ({ data: (state.data = data.data), loading: false }));
      set((state) => ({ roomList: (state.roomList = data.data.data.chattingRoomList), loading: false }));
      return data
      
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('검색한 방 목록 불러오기 에러 : ' , err)
    }
  },
  fetchGetRoomCategoryList: async (payload) => {
    set(() => ({ loading: true }))
    try {
      console.log("선택 카테고리 방 불러오기 payload:", payload)
      const data = await api.get(
        `api/rooms/${payload.pageCount}/category?category=${payload.categoryValue}`
      );
      console.log("선택 카테고리 방 불러오기 data , " , data)
      set((state) => ({ data: (state.data = data.data), loading: false }));
      set((state) => ({ roomList: (state.roomList = data.data.data.chattingRoomList), loading: false }));
      return data
      
    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));
      console.log('선택 카테고리 방 목록 불러오기 에러 : ' , err)
    }
  }
  
}));

export default useStoreRoomList;