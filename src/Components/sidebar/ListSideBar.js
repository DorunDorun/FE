import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../../css/fonts/Fonts.css";

const ListSideBar = () => {
  const navigate = useNavigate();
  const gotoLive = () => {
    navigate("/roomList");
  };
  const gotoInfo = () => {
    navigate("/Info");
  };
  return (
    <Container>
      <Logo>
        <span>두</span>런<span>두</span>런
      </Logo>
      <Room>
        <span>개설된 라이브룸</span>
      </Room>
      <History>
        <span>참여히스토리</span>
      </History>
      <Mypage>
        <span>마이페이지</span>
      </Mypage>
      <Info>
        <span>서비스 소개</span>
      </Info>
    </Container>
  );
};

export default ListSideBar;

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: center;
  font: normal 33px/69px LottriaChab;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #8600f0;
  }
`;

const Room = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: normal 800 20px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #333333;
  }
`;

const History = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: normal 800 20px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #333333;
  }
`;

const Mypage = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: normal 800 20px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #333333;
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: normal 800 20px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #333333;
  }
`;
