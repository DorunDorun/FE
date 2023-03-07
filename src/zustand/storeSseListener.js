import {create} from "zustand";
import {api} from '../shared/api'
import { server_url } from '../shared/api';


const useStoreSseListener = create((set) => ({
  data: [],
  loading: false,
  hasErrors: false,
  sseListener: async (payload) => {
    set(() => ({ loading: true }));
    try {
      navigator.sendBeacon(`${server_url}api/count`)

    } catch (err) {
      set(() => ({ hasErrors: true, loading: false }));

      console.log("❗sse 실시간 감지 api 에러!", err)
    }
  },
}));

export default useStoreSseListener;