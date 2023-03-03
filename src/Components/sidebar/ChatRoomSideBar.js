import { useState, useRef } from "react";
import styled from "styled-components";
import HorizonLine from "../horizon/HorizonLine";
import Palette, {
  PCheers,
  PCaramelldanse,
  PCat,
  PForest,
  PGarden,
  PMorningDew,
  PVolcano,
} from "../Palette";

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
          프레임
        </Button>
        <Button
          active={activeButton === "명언"}
          onClick={() => toggleSidebar("명언", "명언 내용을 여기에 넣으세요.")}
        >
          명언
        </Button>
        <Button
          active={activeButton === "오디오"}
          onClick={() =>
            toggleSidebar("오디오", "오디오 내용을 여기에 넣으세요.")
          }
        >
          오디오
        </Button>
      </Btns>
      <Openbar isOpen={isOpen}>
        {sidebarContent.title === "프레임" && (
          <div>
            <Stmenu>
              <StColor onClick={handleColorClick}>컬러</StColor>
              <StDesign onClick={handleDesignClick}>디자인</StDesign>
            </Stmenu>
            <HorizonLine />
            {showColor && (
              <StChoice>
                <Palette />
              </StChoice>
            )}

            {showDesign && <StChoice></StChoice>}
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
            <h3>오디오</h3>
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
  height: 100%;
  align-items: flex-start;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.active ? "#F4E7FF" : "#fff")};
  border: none;
  width: 69.1px;
  height: 60px;
  z-index: 1;
`;

const Openbar = styled.div`
  position: absolute;
  top: 0;
  left: 70px;
  width: 228.5px;
  height: 100%;
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
  background-color: #fff;
  border: none;
  text-align: left;
  font: normal 16px/24px Pretendard;
  letter-spacing: 0px;
  color: #8e00ff;
  opacity: 1;
  margin-left: 10px;
`;

const StDesign = styled.button`
  background-color: #fff;
  border: none;
  text-align: left;
  font: normal 16px/24px Pretendard;
  letter-spacing: 0px;
  color: #8e00ff;
  opacity: 1;
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
