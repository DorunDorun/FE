import React from 'react'
import styled from 'styled-components'
import { COLOR } from './style/style'

const UserMediaBackImage = ({userMediaBackImage, borderRadius, position}) => {
  return (
    <StRoomWaitingVideoOff borderRadius={borderRadius} position={position}>
        <StUserMediaBackImage src={userMediaBackImage}/>
    </StRoomWaitingVideoOff>
  )
}

const StUserMediaBackImage=styled.img.attrs(props=>({
    src: props.src,
}))`
    width: auto;
    height: auto;
    /*
    min-height: 140px;
    max-width: 150px;
    */
`
const StRoomWaitingVideoOff=styled.div`
  width: 100%;
  height: 100%;
  background-color: ${COLOR.baseDefaultOff};
  border-radius: ${(props)=>props.borderRadius || "14px"};
  display: flex;
  justify-content: center;
  align-items: center;
  position: ${(props)=>props.position || "static"};
`

export default React.memo(UserMediaBackImage)