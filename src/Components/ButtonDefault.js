import React from 'react'
import styled from 'styled-components'


function ButtonDefault({
    width, height, bgColor, hoverBgColor, fontColor, fontSize, lineHeight, 
    padding, hoverFontColor, onClick, children, borderRadius, boxShadow}) {
  return (
    <StButtonDefault 
    width={width} height={height} 
    fontSize={fontSize} fontColor={fontColor} bgColor={bgColor} 
    hoverBgColor={hoverBgColor} hoverFontColor={hoverFontColor}
    borderRadius={borderRadius} padding={padding} lineHeight={lineHeight}
    boxShadow={boxShadow}
    onClick={onClick}
    >{children}
    </StButtonDefault>
  )
}

const StButtonDefault=styled.button.attrs({
})`
    width: ${(props)=> props.width || '140px'};
    height: ${(props)=> props.height || '30px'};
    line-height: ${(props)=> props.lineHeight || 'normal'};
    border-radius: ${(props)=> props.borderRadius || '10px'};
    font-weight: bold;
    font-size: ${(props)=> props.fontSize || '16px'};
    padding: ${(props)=> props.padding || '0'};
    cursor: pointer;
    color: ${(props)=> props.fontColor || '#000'};
    background-color: ${(props)=> props.bgColor || 'transparent'};
    border: 1px solid ${(props)=> props.bgColor || '#e2e2e2'};
    box-shadow: ${(props)=> props.boxShadow || "none"};
    :hover{
        background-color: ${(props)=> props.hoverBgColor || 'transparent'};
        border: 1px solid ${(props)=> props.hoverBgColor || '#e2e2e2'};
        color: ${(props)=> props.hoverFontColor || '#fff'};
    }
`

export default ButtonDefault