import React from 'react'
import styled from 'styled-components'


const RadioGroup = ({categoryName, value, onChange, checked}) => {
  return (
    <>
        <StInputDefault
            id={categoryName}
            type="radio"
            name="roomCategory"
            value={value}
            onChange={onChange}
            checked={checked}
            required
        />
        <StLabel htmlFor={categoryName}>{categoryName}</StLabel>
    </>
  )
}


const StInputDefault=styled.input.attrs(props=>({
    type: props.type || "radio",
}))``
const StLabel=styled.label`
    padding:0 12px 0 4px;
`


export default RadioGroup