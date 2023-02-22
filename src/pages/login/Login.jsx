import React from "react";
import {
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
} from "../../shared/OAuth";
import styled from "styled-components";
import LoginHeader from "../../Components/headers/LoginHeader";

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
    <Container>
      <LoginHeader />
      <Text>
        오늘 하루도 <span>두런두런</span> 하세요!
      </Text>
      <div>
        <KakaoBtn onClick={goToKakao}>카카오로 간편 로그인</KakaoBtn>
        <GoogleBtn onClick={goToGoogle}>GOOGLE</GoogleBtn>
        <NaverBtn onClick={goToNaver}>네이버로 간편 로그인</NaverBtn>
      </div>
    </Container>
  );
};

export default Login;
const Container = styled.div`
  background-color: #fff;
  width: 100%;
  height: 100vh;
`;

const Text = styled.text`
  position: absolute;
  top: 197px;
  left: 732px;
  width: 456px;
  height: 52px;
  /* UI Properties */
  text-align: center;
  margin-right: 20px;
  font-family: "LottriaChab";
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
  span {
    color: #8600f0;
  }
`;

const KakaoBtn = styled.button`
  position: absolute;
  top: 307px;
  left: 692px;
  width: 536px;
  height: 56px;
  /* UI Properties */
  background: #ffe900;
  border-radius: 8px;
  opacity: 1;

  text-align: center;
  font: normal normal 600 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #171717;
  opacity: 1;
`;

const GoogleBtn = styled.button`
  position: absolute;
  top: 451px;
  left: 692px;
  width: 536px;
  height: 56px;
  /* UI Properties */
  background: #efefef 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;
`;

const NaverBtn = styled.button`
  position: absolute;
  top: 379px;
  left: 692px;
  width: 536px;
  height: 56px;
  /* UI Properties */
  background: #00c73c 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;

  text-align: center;
  font: normal normal 600 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #fbfbfb;
  opacity: 1;
`;
