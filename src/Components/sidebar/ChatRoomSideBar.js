import { useState, useRef } from "react";
import styled from "styled-components";
import HorizonLine from "../horizon/HorizonLine";
import Palette from "../colorMenu/Palette";
import Design from "../colorMenu/Design";

const ChatRoomSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState({
    title: "",
    content: "",
  });
  const [activeButton, setActiveButton] = useState(null);

  const toggleSidebar = (title, content) => {
    if (title === sidebarContent.title) {
      setIsOpen(false);
      setActiveButton(null);
      setSidebarContent({ title: "", content: "" });
    } else {
      setIsOpen(true);
      setActiveButton(title);
      setSidebarContent({ title, content });
    }
  };

  const [showColor, setShowColor] = useState(true);
  const [showDesign, setShowDesign] = useState(false);

  const handleColorClick = () => {
    setShowColor(true);
    setShowDesign(false);
  };

  const handleDesignClick = () => {
    // alert("준비중인 기능입니다");
    setShowDesign(true);
    setShowColor(false);
  };

  return (
    <Container>
      <Btns>
        <Button
          active={activeButton === "프레임"}
          onClick={() =>
            toggleSidebar("프레임", "프레임 내용을 여기에 넣으세요.")
          }
        >
          <img
            src={process.env.PUBLIC_URL + "/asset/images/side/leftside_01.png"}
          />
          프레임
        </Button>
        <Button
          active={activeButton === "명언"}
          onClick={() => alert("준비중입니다.")}
          // onClick={() => toggleSidebar("명언", "명언 내용을 여기에 넣으세요.")}
        >
          <img
            src={process.env.PUBLIC_URL + "/asset/images/side/leftside_02.png"}
          />
          명언
        </Button>
        <Button
          active={activeButton === "오디오"}
          onClick={() => alert("준비중입니다.")}
          // onClick={() =>
          //   toggleSidebar("오디오", "오디오 내용을 여기에 넣으세요.")
          // }
        >
          <img
            src={process.env.PUBLIC_URL + "/asset/images/side/leftside_03.png"}
          />
          음악
        </Button>
      </Btns>
      <Openbar isOpen={isOpen}>
        {sidebarContent.title === "프레임" && (
          <div>
            <Stmenu>
              <StColor active={showColor} onClick={handleColorClick}>
                컬러
              </StColor>
              <StDesign active={showDesign} onClick={handleDesignClick}>
                디자인
              </StDesign>
            </Stmenu>
            <HorizonLine />
            {showColor && (
              <StChoice>
                <Palette />
              </StChoice>
            )}

            {showDesign && (
              <StChoice>
                <Design />
              </StChoice>
            )}
          </div>
        )}
        {sidebarContent.title === "명언" && (
          <StWise>
            <span>공부명언</span>
            <p>명언 내용을 여기에 넣으세요.</p>
          </StWise>
        )}
        {sidebarContent.title === "오디오" && (
          <div>
            <h3>음악</h3>
            <p>오디오 내용을 여기에 넣으세요.</p>
          </div>
        )}
      </Openbar>
    </Container>
  );
};
export default ChatRoomSideBar;

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const Btns = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-right: 1px solid gray;
  width: 70px;
  height: calc(100vh - 70px);
  align-items: flex-start;
`;

const Button = styled.button`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.active ? "#F4E7FF" : "#fff")};
  border: none;
  width: 69.1px;
  height: 60px;
  z-index: 1;
  span {
    text-align: center;
    font: bold 10px/12px Pretendard;
    letter-spacing: 0px;
    color: #fbfbfb;
    opacity: 1;
  }
`;

const Openbar = styled.div`
  position: absolute;
  top: 0;
  left: 70px;
  width: 228.5px;
  height: calc(100vh - 70px);
  border-right: 1px solid gray;
  background-color: #fff;
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
  transition: transform 0.2s ease-in-out;
`;

const Stmenu = styled.div`
  display: flex;
  margin-top: 10px;
  align-content: center;
  justify-content: flex-start;
  align-items: center;
`;

const StColor = styled.button`
  display: flex;
  cursor: pointer;
  background-color: #fff;
  border: none;
  text-align: left;
  font: normal 16px/24px Pretendard;
  letter-spacing: 0px;
  color: #8e00ff;
  opacity: 1;
  margin-left: 10px;
  width: 55px;
  height: 25px;
  text-decoration: ${(props) => (props.active ? "underline #8E00FF;" : "none")};
`;

const StDesign = styled.button`
  cursor: pointer;
  background-color: #fff;
  border: none;
  text-align: left;
  font: normal 16px/24px Pretendard;
  letter-spacing: 0px;
  color: #8e00ff;
  opacity: 1;
  margin-left: 10px;
  width: 55px;
  height: 25px;
  text-decoration: ${(props) => (props.active ? "underline #8E00FF;" : "none")};
`;

const StChoice = styled.div`
  span {
    display: flex;
    margin-top: 10px;
    margin-bottom: 3px;
    text-align: left;
    font: bold 14px/16px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
`;

const StWise = styled.div`
  span {
    display: flex;
    margin-left: 10px;
    text-align: left;
    font: bold 18px/47px Pretendard;
    letter-spacing: 0px;
    color: #000000;
    opacity: 1;
  }
`;
