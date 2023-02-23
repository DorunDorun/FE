import {create} from "zustand";



const useStoreRoomMasterCheck = create((set) => ({
  isRoomMaster: false,
  loading: false,
  hasErrors: false,
  roomMasterStatus: async (payload) => {
    set(() => ({ isRoomMaster: payload }));
  },
}));

export default useStoreRoomMasterCheck;