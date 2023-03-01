import { useState, useRef } from "react";
import styled from "styled-components";

const ChatRoomSideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [btnWidth, setBtnWidth] = useState(0);
  const [btnX, setBtnX] = useState(0);
  const buttonRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    setBtnWidth(buttonRef.current.offsetWidth);
    setBtnX(buttonRef.current.offsetLeft);
  };

  return (
    <Container>
      <Btns>
        <Button ref={buttonRef} onClick={toggleSidebar}>
          프레임
        </Button>
        <Button ref={buttonRef} onClick={toggleSidebar}>
          명언
        </Button>
        <Button ref={buttonRef} onClick={toggleSidebar}>
          오디오
        </Button>
      </Btns>

      <Openbar isOpen={isOpen} btnWidth={btnWidth}>
        Sidebar
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
  background-color: #fff;
  border-right: 1px solid gray;
  border-top: none;
  border-bottom: none;
  border-left: none;
  margin-top: 30px;
  width: 70px;
  z-index: 1;
`;

const Openbar = styled.div`
  position: absolute;
  top: 0;
  left: 70px;
  width: 228.5px;
  height: 100%;
  background-color: #fff;
  transform: translateX(${(props) => (props.isOpen ? "0" : "-100%")});
  transition: transform 0.2s ease-in-out;
  margin-left: ${(props) => (props.isOpen ? "0" : props.btnWidth + "px")};
`;
