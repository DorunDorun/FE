import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiOutlineX } from "react-icons/hi";

const LoginHeader = () => {
  const navigate = useNavigate();
  const goToBack = () => {
    navigate("/");
  };

  return (
    <HearderContainer>
      <Text>로그인</Text>
      <BackPage onClick={goToBack}>
        <div>
          <HiOutlineX size="29" />
        </div>
      </BackPage>
    </HearderContainer>
  );
};

export default LoginHeader;

const HearderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 2px 8px #0000000f;
  width: 100%;
  height: 70px;
`;

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 250px;
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
  margin-left: 250px;
  width: 20px;
  height: 20px;
  transform: matrix(0, 1, -1, 0, 0, 0);
  border: none;
  background-color: #fff;
`;
