import React from "react";
import {
  GOOGLE_AUTH_URL,
  KAKAO_AUTH_URL,
  NAVER_AUTH_URL,
} from "../../shared/OAuth";
import styled from "styled-components";
import LoginHeader from "../../Components/headers/LoginHeader";
import "../../css/fonts/Fonts.css";

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
          오늘&nbsp;하루도&nbsp;<span>두런두런</span>&nbsp;하세요&nbsp;!
        </Text>
        <div>
          <KakaoBtn onClick={goToKakao}>
            <span>카카오로 간편 로그인</span>
          </KakaoBtn>
          <NaverBtn onClick={goToNaver}>
            <span>네이버로 간편 로그인</span>
          </NaverBtn>
          <GoogleBtn onClick={goToGoogle}>
            <span>구글로 간편 로그인</span>
          </GoogleBtn>
        </div>
        <Inner>
          두런두런은 별도의 회원가입 없이 <br />
          <span>SNS 계정을 통한 간편 로그인/로그아웃</span>을 통해&nbsp;
          이용가능합니다 :)
        </Inner>
      </Container>
      <StFooter></StFooter>
    </>
  );
};

export default Login;
const Container = styled.div`
  display: flex;
  background-color: #fff;
  width: 100%;
  height: calc(100vh - 50px);
`;

const Text = styled.text`
  display: flex;
  position: absolute;
  top: 197px;
  left: 692px;
  /* border: 1px solid black; */
  width: 536px;
  height: 52px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font: normal 36px/84px LottriaChab;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #8600f0;
  }
`;

const KakaoBtn = styled.button`
  display: flex;
  position: absolute;
  top: 307px;
  left: 692px;
  background: #ffe900 0% 0% no-repeat padding-box;
  border: none;
  border-radius: 8px;
  opacity: 1;
  width: 536px;
  height: 56px;
  justify-content: center;
  align-items: center;
  span {
    font: normal 600 20px/24px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const GoogleBtn = styled.button`
  display: flex;
  display: flex;
  position: absolute;
  top: 451px;
  left: 692px;
  background-color: #fff;
  border: 2px solid #c1c1c1;
  border-radius: 8px;
  opacity: 1;
  width: 536px;
  height: 56px;
  justify-content: center;
  align-items: center;
  span {
    font: normal 600 20px/24px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const NaverBtn = styled.button`
  display: flex;
  position: absolute;
  top: 379px;
  left: 692px;
  border: 1px solid black;
  width: 536px;
  height: 56px;
  background: #00c73c 0% 0% no-repeat padding-box;
  border: none;
  border-radius: 8px;
  opacity: 1;
  justify-content: center;
  align-items: center;
  span {
    font: normal 600 20px/24px Pretendard;
    letter-spacing: 0px;
    color: #fbfbfb;
    opacity: 1;
  }
`;

const Inner = styled.div`
  position: absolute;
  top: 550px;
  left: 692px;
  width: 536px;
  height: 56px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font: 20px/32px Pretendard;
  font-size: medium;
  letter-spacing: 0px;
  opacity: 1;
  line-height: 20px;
  span {
    text-align: center;
    font: 20px/32px Pretendard;
    font-size: medium;
    letter-spacing: 0px;
    color: #8600f0;
    line-height: 5px;
  }
`;

const StFooter = styled.footer`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c1c1c1 0% 0% no-repeat padding-box;
`;
