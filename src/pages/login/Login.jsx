import React from "react";
import {
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
} from "../../shared/OAuth";

const Login = () => {
  const goToKakao = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  const goToGoogle = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };
  const goToNaver = () => {
    window.location.href = NAVER_AUTH_URL;
  };
  return (
    <div>
      <button type="button" onClick={goToKakao}>
        KAKAO
      </button>
      <button type="button" onClick={goToGoogle}>
        GOOGLE
      </button>
      <button type="button" onClick={goToNaver}>
        NAVER
      </button>
    </div>
  );
};

export default Login;
