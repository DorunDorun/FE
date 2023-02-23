import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LandingHeader from "../Components/headers/LandingHeader";
import "../css/fonts/Fonts.css";

const Landing = () => {
  const token = localStorage.getItem("accessToken");
  const refresh = localStorage.getItem("refreshToken");
  const navigate = useNavigate();
  const gotoRoom = () => {
    if (token && refresh) {
      navigate("/RoomList");
    } else {
      navigate("/Login");
    }
  };
  return (
    <>
      <Container>
        <LandingHeader />
        <Duruning>
          <span>32개의 꿈을 두런두런 중</span>
        </Duruning>
        <Main>Do Your Running for Goal</Main>
        <Text>
          [두런두런]은 같은 취향, 관심사, 목표를 가진 사람들과 두런두런 이야기를
          나누고 그 순간을 기록할 수 있는 공간입니다.
        </Text>
        <In onClick={gotoRoom}>
          <span>방 둘러보기</span>
        </In>
        <Time>
          <p>370+</p>
          <span>이상의 시간동안 두런타임</span>
        </Time>
      </Container>
    </>
  );
};

export default Landing;

const Container = styled.div`
  /* background-color: #8600f0; */
  width: 100%;
  height: 100vh;
`;

const Duruning = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 227px;
  left: 140px;
  width: 259px;
  height: 44px;
  /* UI Properties */
  background-color: #efefef;
  border-radius: 22px;
  opacity: 1;
  span {
    display: flex;
    width: 195px;
    height: 24px;
    text-align: left;
    font: 20px/24px Pretendard;
    letter-spacing: 0px;
    color: #3d3d3d;
    opacity: 1;
  }
`;

const Main = styled.div`
  position: absolute;
  top: 290px;
  left: 140px;
  width: 597px;
  height: 176px;
  /* UI Properties */
  text-align: left;
  font: 64px/84px LottriaChab;
  letter-spacing: 0px;
  color: #171717;
  opacity: 1;
`;

const Text = styled.div`
  position: absolute;
  top: 497px;
  left: 140px;
  width: 497px;
  height: 54px;
  text-align: left;
  font: 20px/30px Pretendard;
  letter-spacing: 0px;
  color: #171717;
  opacity: 1;
`;

const In = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 591px;
  left: 140px;
  width: 172px;
  height: 56px;
  /* UI Properties */
  background: #171717 0% 0% no-repeat padding-box;
  border-radius: 16px;
  opacity: 1;
  span {
    /* Layout Properties */
    position: absolute;
    width: 92px;
    height: 24px;
    /* UI Properties */
    text-align: center;
    font: 20px/24px Pretendard;
    letter-spacing: 0px;
    color: #fbfbfb;
    opacity: 1;
  }
`;

const Time = styled.div`
  p {
    /* Layout Properties */
    position: absolute;
    top: 725px;
    left: 140px;
    width: 121px;
    height: 58px;
    /* UI Properties */
    text-align: left;
    font: bold 48px/58px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
  span {
    /* Layout Properties */
    position: absolute;
    top: 796px;
    left: 140px;
    width: 204px;
    height: 24px;
    text-align: left;
    font: 20px/30px Pretendard;
    letter-spacing: 0px;
    color: #333333;
    opacity: 1;
  }
`;
