import React from 'react'
import styled from 'styled-components'

const WhiteBoard = ({className}) => {
    const classNameProps=className
  return (
    <StWhiteBoard display={classNameProps}></StWhiteBoard>
  )
}


const StWhiteBoard=styled.div `
    width: calc(100% - 6px);
    height: 480px;
    position: absolute;
    top: 54px;
    left: 0;
    z-index: 2;
    background-color: #fff;
    border-radius: 10px;
    border: 1px solid #e2e2e2;
    display: ${(props)=>props.display || "none"}
`

export default WhiteBoard