import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../../css/fonts/Fonts.css";

const Header = () => {
  const name = localStorage.getItem("name");
  const thumbnail = localStorage.getItem("thumbnail_image_url");
  const navigate = useNavigate();

  return (
    <HearderContainer>
      <Logo>
        <span>두</span>런<span>두</span>런
      </Logo>
      {/* <Room onClick={gotoLive}>라이브 룸</Room>
      <Mypage onClick={gotoMyPage}>마이페이지</Mypage>
      <Info onClick={gotoInfo}>서비스 소개</Info> */}
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
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  /* width: 100%; */
  height: 70px;
  border-bottom: 3px solid #a12aff;
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

const Info = styled.div`
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

const Thumbnail = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
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
