import React from 'react'
import styled from 'styled-components'


const RadioGroupImage = ({imageUrl, imageName, onChange, checked}) => {
  return (
    <>  
        <StRadioGroupImageBox>
            <StInputDefault
                id={imageName}
                type="radio"
                name="joinRoomButtonImages"
                value={imageName}
                onChange={onChange}
                checked={checked}
            />
            <StLabel htmlFor={imageName}>
                <StJoinRoomButtonImage src={imageUrl} />
            </StLabel>
        </StRadioGroupImageBox>
    </>
  )
}

const StJoinRoomButtonImage=styled.img``
const StInputDefault=styled.input.attrs(props=>({
    type: props.type || "radio",
}))``
const StLabel=styled.label`
    margin:0 12px 0 4px;
`
const StRadioGroupImageBox=styled.div``

export default RadioGroupImage