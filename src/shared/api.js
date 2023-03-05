import axios from "axios";

export const PUBLIC_PATH = process.env.PUBLIC_URL
export const server_url = process.env.REACT_APP_API_URL
export const server_url_openvidu = process.env.REACT_APP_API_URL_OPENVIDU 


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
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      try { //토큰 체크
        if (accessToken && refreshToken) {
          config.headers.authorization = accessToken;
          config.headers.refresh = refreshToken;
          return config;
        }
        else{
          //alert("로그인이 필요한 페이지입니다.")
          return window.location.href="/login"
        }
      } catch (error) {
        //alert("서버 요청 에러! 다시 시도해주세요!");
      }
      return config;
    },
    function (error) {
      
      return Promise.reject(error);
    }
  );
  
  api.interceptors.response.use(
    function (response) {
      //헤더에 담긴 토큰 다시 세팅
      const accessToken = response.headers.authorization
      const refreshToken = response.headers.refresh
      if(accessToken && refreshToken){
        localStorage.setItem("accessToken");
        localStorage.setItem("refreshToken");
      }
      return response;
    },
  
    function (error) {
      //alert("서버 응답 에러! 다시 시도해주세요!");
      return Promise.reject(error);
    }
  );