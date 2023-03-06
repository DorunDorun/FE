import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";

//컴포넌트
import ButtonDefault from "../Components/ButtonDefault";
import { regExpNickName } from "../Components/apis/RegExp";
import MediaBackImageList from "../Components/lists/MediaBackImageList";
import RadioGroup from "../Components/RadioGroup";
import ButtonImageList from "../Components/lists/ButtonImageList";
import UserMediaBackImage from "../Components/UserMediaBackImage";

//아이콘
import { BsMicFill } from "react-icons/bs";
import { BsMicMuteFill } from "react-icons/bs";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";

//스토어-방 입장
import useStoreRoomJoin from "../zustand/storeRoomJoin";
import { COLOR } from "../Components/style/style";

const RoomWaiting = () => {
  const navigate = useNavigate();



  //유저 미디어 정보 불러오기
  useEffect(() => {

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    
    //로그인 토큰 체크
    if (!accessToken && !refreshToken) return window.location.href="/login"
    getUserMedia();
    
  }, []);

  const message = {
    welcome: "입장을 환영합니다!",
    settingGuide: "라이브룸에서 사용할 프로필을 설정해주세요",
  };

  //유효성 검사 메세지
  const [validMessageNickName, setValidMessageNickName] = useState("");

  const messageNickName = "2 ~ 20글자 이내로 입력하세요.";

  //스토어-방 입장 /공개, 비공개
  const fetchPostRoomJoin = useStoreRoomJoin(
    (state) => state.fetchPostRoomJoin
  );
  const fetchPostRoomJoinPassword = useStoreRoomJoin(
    (state) => state.fetchPostRoomJoinPassword
  );

  //방 정보 불러오기
  const title = localStorage.getItem("title");
  const nickNameBefroe = localStorage.getItem("name");
  const sessionId = localStorage.getItem("sessionId");
  const statusString = localStorage.getItem("status");
  const status = statusString === "true";

  //디바이스 상태
  const [selectDevice, setSelectDevice] = useState(false);

  //비디오, 오디오 상태
  const [isPublisherVideo, setIsPublisherVideo] = useState(true);
  const [isPublisherAudio, setIsPublisherAudio] = useState(true);

  //버튼 이미지
  const image = {
    videoOnS: ButtonImageList.video.onSmall,
    videoOffS: ButtonImageList.video.offSmall,
    audioOnS: ButtonImageList.audio.onSmall,
    audioOffS: ButtonImageList.audio.offSmall,
  };

  //타겟
  const nickNameRef = useRef();
  const videoRef = useRef();

  //닉네임
  const [nickName, setNickName] = useState(nickNameBefroe);

  //프로필 이미지
  const [mediaBackImageChecked, setMediaBackImageChecked] = useState("1");

  useEffect(() => {
    setSelectDevice((currentValue) => currentValue);
  }, [selectDevice]);

  useEffect(() => {
    console.log("setMediaBackImage : ", mediaBackImageChecked);
  }, [mediaBackImageChecked]);

  //방 정보가 없다면 이전 페이지로 이동
  if (!title && !nickNameBefroe && !sessionId && !status) {
    alert("방 정보 불러오기 에러! 다시 시도해주세요!");
    return navigate(-1);
  }

  //비디오, 오디오 불러오기
  const getUserMedia = async () => {
    const CONSTRAINTS = {
      video: { isPublisherVideo, width: 340, height: 200 },
      audio: isPublisherAudio,
    };
    await navigator.mediaDevices.getUserMedia(CONSTRAINTS).then((media) => {
      const video = media.getVideoTracks()[0];
      const audio = media.getAudioTracks()[0];
      const userDevice = {
        videoLabel: video.label,
        audioLabel: audio.label,
        video: video,
      };
      console.log("userDevice : ", userDevice);
      if (!video || !audio) {
        alert("카메라와 마이크 선택은 필수입니다!");
        return false;
      }
      localStorage.setItem("videoLabel", userDevice.videoLabel);
      localStorage.setItem("audioLabel", userDevice.audioLabel);
      localStorage.setItem("videoEnabled", true);
      localStorage.setItem("audioEnabled", true);
      setSelectDevice(true); //디바이스 선택 상태 값
      if (videoRef.current !== null) {
        videoRef.current.srcObject = media;
      }
    });
  };

  const onClickPublisherVideoToggle = () => {
    setIsPublisherVideo(!isPublisherVideo);
    const videoEnabled = videoRef.current.srcObject.getVideoTracks()[0].enabled;
    if (videoEnabled) {
      videoRef.current.srcObject.getVideoTracks()[0].enabled = false;
      localStorage.setItem(
        "videoEnabled",
        videoRef.current.srcObject.getVideoTracks()[0].enabled
      );
    } else {
      videoRef.current.srcObject.getVideoTracks()[0].enabled = true;
      localStorage.setItem(
        "videoEnabled",
        videoRef.current.srcObject.getVideoTracks()[0].enabled
      );
    }
  };

  const onClickPublisherAudioToggle = () => {
    setIsPublisherAudio(!isPublisherAudio);
    const audioEnabled = videoRef.current.srcObject.getAudioTracks()[0].enabled;
    if (audioEnabled) {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = false;
      localStorage.setItem(
        "audioEnabled",
        videoRef.current.srcObject.getAudioTracks()[0].enabled
      );
    } else {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = true;
      localStorage.setItem(
        "audioEnabled",
        videoRef.current.srcObject.getAudioTracks()[0].enabled
      );
    }
  };

  //선택한 프로필 이미지 video off 상태에 반영
  const userMediaBackImageFilter = MediaBackImageList.filter(
    (MediaBackImage) => MediaBackImage.name === mediaBackImageChecked
  );
  const userMediaBackImage = userMediaBackImageFilter[0].medium;

  //프로필 이미지 선택
  const onChangeRadioMediaBackImage = (value) => {
    setMediaBackImageChecked(value);
  };

  //방 입장 api
  const onClickJoinRoom = (e) => {
    e.preventDefault();
    console.log("selectDevice : ", selectDevice);
    if (!selectDevice) {
      //디바이스 선택 상태 값
      alert("디바이스를 선택해주세요!");
      return false;
    }

    console.log("regExpNickName(nickName) : ", regExpNickName(nickName));

    if (!regExpNickName(nickName)) {
      //유효성 실패
      setValidMessageNickName(messageNickName);
      nickNameRef.current.focus();
      console.log("유효성 실패");
      return false;
    } else {
      //유효성 통과
      console.log("유효성 통과");
      setValidMessageNickName("");
    }
    console.log("status : ", status);
    if (status) {
      //공개 방
      const roomJoinPayloadOpen = {
        //공개 방 정보
        sessionId: sessionId,
        nickName: nickName,
        mediaBackImage: mediaBackImageChecked,
      };
      fetchPostRoomJoin(roomJoinPayloadOpen).then((res) => {
        console.log("공개 방 입장!! res : ", res);
        if (res.data.statusCode === "200") {
          return navigate(`/room/${sessionId}`);
        } else {
          alert("다시 시도해주세요!");
        }
      });
    } else {
      //비공개 방
      const roomJoinPayloadPrivate = {
        //비공개 방 정보
        sessionId: sessionId,
        nickName: nickName,
        mediaBackImage: mediaBackImageChecked,
        password: localStorage.getItem("password"),
      };
      console.log("roomJoinPayloadPrivate : ", roomJoinPayloadPrivate);
      fetchPostRoomJoinPassword(roomJoinPayloadPrivate).then((res) => {
        console.log("비공개 방 입장! ", res);
        if (res.data.statusCode === "200") {
          return navigate(`/room/${sessionId}`);
        } else {
          alert("다시 시도해주세요!");
        }
      });
    }
  };

  return (
    <StRoomWaitingWrap>
      <StRoomWaitingContainer>
        <StRoomWaitingTitle>[{title}]</StRoomWaitingTitle>
        <StRoomWaitingWelcome>{message.welcome}</StRoomWaitingWelcome>
        <StRoomWaitingSettingBox>
          {/* 디바이스 컨트롤 */}
          <StRoomWaitingSettingBoxStream>
            <StRoomWaitingVideoBox>
              {isPublisherVideo ? (
                <StRoomWaitingVideo
                  autoPlay
                  ref={videoRef}
                ></StRoomWaitingVideo>
              ) : (
                <UserMediaBackImage userMediaBackImage={userMediaBackImage} />
              )}
            </StRoomWaitingVideoBox>

            <StRoomWaitingControllBox>
              <StButtonMyDeviceOnOff
                width="150px"
                fontColor="red"
                bgColor={
                  isPublisherVideo ? COLOR.greenButtonOn : COLOR.redButtonOff
                }
                color={
                  isPublisherVideo ? COLOR.greenButtonOn2 : COLOR.redButtonOff2
                }
                onClick={onClickPublisherVideoToggle}
              >
                <StButtonIconImage
                  src={isPublisherVideo ? image.videoOnS : image.videoOffS}
                />
              </StButtonMyDeviceOnOff>
              <StButtonMyDeviceOnOff
                width="150px"
                fontColor="red"
                bgColor={
                  isPublisherAudio ? COLOR.greenButtonOn : COLOR.redButtonOff
                }
                color={
                  isPublisherAudio ? COLOR.greenButtonOn2 : COLOR.redButtonOff2
                }
                onClick={onClickPublisherAudioToggle}
              >
                <StButtonIconImage
                  src={isPublisherAudio ? image.audioOnS : image.audioOffS}
                />
              </StButtonMyDeviceOnOff>
            </StRoomWaitingControllBox>
          </StRoomWaitingSettingBoxStream>

          {/* 프로필 설정 */}
          <StRoomWaitingInputBox>
            {/* 프로필 설정 상단 - 닉네임 */}
            <StRoomWaitingInputBoxTop>
              <StRoomWaitingInputBoxTitle>
                {message.settingGuide}
              </StRoomWaitingInputBoxTitle>
              <StRoomWaitingInput
                value={nickName}
                onChange={(e) => {
                  setNickName(e.target.value);
                }}
                placeholder="사용하실 닉네임을 입력하세요"
                minlength="2"
                maxlength="20"
                ref={nickNameRef}
                autoFocus
              />
              {validMessageNickName && (
                <StValidMessage>{validMessageNickName}</StValidMessage>
              )}
            </StRoomWaitingInputBoxTop>

            {/* 프로필 설정 하단 - 이미지 */}
            <StMediaBackImageListBox>
              {MediaBackImageList.map((MediaBackImage) => {
                return (
                  <RadioGroup
                    key={nanoid()}
                    categoryName={`mediaBackImage-${MediaBackImage.name}`}
                    checked={MediaBackImage.name === mediaBackImageChecked}
                    value={MediaBackImage.name}
                    imageUrl={MediaBackImage.small}
                    onChange={(e) => {
                      onChangeRadioMediaBackImage(e.target.value);
                    }}
                    labelBg={COLOR.pinkLight2}
                    width="72px"
                    height="auto"
                    borderRadius="20px"
                    textDisplayNone="none"
                  />
                );
              })}
            </StMediaBackImageListBox>
          </StRoomWaitingInputBox>
        </StRoomWaitingSettingBox>

        <ButtonDefault
          onClick={onClickJoinRoom}
          width="474px"
          height="56px"
          bgColor={COLOR.baseDefault}
          fontColor="#fff"
          hoverBgColor={COLOR.greenDefault}
          hoverFontColor="#000"
          borderRadius="8px"
          boxShadow="0px 3px 4px #8600F01A"
        >
          참여하기
        </ButtonDefault>
      </StRoomWaitingContainer>
    </StRoomWaitingWrap>
  );
};

