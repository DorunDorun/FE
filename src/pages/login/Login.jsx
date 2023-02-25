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
    <>
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
        <Inner>
          <span>
            두런두런은 별도의 회원가입 없이
            <p>SNS 계정을 통한 간편 로그인/로그아웃</p>을 통해 이용 가능합니다
            :)
          </span>
        </Inner>
      </Container>
      <StFooter></StFooter>
    </>
  );
};

export default Login;
const Container = styled.div`
  background-color: #fff;
  width: 100%;
  height: calc(100vh - 50px);
`;

const Text = styled.text`
  display: flex;
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
  display: flex;
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
  display: flex;
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
  display: flex;
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

const Inner = styled.div`
  display: flex;
  position: absolute;
  width: 512px;
  height: 56px;
  text-align: center;
  font: normal normal medium 20px/32px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    /* Layout Properties */
    position: absolute;
    top: 32px;
    left: 0px;
    width: 307px;
    height: 24px;
    /* UI Properties */
    text-align: center;
    font: normal normal medium 20px/32px Pretendard;
    letter-spacing: 0px;
    color: #8600f0;
  }
`;

const StFooter = styled.footer`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c1c1c1 0% 0% no-repeat padding-box;
`;
