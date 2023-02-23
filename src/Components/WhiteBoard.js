import React from 'react'
import styled from 'styled-components'

const WhiteBoard = ({className}) => {
    const classNameProps=className
  return (
    <StWhiteBoard display={classNameProps}></StWhiteBoard>
  )
}


const StWhiteBoard=styled.div `
    display: ${(props)=>props.display || "none"};
    width: 100%;
    height: calc(100% - 186px);
    position: absolute;
    top: 100px;
    left: 0;
    z-index: 2;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #e2e2e2;
    box-shadow: 0px 3px 6px #00000029;
    
    
`

export default WhiteBoard