import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/headers/Header";
import "../css/fonts/Fonts.css";

const MyPage = () => {
  const navigate = useNavigate();

  const email = localStorage.getItem("email");
  const social = localStorage.getItem("social");
  const thumbnail = localStorage.getItem("profile");

  const logOut = async () => {
    await localStorage.clear();
    navigate("/");
  };

  return (
    <>
      <Container>
        <Header />
        <PageName>
          <span>마이 페이지</span>
        </PageName>
        <Myinfo>
          <img src={thumbnail} />
          <Acount>
            <span>계정&nbsp;&nbsp;&nbsp; {email}</span>
          </Acount>
          <Stsocial>
            <span>소셜&nbsp;&nbsp;&nbsp; {social}</span>
          </Stsocial>
          <Bye onClick={logOut}>로그아웃</Bye>
        </Myinfo>
      </Container>
      <StFooter></StFooter>
    </>
  );
};

export default MyPage;

const Container = styled.div`
  background: #f5e8ff 0% 0% no-repeat padding-box;
  opacity: 1;
  width: 100%;
  height: calc(100vh - 50px);
`;

const PageName = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  width: 352px;
  height: 52px;
  span {
    display: flex;
    text-align: left;
    font: normal 36px/84px LottriaChab;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const Myinfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  width: 352px;
  height: 408px;
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 16px;
  opacity: 1;
  img {
    display: flex;
    object-fit: cover;
    position: absolute;
    top: 50px;
    width: 150px;
    height: 150px;
    border-radius: 100px;
  }
`;

const Acount = styled.div`
  display: flex;
  span {
    display: flex;
    text-align: left;
    font: normal 800 16px/19px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const Stsocial = styled.div`
  display: flex;
  span {
    display: flex;
    text-align: left;
    font: normal 800 16px/19px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const Bye = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 246px;
  height: 44px;
  background-color: #fff;
  border: 1px solid #a74bef;
  border-radius: 8px;
  font: normal 600 16px/19px Pretendard;
  letter-spacing: 0px;
  color: #8600f0;
  opacity: 1;
`;

const StFooter = styled.footer`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #c1c1c1 0% 0% no-repeat padding-box;
`;
