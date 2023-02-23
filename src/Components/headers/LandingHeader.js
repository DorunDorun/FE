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
      <Room onClick={gotoRoom}>라이브룸</Room>
      <Info onClick={gotoInfo}>만든 사람들</Info>
      <Notice onClick={gotoNotice}>공지사항</Notice>
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
  border: 1px solid purple;
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
  left: 200px;
  width: 70px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #a5a5a5;
  opacity: 1;
`;

const Info = styled.div`
  /* Layout Properties */

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 300px;
  width: 100px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #a5a5a5;
  opacity: 1;
`;

const Notice = styled.div`
  /* Layout Properties */

  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 430px;
  width: 70px;
  height: 24px;
  /* UI Properties */
  text-align: left;
  font: 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #a5a5a5;
  opacity: 1;
`;

const Login = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 83px;
  height: 35px;
  left: 1748px;
  background-color: #8600f0;
  color: #ffffff;
  border: none;
  border-radius: 10px;
`;
