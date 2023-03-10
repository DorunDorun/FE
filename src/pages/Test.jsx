import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../Components/headers/Header";
import ListSideBar from "../Components/sidebar/ListSideBar";
import "../css/fonts/Fonts.css";
import MyPage from "./MyPage";

const Test = () => {
  return <></>;
};

export default Test;

const Container = styled.div`
  display: flex;
  justify-content: center;
  background-color: #fff;
  width: 1800px;
  background: #ffffff 0% 0% no-repeat padding-box;
  opacity: 1;
  height: calc(100vh - 50px);
`;

const StRoomListSideNav = styled.div`
  width: 300px;
  height: calc(100vh - 50px);
  border-right: 1px solid #dfdfdf;
`;

const InContainer = styled.div`
  width: 100%;
  display: block;
  padding: 36px 85px 36px 40px;
  margin: 0;
  font-size: 0;
  height: calc(100vh - 50px);
`;

const Myinfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin: auto;
  margin-top: 150px;
  width: 352px;
  height: 500px;
  background: #fbfbfb 0% 0% no-repeat padding-box;
  border-radius: 16px;

  opacity: 1;
  span {
    display: flex;
    text-align: left;
    font: normal 36px/84px LottriaChab;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
  img {
    display: flex;
    object-fit: cover;
    margin-bottom: 30px;
    width: 125px;
    height: 125px;

    border-radius: 100px;
  }
`;

const Acount = styled.div`
  display: flex;
  justify-content: flex-start;
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
  justify-content: flex-start;
  margin-right: 150px;
  margin-bottom: 50px;
  span {
    display: flex;
    text-align: left;
    font: normal 800 16px/19px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const StTest = styled.div`
  display: flex;
  flex-direction: column;
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
  margin-bottom: 30px;
  width: 246px;
  height: 44px;
  background-color: #d699ff;
  border: 1px solid #d699ff;
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
