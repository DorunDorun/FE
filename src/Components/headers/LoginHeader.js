import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const LoginHeader = () => {
  const navigate = useNavigate();
  const goToBack = () => {
    navigate("/");
  };

  return (
    <HearderContainer>
      <Text>로그인</Text>
      <BackPage onClick={goToBack}>X</BackPage>
    </HearderContainer>
  );
};

export default LoginHeader;

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

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 929px;
  width: 80px;
  height: 29px;

  /* UI Properties */
  text-align: center;
  font: normal normal 600 24px/29px Pretendard;
  letter-spacing: 0px;
  color: #171717;
  opacity: 1;
`;

const BackPage = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 1208px;
  width: 20px;
  height: 20px;
  transform: matrix(0, 1, -1, 0, 0, 0);
  border: none;
  background-color: #fff;
`;
