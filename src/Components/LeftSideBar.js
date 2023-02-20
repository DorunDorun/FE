import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const LeftSideBar = ({ width = 280 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [xPosition, setX] = useState(width);
  const side = useRef();

  // button 클릭 시 토글
  const toggleMenu = () => {
    if (xPosition > 0) {
      setX(0);
      setIsOpen(true);
    } else {
      setX(width);
      setIsOpen(false);
    }
  };

  // 사이드바 외부 클릭시 닫히는 함수
  const handleClose = async (e) => {
    let sideArea = side.current;
    let sideCildren = side.current.contains(e.target);
    if (isOpen && (!sideArea || !sideCildren)) {
      setX(width);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClose);
    window.removeEventListener("click", handleClose);
    // return () => {
    //     window.removeEventListener("click", handleClose);
    // };
  }, [handleClose]);

  return (
    <Container>
      <Opnebar
        ref={side}
        style={{
          width: `${width}px`,
          height: "100%",
          transform: `translatex(${-xPosition}px)`,
        }}
      >
        <Button>
          {isOpen ? (
            <OpenBtn>
              <div onClick={() => toggleMenu()}>프레임</div>
              <div onClick={() => toggleMenu()}>명언</div>
              <div onClick={() => toggleMenu()}>오디오</div>
            </OpenBtn>
          ) : (
            <OpenBtn>
              <div onClick={() => toggleMenu()}>프레임</div>
              <div onClick={() => toggleMenu()}>명언</div>
              <div onClick={() => toggleMenu()}>오디오</div>
            </OpenBtn>
          )}
        </Button>
        <Content>
          <div onClick={() => toggleMenu()}>프레임</div>
          <div onClick={() => toggleMenu()}>명언</div>
          <div onClick={() => toggleMenu()}>오디오</div>
        </Content>
        {/* //사이드바 컴포넌트 내부 값이 구현되는 위치 */}
      </Opnebar>
    </Container>
  );
};

export default LeftSideBar;

// const Container = styled.div``;

const Container = styled.div`
  background-color: #e3ecf1;
`;

const Opnebar = styled.div`
  background-color: #ffffff;
  border-right: 1px solid #202020;
  position: fixed;
  top: 70px;
  left: 40;
  transition: 0.4s ease;
  color: #202020;
  height: 100%;
  z-index: 99;
`;

const Button = styled.button`
  position: relative;
  left: 280px;
  top: 0px;
  width: 40px;
  height: 100vh;
  z-index: 99;
  transition: 0.8s ease;
  border: 1px solid #202020;
  /* border-radius: 40px; */
  overflow: hidden;
`;

const OpenBtn = styled.div`
  display: flex;
  /* flex-direction: column; */
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
