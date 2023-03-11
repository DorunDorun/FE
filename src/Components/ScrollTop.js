import React from 'react'
import styled from 'styled-components'

const ScrollTop = ({onClick, display}) => {

    const scrollTopImage = process.env.PUBLIC_URL+"/asset/images/button/scrollTop.png"


  return (
    <StButton 
        onClick={onClick} title="위로 올라가기"
        display={display}
    >
        <StImg src={scrollTopImage} alt="위로 올라가기"/>
    </StButton>
  )
}


const StButton=styled.button`
    display: ${(props)=>props.display};
    border: none;
    background: none;
    position: fixed;
    bottom: 6%;
    right: 9%;
    cursor: pointer;
    :hover{
        transform: scale(1.15);
    }
`
const StImg=styled.img`
    
`

export default ScrollTop
