import React, {useState} from 'react'
import styled from 'styled-components'
import queryString from "query-string";

function ButtonDefault({
    width, height, bgColor, hoverBgColor, fontColor, fontSize, lineHeight, 
    padding, margin, hoverFontColor, onClick, children, borderRadius, boxShadow, title,
    fontFamily, fontWeight, borderNormal, onValue}) {

      /*카테고리 목록 클릭 view 관련 코드*/
    const searchParams = window.location.search;
    const query = queryString.parse(searchParams);
    const qSearch = query.search
    const onValueStatus = qSearch !== undefined && qSearch === onValue



  return (
    <StButtonDefault 
    width={width} height={height} 
    fontSize={fontSize} fontColor={onValueStatus ? hoverFontColor : fontColor} bgColor={onValueStatus ? hoverBgColor : bgColor} 
    hoverBgColor={hoverBgColor} hoverFontColor={hoverFontColor}
    borderRadius={borderRadius} padding={padding} margin={margin}
    lineHeight={lineHeight} boxShadow={boxShadow}
    fontFamily={fontFamily} fontWeight={fontWeight}
    borderNormal={borderNormal}
    onClick={onClick}
    title={title}
    >{children}
    </StButtonDefault>
  )
}

const StButtonDefault=styled.button.attrs({
})`
    cursor: pointer;

    width: ${(props)=> props.width || '140px'};
    height: ${(props)=> props.height || '30px'};
    line-height: ${(props)=> props.lineHeight || 'normal'};
    border-radius: ${(props)=> props.borderRadius || '10px'};
    font-size: ${(props)=> props.fontSize || '16px'};
    font-family: ${(props)=> props.fontFamily || 'auto'};
    font-weight: ${(props)=> props.fontWeight || 'bold'};
    padding: ${(props)=> props.padding || '0'};
    color: ${(props)=> props.fontColor || '#000'};
    background-color: ${(props)=> props.bgColor || 'transparent'};
    border: ${(props)=> props.borderNormal || `1px solid ${props.bgColor}`};
    
    border: 1px solid ${(props)=> props.bgColor || '#e2e2e2'};
    box-shadow: ${(props)=> props.boxShadow || "none"};
    margin: ${(props)=>props.margin || "0"};
    :hover{
        background-color: ${(props)=> props.hoverBgColor || 'transparent'};
        border: 1px solid ${(props)=> props.hoverBgColor || '#e2e2e2'};
        color: ${(props)=> props.hoverFontColor || '#fff'};
    }
`

export default ButtonDefault