import React from 'react'
import styled from 'styled-components'

const WhiteBoard = ({className}) => {
    const classNameProps=className
  return (
    <StWhiteBoardWrap display={classNameProps}>
      <StWhiteBoardContainer>
        <StWhiteBoard></StWhiteBoard>
      </StWhiteBoardContainer>
    </StWhiteBoardWrap>
  )
}




const StWhiteBoard=styled.div `
    width: 91%;
    height: 100%;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    box-shadow: 0px 3px 6px #00000029;
`
const StWhiteBoardContainer=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`
const StWhiteBoardWrap=styled.div`
    display: ${(props)=>props.display || "none"};
    width: 100%;
    height: calc(96% - 186px);
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 2;
`

export default WhiteBoard