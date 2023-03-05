import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import LandingHeader from "../Components/headers/LandingHeader";
import "../css/fonts/Fonts.css";
import { BsFillCircleFill } from "react-icons/bs";

//스토어 랜딩
import { Landingstore } from "../zustand/storeLanding";

const Landing = () => {
  const [count, setCount] = useState(0);

  function handleCountEvent(receive) {
    setCount(receive.chatRoomCount);
  }

  const fetchData = Landingstore((state) => state.fetch);
  const data = Landingstore((state) => state.data);
  const loading = Landingstore((state) => state.loading);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const sse = new EventSource("https://dorundorun.shop/api/sse");

    sse.addEventListener("connect", (e) => {
      // console.log("e : ", e);
      let receive = JSON.parse(e.data);
      // console.log("연결 현재 채팅방 수 :", receive); // "connected!"
      handleCountEvent(receive);
    });

    sse.onerror = function (event) {
      if (event.readyState == EventSource.CLOSED) {
        // console.log("SSE 연결이 종료되었습니다.");
      } else {
        // console.log("SSE 연결이 에러로 인해 종료되었습니다.");
      }
    };

    sse.addEventListener("count", (e) => {
      // console.log("e : ", e);
      let receive = JSON.parse(e.data);
      // console.log("현재 채팅방 수 : ", receive);
      handleCountEvent(receive);
    });

    // cleanup function
    return () => {
      sse.close();
    };
  }, []);

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

  if (loading) {
    return <div>Loading...</div>;
  }

  const totalHour = data?.data?.totalHour;
  const totalRoom = data?.data?.totalRoom;
  return (
    <>
      <Container>
        <LandingHeader />
        <LandingImage />
        <Duruning>
          <div>
            <BsFillCircleFill color="#8600F0" />
          </div>
          <span>{count}개의 꿈을 두런두런 중</span>
        </Duruning>
        <Main>
          <span>Do</span> Your
          <div>
            <span>Run</span>ning for Goal
          </div>
        </Main>
        <Text>
          [두런두런]은 같은 취향, 관심사, 목표를 가진 사람들과 두런두런 이야기를
          나누고, 그 순간을 사진으로 기록할 수 있는 공간입니다.
        </Text>
        <In onClick={gotoRoom}>
          <span>방 둘러보기</span>
        </In>
        <Total>
          <p>{totalRoom}+</p>
          <span>그동안 {totalRoom}개 이상의 라이브 방이 개설되었어요</span>
        </Total>
        <Time>
          <p>{totalHour}+</p>
          <span>그동안 {totalHour}시간 이상의 라이브 시간이 누적되었어요</span>
        </Time>
      </Container>
      <StFooter></StFooter>
    </>
  );
};

export default Landing;

const Container = styled.div`
  background: transparent
    linear-gradient(116deg, #a74bef 0%, #8600f0 51%, #a74bef 100%) 0% 0%
    no-repeat padding-box;
  opacity: 1;
  width: 100%;
  height: calc(100vh - 50px);
`;

const LandingImage = styled.div`
  display: flex;
  background: url("${process.env.PUBLIC_URL}/asset/images/Landing_Image.png");
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: 70%;
  background-attachment: fixed;
  background-repeat: no-repeat;
  background-position: left 140% top 25%;
  position: absolute;
  opacity: 1;
  width: 100%;
  height: calc(100vh - 100px);
`;

const Duruning = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 227px;
  left: 140px;
  width: 270px;
  height: 44px;
  /* UI Properties */
  background-color: #fbfbfb 0% 0% no-repeat padding-box;
  border: 1px solid #fbfbfb;
  border-radius: 20px;
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  opacity: 1;
  div {
    margin-left: 10px;
  }
  span {
    display: flex;
    width: 250px;
    height: 24px;
    margin-left: 10px;
    text-align: left;
    font: 20px/24px Pretendard;
    letter-spacing: 0px;
    color: #fbfbfb;
    opacity: 1;
  }
`;

const Main = styled.div`
  position: absolute;
  top: 290px;
  left: 140px;
  width: 461px;
  height: 180px;
  /* UI Properties */
  text-align: left;
  font: 64px/84px LottriaChab;
  letter-spacing: 0px;
  color: #e1bbff;
  opacity: 1;
  span {
    color: #fbfbfb;
  }
  div {
    width: 600px;
    height: 180px;
  }
`;

const Text = styled.div`
  position: absolute;
  top: 497px;
  left: 140px;
  width: 470px;
  height: 58px;
  line-height: 25px;
  text-align: left;
  font: medium 20px/34px Pretendard;
  letter-spacing: 0px;
  color: #ffffff;
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
  width: 244px;
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

const Total = styled.div`
  p {
    /* Layout Properties */
    position: absolute;
    top: 717px;
    left: 140px;
    width: 121px;
    height: 58px;
    /* UI Properties */
    text-align: left;
    font: 32px/84px LottriaChab;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
  }
  span {
    /* Layout Properties */
    position: absolute;
    top: 780px;
    left: 140px;
    width: 190px;
    height: 24px;
    margin-top: 17px;
    text-align: left;
    line-height: 25px;
    font: medium 16px/26px Pretendard;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 0.8;
  }
`;

const Time = styled.div`
  p {
    /* Layout Properties */
    position: absolute;
    top: 717px;
    left: 384px;
    width: 121px;
    height: 58px;
    /* UI Properties */
    text-align: left;
    font: 32px/84px LottriaChab;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
  }
  span {
    /* Layout Properties */
    position: absolute;
    top: 780px;
    left: 384px;
    width: 204px;
    height: 24px;
    margin-top: 17px;
    text-align: left;
    line-height: 25px;
    font: medium 16px/26px Pretendard;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 0.8;
  }
`;

const StFooter = styled.footer`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c1c1c1 0% 0% no-repeat padding-box;
`;
