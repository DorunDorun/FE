import React from 'react'
import styled from 'styled-components'

const WhiteBoard = ({className, isCapture}) => {
    const classNameProps=className
  return (
    <StWhiteBoardWrap display={classNameProps}>
      <StWhiteBoard boxShadow={isCapture ? "none" : "0px 3px 6px #00000029"}></StWhiteBoard>
    </StWhiteBoardWrap>
  )
}




const StWhiteBoard=styled.div `
    width: 91%;
    height: 100%;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    box-shadow: ${(props)=>props.boxShadow}
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