import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../../css/fonts/Fonts.css";

const ListSideBar = () => {
  const navigate = useNavigate();

  const setting = () => {
    alert("준비중인 기능입니다.");
  };

  const [selectedItem, setSelectedItem] = useState("전체 라이브룸");

  useEffect(() => {
    const selected = localStorage.getItem("selectedItem");
    if (selected) {
      setSelectedItem(selected);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedItem", selectedItem);
  }, [selectedItem]);

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);

    if (itemName === "마이페이지") {
      setSelectedItem("마이페이지");
      setTimeout(() => {
        gotoMypage();
      }, 50);
    } else if (itemName === "전체 라이브룸") {
      setSelectedItem("전체 라이브룸");
      localStorage.setItem("selectedItem", "전체 라이브룸");
      gotoList();
    }
  };

  const gotoMypage = () => {
    navigate("/Mypage");
  };

  const gotoList = () => {
    navigate("/RoomList");
  };

  const goToLanding = () => {
    navigate("/");
  };

  return (
    <Container>
      <Logo onClick={goToLanding}>
        <img src={process.env.PUBLIC_URL + "/asset/images/Logo.png"} />
        {/* <span>두</span>런<span>두</span>런 */}
      </Logo>
      <Menu>
        <Room
          onClick={() => {
            handleItemClick("전체 라이브룸");
            gotoList();
          }}
          className={selectedItem === "전체 라이브룸" ? "on" : ""}
        >
          <img
            src={
              selectedItem === "전체 라이브룸"
                ? process.env.PUBLIC_URL + "/asset/images/side/Room_On.png"
                : process.env.PUBLIC_URL + "/asset/images/side/Room_Off.png"
            }
          />
          <span>전체 라이브룸</span>
        </Room>
        <History
          onClick={() => {
            alert("준비중입니다");
          }}
          className={selectedItem === "참여히스토리" ? "on" : ""}
        >
          <img
            src={
              selectedItem === "참여히스토리"
                ? process.env.PUBLIC_URL + "/asset/images/side/History_On.png"
                : process.env.PUBLIC_URL + "/asset/images/side/History_Off.png"
            }
          />
          <span>참여히스토리</span>
        </History>
        <Mypage
          onClick={() => {
            handleItemClick("마이페이지");
          }}
          className={selectedItem === "마이페이지" ? "on" : ""}
        >
          <img
            src={
              selectedItem === "마이페이지"
                ? process.env.PUBLIC_URL + "/asset/images/side/Mypage_On.png"
                : process.env.PUBLIC_URL + "/asset/images/side/Mypage_Off.png"
            }
          />
          <span>마이페이지</span>
        </Mypage>
        <Info onClick={setting}>
          <img
            src={
              selectedItem === "서비스 소개"
                ? process.env.PUBLIC_URL + "/asset/images/side/Service_On.png"
                : process.env.PUBLIC_URL + "/asset/images/side/Service_Off.png"
            }
          />
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
  cursor: pointer;
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
  img {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  .on {
    width: 180px;
    background: #f6e9ff 0% 0% no-repeat padding-box;
    border-radius: 8px;
    opacity: 1;
  }
`;

const Room = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
  border-radius: 8px;
  padding: 8px 10px;
  /* UI Properties */
  text-align: left;
  font: bold 16px/24px Pretendard;
  opacity: 1;
  span {
    margin-left: 10px;
    color: #333333;
  }
`;

const History = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: bold 16px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    margin-left: 10px;
    color: #333333;
  }
`;

const Mypage = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: bold 16px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    margin-left: 10px;
    color: #333333;
  }
`;

const Info = styled.div`
  display: flex;
  cursor: pointer;
  width: 100%;
  height: 40px;
  margin-top: 35px;
  margin-left: 55px;
  border-radius: 8px;
  padding: 8px 10px;

  /* UI Properties */
  text-align: left;
  font: bold 16px/24px Pretendard;
  letter-spacing: 0px;
  opacity: 1;
  span {
    margin-left: 10px;
    color: #333333;
  }
`;
