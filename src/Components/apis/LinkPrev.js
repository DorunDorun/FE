import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from "styled-components";

//아이콘
import { BsArrowLeftCircle } from "react-icons/bs";
//css
import { COLOR } from "../style/style";


const LinkPrev = () => {

  const navigate = useNavigate()

  const onClickGoPrev=()=>{
    return navigate(-1)
  }

  return (
    <StButtonNormal onClick={onClickGoPrev}>
      <BsArrowLeftCircle/>
    </StButtonNormal>
  )
}


const StButtonNormal=styled.button`
  background-color: transparent;
  border: none;
  font-size: 30px;
  position: absolute;
  left: -55px;
  top: 0;
  color: ${COLOR.grayLight};
  cursor: pointer;
  :hover{
    color: ${COLOR.baseDefault};
  }
`


export default LinkPrev