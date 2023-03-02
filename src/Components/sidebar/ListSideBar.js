import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../../css/fonts/Fonts.css";

const ListSideBar = () => {
  const navigate = useNavigate();
  const gotoLanding = () => {
    navigate("/");
  };
  const gotoMypage = () => {
    navigate("/mypage");
  };
  const setting = () => {
    alert("준비중인 기능입니다.");
  };

  const [on, setOn] = useState(true);

  return (
    <Container>
      <Logo onClick={gotoLanding}>
        <span>두</span>런<span>두</span>런
      </Logo>
      <Menu>
        <Room onClick={() => setOn(true)} className={on ? "on" : ""}>
          <span>개설된 라이브룸</span>
        </Room>
        <History onClick={() => setOn(false)} className={on ? "" : "on"}>
          <span>참여히스토리</span>
        </History>
        <Mypage onClick={gotoMypage}>
          <span>마이페이지</span>
        </Mypage>
        <Info onClick={setting}>
          <span>서비스 소개</span>
        </Info>
      </Menu>
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
  font: normal 33px/69px LottriaChab;
  letter-spacing: 0px;
  opacity: 1;
  span {
    color: #8600f0;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  .on {
    width: 180px;
    background: #f6e9ff 0% 0% no-repeat padding-box;
    border-radius: 8px;
    opacity: 1;
  }
`;

const Room = styled.div`
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
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
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
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
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
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
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
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