const StMediaBackImageListBox = styled.div`
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
  row-gap: 20px;
  flex-wrap: wrap;
`;

const StRoomWaitingInputBoxTitle = styled.span`
  display: inline-block;
  font-size: 20px;
  color: #fff;
  margin-bottom: 20px;
`;
const StRoomWaitingInputBoxTop = styled.div`
  text-align: center;
  position: relative;
`;

const StButtonIconImage = styled.img`
  src: ${(props) => props.src};
  width: 30px;
  height: 30px;
`;
const StButtonMyDeviceOnOff = styled.button`
  width: 48px;
  height: 48px;
  font-size: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color};
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseDefault};
  }
`;

const StRoomWaitingControllBox = styled.div`
  display: flex;
  justify-content: flex-start;
  column-gap: 16px;
`;

const StValidMessage = styled.span`
  color: #fff;
  position: absolute;
  bottom: -23px;
  left: 11px;
  text-shadow: 1px 1px red;
  font-weight: bold;
`;

const StRoomWaitingVideo = styled.video`
  width: 100%;
  height: 100%;
  border-radius: 14px;
`;
const StRoomWaitingVideoBox = styled.div`
  width: 500px;
  height: 295px;
  //background-color: #000;
  border: 2px solid #bf6dff;
  border-radius: 14px;
`;
const StRoomWaitingSettingBoxStream = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  row-gap: 18px;
`;
const StRoomWaitingInput = styled.input.attrs({
  type: "text",
})`
  width: 100%;
  border-radius: 12px;
  height: 48px;
  border: 1px solid #a74bef;
  box-shadow: none;
  padding: 5px 12px;
  font-size: 20px;
`;
const StRoomWaitingInputBox = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  column-gap: 10px;
  width: 355px;
  height: 295px;
`;
const StRoomWaitingSettingBox = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  column-gap: 50px;
  row-gap: 20px;
  position: relative;
  margin-bottom: 60px;
`;
const StRoomWaitingWelcome = styled.h3`
  margin-bottom: 82px;
  font-size: 46px;
  color: #fff;
  font-weight: bold;
`;
const StRoomWaitingTitle = styled.h2`
  font-weight: bold;
  font-size: 46px;
  margin-bottom: 20px;
  color: #fff;
`;
const StRoomWaitingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: -30px;
`;
const StRoomWaitingWrap = styled.div`
  width: 100vw;
  min-width: 800px;
  height: 100vh;
  background: transparent
    linear-gradient(
      0deg,
      ${COLOR.baseLight} 0%,
      ${COLOR.baseDefault} 100%,
      ${COLOR.baseLight} 0%
    )
    0% 0% no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default RoomWaiting;
