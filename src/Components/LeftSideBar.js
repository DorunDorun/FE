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
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [handleClose]);

  return (
    <Container>
      <OpenBtn>
        <Button>
          {isOpen ? (
            <OpenBtn>
              <Content onClick={() => toggleMenu()}>프레임</Content>
              <Content onClick={() => toggleMenu()}>명언</Content>
              <Content onClick={() => toggleMenu()}>오디오</Content>
              <Opnebar
                ref={side}
                style={{
                  width: `${width}px`,
                  height: "100%",
                  transform: `translatex(${-xPosition}px)`,
                }}
              >
                <Content>색상</Content>
              </Opnebar>
            </OpenBtn>
          ) : (
            <OpenBtn>
              <Content onClick={() => toggleMenu()}>
                <span>프레임</span>
              </Content>
              <Content onClick={() => toggleMenu()}>
                <span>명언</span>
              </Content>
              <Content onClick={() => toggleMenu()}>
                <span>오디오</span>
              </Content>
              <Opnebar
                ref={side}
                style={{
                  width: `${width}px`,
                  height: "100%",
                  transform: `translatex(${-xPosition - 60}px)`,
                }}
              />
            </OpenBtn>
          )}
        </Button>
        <Opnebar ref={side} style={{}}></Opnebar>
      </OpenBtn>
    </Container>
  );
};

export default LeftSideBar;

const Container = styled.div``;

const Opnebar = styled.div`
  background-color: #ffffff;
  /* border-right: 1px solid #202020; */
  position: fixed;
  top: 70px;
  left: 60px;
  transition: 0.4s ease;
  color: #202020;
  height: 100%;
  z-index: 99;
`;

const Button = styled.button`
  position: relative;
  left: 0px;
  top: -617px;
  width: 60px;
  height: 100vh;
  z-index: 99;
  transition: 0.8s ease;
  /* border: 1px solid #202020; */
  /* border-radius: 40px; */
  overflow: hidden;
`;

const OpenBtn = styled.div`
  /* display: flex; */
  /* flex-direction: column; */
  /* align-items: center; */
  width: 100%;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40px;
  margin-top: 20px;
`;
