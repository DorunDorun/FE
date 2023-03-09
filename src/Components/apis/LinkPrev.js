import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";

//아이콘
import { BsArrowLeftCircle } from "react-icons/bs";
//css
import { COLOR } from "../style/style";


const LinkPrev = ({title, roomDelete, hoverBgColor, left}) => {

  const navigate = useNavigate()

  const onClickGoPrev=()=>{
    roomDelete !== undefined && roomDelete()
    return navigate("/roomList")
  }

  return (
    <StButtonNormal onClick={onClickGoPrev} title={title || "뒤로가기"} 
      hoverBgColor={hoverBgColor || COLOR.baseDefault} left={left || "55px"}
    > 
      <BsArrowLeftCircle/>
    </StButtonNormal>
  )
}


const StButtonNormal=styled.button`
  background-color: transparent;
  border: none;
  font-size: 30px;
  position: absolute;
  left: ${(props)=>props.left};
  top: 0;
  color: ${COLOR.grayLight};
  cursor: pointer;
  :hover{
    color: ${(props)=>props.hoverBgColor};
  }
`


export default LinkPrev