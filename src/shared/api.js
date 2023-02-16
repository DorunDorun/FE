import axios from "axios";


export const server_url = process.env.REACT_APP_API_URL



export const api = axios.create({
  baseURL: server_url,
  timeout: 1000,
  headers: {
    "content-type": "application/json;charset=UTF-8",
    //"Accept": "application/json," 주석 이유 : 기본 값이 application/json
  },
});


api.interceptors.request.use(
    function (config) {
      const authoriztion = localStorage.getItem("Authoriztion");
      const refresh = localStorage.getItem("Refresh");
      try {
        if (authoriztion && refresh) {
          config.headers.authorization = authoriztion;
          config.headers.refreshauthorization = refresh;
        }
        return config;
      } catch (error) {
        alert("서버 요청 에러! 다시 시도해주세요!");
      }
      return config;
    },
    function (error) {
      
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    function (response) {
  
      return response;
    },
  
    function (error) {
      alert("서버 응답 에러! 다시 시도해주세요!");
      return Promise.reject(error);
    }
  );