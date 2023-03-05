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
        <span>두</span>런<span>두</span>런
      </Logo>
      <Login onClick={gotoLogin}>로그인</Login>
    </HearderContainer>
  );
};

export default LandingHeader;

const HearderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  /* width: 100%; */
  height: 70px;
`;

const Logo = styled.div`
  display: flex;
  text-align: center;
  margin-left: 20px;
  font-family: "LottriaChab";
  font-style: normal;
  font-weight: 400;
  font-size: 30px;
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
  margin-right: 20px;
  width: 115px;
  height: 40px;

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
