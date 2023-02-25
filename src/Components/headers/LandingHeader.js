import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../../css/fonts/Fonts.css";

const LandingHeader = () => {
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
  const gotoInfo = () => {
    navigate("/Info");
  };
  const gotoNotice = () => {
    navigate("/Notice");
  };
  const gotoLogin = () => {
    if (token && refresh) {
      navigate("/RoomList");
    } else {
      navigate("/Login");
    }
  };
  return (
    <HearderContainer>
      <Logo>
        D<span>oo</span>Run
      </Logo>
      <Room onClick={gotoRoom}> 개설된 라이브룸</Room>
      <Info onClick={gotoInfo}>종료된 라이브룸</Info>
      <History onClick={gotoNotice}>참가 히스토리</History>
      <Mypage onClick={gotoNotice}>마이페이지</Mypage>
      <Notice onClick={gotoNotice}>서비스소개</Notice>
      <Login onClick={gotoLogin}>로그인</Login>
    </HearderContainer>
  );
};

export default LandingHeader;

const HearderContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 1920px;
  height: 70px;
  left: 0px;
`;

const Logo = styled.div`
  position: absolute;
  width: 115px;
  height: 40px;
  left: 25px;
  align-items: center;
  font-family: "LottriaChab";
  font-style: normal;
  font-size: 30px;
  font-weight: 400;
  font-size: 28px;
  line-height: 40px;
  span {
    color: #8600f0;
  }
`;

const Room = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 196px;
  width: 130px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: bold 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #6f6f6f;
  opacity: 1;
`;

const Info = styled.div`
  /* Layout Properties */

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 356px;
  width: 130px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: bold 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #6f6f6f;
  opacity: 1;
`;

const History = styled.div`
  /* Layout Properties */

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 516px;
  width: 110px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: bold 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #6f6f6f;
  opacity: 1;
`;

const Mypage = styled.div`
  /* Layout Properties */

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 1463px;
  width: 110px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: bold 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #6f6f6f;
  opacity: 1;
`;

const Notice = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 1603px;
  width: 110px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: bold 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #6f6f6f;
  opacity: 1;
`;

const Login = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 115px;
  height: 40px;
  left: 1748px;
  /* UI Properties */
  background: #a74bef 0% 0% no-repeat padding-box;
  border-radius: 16px;
  opacity: 1;
  border: none;
  text-align: center;
  font: normal 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #ffffff;
  opacity: 1;
`;
