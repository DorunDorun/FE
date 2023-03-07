import React, { useState, useEffect} from "react";
import styled from "styled-components";

import UserVideoComponent from "./UserVideoComponent";
import { BsCameraVideo } from "react-icons/bs";
import { BsCameraVideoOff } from "react-icons/bs";
import { BsMic } from "react-icons/bs";
import { BsMicMute } from "react-icons/bs";
import UserMediaBackImage from "./UserMediaBackImage";
import ButtonImageList from "./lists/ButtonImageList";

//css
import { COLOR } from "./style/style";

const SubscriberVideoItem = ({
  sub,
  subscriberSpeakerConnectionId,
  subStreamConnectionConnectionId,
  onClickMainVideo,
  onClickSubscriberVideoToggle,
  onClickSubscriberAudioToggle,
  userNickName,
  userMediaBackImage,
}) => {

  const [isVideoStatus, setIsVideoStatus] = useState(true);
  const [isAudioStatus, setIsAudioStatus] = useState(true);

  const onClickSubscriberItemVideoToggle = () => {
    onClickSubscriberVideoToggle();
    setIsVideoStatus(!isVideoStatus);
    console.log("💥❌❌isVideoStatus : ", isVideoStatus)
  };

  const onClickSubscriberItemAudioToggle = () => {
    onClickSubscriberAudioToggle();
    setIsAudioStatus(!isAudioStatus);
    console.log("isAudioStatus : ", isAudioStatus)
  };

  //디바이스 on off 버튼
  const image = {
    videoOnS: ButtonImageList.video.onSmall,
    videoOffS: ButtonImageList.video.offSmall,
    audioOnS: ButtonImageList.audio.onSmall,
    audioOffS: ButtonImageList.audio.offSmall,
    videoOnM: ButtonImageList.video.onMedium,
    videoOffM: ButtonImageList.video.offMedium,
    audioOnM: ButtonImageList.audio.onMedium,
    audioOffM: ButtonImageList.audio.offMedium,
  };

  return (
    <div className="sessionStreamBox">
      <StSubscribersSessionStreamInnerBox
        className={
          subscriberSpeakerConnectionId === subStreamConnectionConnectionId &&
          "isSpeaker"
        }
        onClick={onClickMainVideo}
      >
        <StStreamNickNamePublisher>{userNickName} 님</StStreamNickNamePublisher>

        {/*비디오*/}
        <UserVideoComponent streamManager={sub} />

        <StStreamControlButtonBox>
          <StButtonDeviceOnOff
            fontColor="red"
            onClick={onClickSubscriberItemVideoToggle}
            bgColor={isVideoStatus ? COLOR.greenButtonOn : COLOR.redButtonOff}
            color={isVideoStatus ? COLOR.greenButtonOn2 : COLOR.redButtonOff2}
          >
            {/*sub.stream.connection.stream.videoActive ? <BsCameraVideo/> : <BsCameraVideoOff className="off"/>*/}
            <StButtonIconImage
              src={isVideoStatus ? image.videoOnS : image.videoOffS}
            />
            {/*{isVideoStatus ? <BsCameraVideo/> : <BsCameraVideoOff className="off"/>}*/}
          </StButtonDeviceOnOff>
          <StButtonDeviceOnOff
            fontColor="red"
            onClick={onClickSubscriberItemAudioToggle}
            bgColor={isAudioStatus ? COLOR.greenButtonOn : COLOR.redButtonOff}
            color={isAudioStatus ? COLOR.greenButtonOn2 : COLOR.redButtonOff2}
          >
            <StButtonIconImage
              src={isAudioStatus ? image.audioOnS : image.audioOffS}
            />
            {/*sub.stream.connection.stream.audioActive ? <BsMic/> : <BsMicMute className="off"/>*/}
            {/*{isAudioStatus ? <BsMic/> : <BsMicMute className="off"/>}*/}
          </StButtonDeviceOnOff>
        </StStreamControlButtonBox>
      </StSubscribersSessionStreamInnerBox>

      {/*비디오 off 프로필 이미지*/}
      {!isVideoStatus && (
        <StRoomWaitingVideoBox>
          <UserMediaBackImage
            borderRadius="0"
            userMediaBackImage={userMediaBackImage}
          />
        </StRoomWaitingVideoBox>
      )}
    </div>
  );
};

const StButtonIconImage = styled.img`
  src: ${(props) => props.src};
  width: 30px;
  height: 30px;
`;
const StRoomWaitingVideoBox = styled.div`
  width: 100%;
  max-width: 340px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  position: absolute;
  top: 0;
  left: 0;
  border: 3px solid transparent;
`;

const StButtonDeviceOnOff = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: ${COLOR.baseLight};
  font-size: 22px;
  padding: 0;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color};
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseDefault};
  }
`;
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
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const StSubscribersSessionStreamInnerBox = styled.div`
  /*
  width: 100%;
  min-height: 140px;
  height: 100%;
  border-radius: 5px;
  position: relative;
  border: 3px solid transparent;
  box-sizing: border-box;
  */

  max-width: 340px;
  height: 100%;
  //min-height: 140px;
  height: 200px;
  border-radius: 5px;
  position: relative;
  border: 3px solid transparent;
  box-sizing: border-box;
  overflow: hidden;
`;

export default React.memo(SubscriberVideoItem)
