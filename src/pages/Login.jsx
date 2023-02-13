import React from "react";
import { KAKAO_AUTH_URL } from "../shared/OAuth";

const Login = () => {
  const goToKakao = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  return (
    <div>
      <button type="button" onClick={goToKakao}>
        KAKAO
      </button>
      {/* <GoogleBtn>GOOGLE</GoogleBtn> */}
    </div>
  );
};

export default Login;
