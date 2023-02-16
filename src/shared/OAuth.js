// REST API
const KAKAO_CLIENT_ID = "68b0ace8b9adf8d9b54389e448ad653d";
const GOOGLE_CLIENT_ID =
  "144351566914-uljifaoirfhsdh15dpic7t7kacat4bm6.apps.googleusercontent.com";
const NAVER_CLIENT_ID = "EqbwugkRagVJo1L1FnGb";

// 리다이렉트 주소
const KAKAO_REDIRECT_URI = "https://dorundorun.shop/login/oauth2/code/kakao";
const GOOGLE_REDIRECT_URI = "https://dorundorun.shop/login/oauth2/code/google";
const NAVER_REDIRECT_URI = "https://dorundorun.shop/login/oauth2/code/naver";

// export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI}&response_type=code`;
// export const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email`;
// export const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=STATE_STRING&redirect_uri=${NAVER_REDIRECT_URI}`;

export const KAKAO_AUTH_URL = `https://dorundorun.shop/oauth2/authorization/kakao?redirect_uri=${KAKAO_REDIRECT_URI}`;

export const GOOGLE_AUTH_URL = `https://dorundorun.shop/oauth2/authorization/google?redirect_uri=${GOOGLE_REDIRECT_URI}`;

export const NAVER_AUTH_URL = `https://dorundorun.shop/oauth2/authorization/naver?redirect_uri=${NAVER_REDIRECT_URI}`;
