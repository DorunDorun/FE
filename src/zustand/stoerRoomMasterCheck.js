import {create} from "zustand";
import {api} from '../shared/api'



const useStoreRoomMasterCheck = create((set) => ({
  isRoomMaster: false,
  loading: false,
  hasErrors: false,
  roomMasterStatus: async (payload) => {
    set(() => ({ isRoomMaster: payload }));
  },
}));

export default useStoreRoomMasterCheck;