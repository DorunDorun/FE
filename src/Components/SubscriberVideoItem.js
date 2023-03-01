import React, { useState, useEffect } from 'react'
import styled from "styled-components";

import UserVideoComponent from "./UserVideoComponent";
import {BsCameraVideo} from 'react-icons/bs';
import {BsCameraVideoOff} from 'react-icons/bs';
import {BsMic} from 'react-icons/bs';
import {BsMicMute} from 'react-icons/bs';

//css
import { COLOR } from './style/style';

const SubscriberVideoItem = ({
    sub,
    subscriberSpeakerConnectionId,
    subStreamConnectionConnectionId,
    onClickMainVideo,
    onClickSubscriberVideoToggle,
    onClickSubscriberAudioToggle,
    userNickName,
}) => {

    useEffect(()=>{
        console.log("😀 list map userNickName: ", userNickName)
    },[])

    const [isVideoStatus, setIsVideoStatus]=useState(true)
    const [isAudioStatus, setIsAudioStatus]=useState(true)

    const onClickSubscriberItemVideoToggle=()=>{
        onClickSubscriberVideoToggle()
        setIsVideoStatus(!isVideoStatus)
    }

    const onClickSubscriberItemAudioToggle=()=>{
        onClickSubscriberAudioToggle()
        setIsAudioStatus(!isAudioStatus)
    }


  return (
    <div className="sessionStreamBox">
        {console.log("✔✔✔ subscribers : ", sub)}
        <StSubscribersSessionStreamInnerBox
        className={
            subscriberSpeakerConnectionId ===
            subStreamConnectionConnectionId && "isSpeaker"
        }
        onClick={onClickMainVideo}
        >
        <StStreamNickNamePublisher>
            {userNickName} 님
        </StStreamNickNamePublisher>
        <UserVideoComponent streamManager={sub} />
        <StStreamControlButtonBox>
            <StButtonDeviceOnOff
            fontColor="red"
            onClick={onClickSubscriberItemVideoToggle}
            >
            {/*sub.stream.connection.stream.videoActive ? <BsCameraVideo/> : <BsCameraVideoOff className="off"/>*/}
            {isVideoStatus ? <BsCameraVideo/> : <BsCameraVideoOff className="off"/>}
            </StButtonDeviceOnOff>
            <StButtonDeviceOnOff
            fontColor="red"
            onClick={onClickSubscriberItemAudioToggle}
            >
            {/*sub.stream.connection.stream.audioActive ? <BsMic/> : <BsMicMute className="off"/>*/}
            {isAudioStatus ? <BsMic/> : <BsMicMute className="off"/>}
            </StButtonDeviceOnOff>
        </StStreamControlButtonBox>
        </StSubscribersSessionStreamInnerBox>
    </div>
  )
}






const StButtonDeviceOnOff=styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: ${COLOR.baseLight};;
  font-size: 22px;
  cursor: pointer;
  :hover{
    color: ${COLOR.baseDefault};
  }
`
const StStreamControlButtonBox = styled.div`
  position: absolute;
  bottom: 5px;
  right: 10px;
  z-index: 1;
  display: flex;
  flex-direction: row;
  column-gap: 10px;
`;

const StStreamNickNamePublisher = styled.span`
  display: inline-block;
  max-width: 92%;
  min-width: 46px;
  max-height: 41px;
  line-height: 1.1;
  overflow: hidden;  
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1;
  color: #fff;
  padding: 6px 16px;
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const StSubscribersSessionStreamInnerBox=styled.div`
  width: 100%;
  min-height: 140px;
  height: 100%;
  border-radius: 5px;
  position: relative;
  border: 3px solid transparent;
  box-sizing: border-box;
`





export default SubscriberVideoItem