import React from 'react'
import styled from 'styled-components'


const RadioGroup = ({categoryName, value, imageUrl, onChange, checked}) => {
  return (
    <>
      <StRadioGroupBox>
        <StLabel htmlFor={categoryName}>
          <StCaterogyImg src={imageUrl}/>
          <StInputDefault
              id={categoryName}
              type="radio"
              name="roomCategory"
              value={value}
              onChange={onChange}
              checked={checked}
              required
          />
          {categoryName}</StLabel>
      </StRadioGroupBox>
    </>
  )
}

const StCaterogyImg=styled.img`
  margin-bottom: 10px;
`

const StInputDefault=styled.input.attrs(props=>({
    type: props.type || "radio",
}))`
  padding:0;
  margin:0;
  position: absolute;
  top: -6%;
  left: -10%;
  width: 120%;
  height: 80%;
  z-index: 0;
  appearance: none;
  border-radius: 50%;
  cursor: pointer;
  :checked{
    border: 1px solid #8600F0;
  }
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
`
const StRadioGroupBox=styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`


export default RadioGroup