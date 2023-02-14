import React from "react";
import { KAKAO_AUTH_URL } from "../shared/OAuth";

const Login = () => {
  const goToKakao = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  const goToGoogle = () => {
    window.location.href;
  };
  return (
    <div>
      <button type="button" onClick={goToKakao}>
        KAKAO
      </button>
      <button type="button" onClick={goToGoogle}>
        GOOGLE
      </button>
    </div>
  );
};

export default Login;
