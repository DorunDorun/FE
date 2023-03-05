import React from "react";
import styled from "styled-components";

const Wait = () => {
  return (
    <Container>
      <Stop>잠시만 기다려주세요 ...</Stop>
      {/* <img src={`${process.env.PUBLIC_URL}/asset/images/Loading.png`} /> */}
    </Container>
  );
};

export default Wait;

const Container = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100vh;
  img {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 418px;
    left: 698px;
    width: 525px;
    height: 394px;
    background: transparent url("img/이미지 3.png") 0% 0% no-repeat padding-box;
    opacity: 1;
  }
`;

const Stop = styled.div`
  /* Layout Properties */
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 313px;
  left: 758px;
  width: 404px;
  height: 57px;
  /* UI Properties */
  text-align: center;
  font: 40px/84px LottriaChab;
  letter-spacing: 0px;
  color: #171717;
  opacity: 1;
`;
