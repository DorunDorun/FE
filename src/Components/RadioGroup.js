import React from 'react'
import styled from 'styled-components'
import {COLOR} from './style/style.js'


const RadioGroup = ({
  categoryName, value, imageUrl, onChange, checked,
  width, height, labelBg, borderRadius, textDisplayNone
}) => {
  return (
    <>
      <StRadioGroupBox width={width} height={height}>
        <StLabel htmlFor={categoryName} 
          borderColor={checked ? `${COLOR.baseDefaultBold}` : "transparent"}
          labelBg={labelBg} borderRadius={borderRadius}
        >
          <StCaterogyImg src={process.env.PUBLIC_URL+imageUrl}/>
          <StInputDefault
              id={categoryName}
              type="radio"
              name="roomCategory"
              value={value}
              onChange={onChange}
              checked={checked}
              required
          />
        </StLabel>
        <StSpanNormal textDisplayNone={textDisplayNone}> {categoryName} </StSpanNormal>
      </StRadioGroupBox>
    </>
  )
}


const StSpanNormal=styled.span`
  font-weight: bold;
  display: ${(props)=>props.textDisplayNone || "block"};
  text-align: center;
  margin-top: 7px;
`
const StCaterogyImg=styled.img`
  width: 100%;
  border-radius: 4px;
`

const StInputDefault=styled.input.attrs(props=>({
    type: props.type || "radio",
}))`
  padding: 10px;
  margin:0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  appearance: none;
  border-radius: 4px;
  cursor: pointer;
  
  :focus-visible{
    outline-offset: 5px;
    outline: 5px solid tomato;
  }
`
const StLabel=styled.label`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 3px solid ${(props)=>props.borderColor};
    border-radius: ${(props)=>props.borderRadius || "4px"};
    background-color: ${(props)=>props.labelBg || "transparent"};
`
const StRadioGroupBox=styled.div`
  flex-basis: 22%;
  max-width: 140px;
  width: ${(props)=>props.width || "auto"};
  height: ${(props)=>props.height || "auto"};
  min-width: ${(props)=>props.width || "100px"};
  display: inline-block;
  position: relative;
  :hover{
    transform: scale(1.2);
  }
`


export default RadioGroup