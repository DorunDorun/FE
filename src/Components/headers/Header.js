import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../../css/fonts/Fonts.css";

const Header = () => {
  const name = localStorage.getItem("name");
  const thumbnail = localStorage.getItem("thumbnail_image_url");
  const navigate = useNavigate();
  const gotoLive = () => {
    navigate("/RoomList");
  };
  const gotoInfo = () => {
    navigate("/Info");
  };
  return (
    <HearderContainer>
      <Logo>
        <span>두</span>런<span>두</span>런
      </Logo>
      <Room onClick={gotoLive}>라이브 룸</Room>
      <Info onClick={gotoInfo}>서비스 소개</Info>
      <Thumbnail>
        <span>{name}</span>
        <img src={thumbnail} />
      </Thumbnail>
    </HearderContainer>
  );
};

export default Header;

const HearderContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 1920px;
  /* width: 100%; */
  height: 70px;
  border: 1px solid purple;
`;

const Logo = styled.div`
  position: absolute;
  width: 115px;
  height: 40px;
  left: 25px;
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

const Room = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  width: 83px;
  height: 29px;
  left: 320px;
  /* UI Properties */
  text-align: left;
  font: normal normal medium 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #a5a5a5;
  opacity: 1;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  width: 90px;
  height: 29px;
  left: 1550px;
  /* UI Properties */
  text-align: left;
  font: normal normal medium 20px/24px Pretendard;
  letter-spacing: 0px;
  color: #a5a5a5;
  opacity: 1;
`;

// const Myname = styled.div`
//   position: absolute;
//   width: 52px;
//   height: 24px;
//   left: 1748px;
//   font-family: "Pretendard";
//   font-style: normal;
//   font-weight: 500;
//   font-size: 20px;
//   line-height: 24px;
//   color: rgba(0, 0, 0, 0.7);
// `;

const Thumbnail = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  left: 1789px;
  border: none;
  background: url(thumbnail);
  span {
  }
  img {
    width: 48px;
    height: 48px;
    border-radius: 50px;
  }
`;
