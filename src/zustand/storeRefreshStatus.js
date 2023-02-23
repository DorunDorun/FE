import {create} from "zustand";



const useStoreRefreshStatus = create((set) => ({
  isRefresh: false,
  loading: false,
  hasErrors: false,
  refreshStatusToggle: async (payload) => {
    set(() => ({ isRefresh: payload }));
  },
}));

export default useStoreRefreshStatus;