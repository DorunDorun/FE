import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Notice = () => {
  const navigate = useNavigate();
  const gotoLanding = () => {
    navigate("/");
  };
  const gotoRoom = () => {
    navigate("/room");
  };
  return (
    <Container>
      <div>공지사항</div>

      <LandingBack onClick={gotoLanding}>랜딩으로 돌아가기</LandingBack>
      <RoomBack onClick={gotoRoom}>룸으로 돌아가기</RoomBack>
    </Container>
  );
};

export default Notice;
const Container = styled.div``;

const LandingBack = styled.button`
  position: absolute;
  left: 150px;
  top: 0px;
`;

const RoomBack = styled.button`
  position: absolute;
  left: 300px;
  top: 0px;
`;
