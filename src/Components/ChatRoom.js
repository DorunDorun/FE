/*기본*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { OpenVidu } from "openvidu-browser";
import { useNavigate } from "react-router-dom";

/*컴포넌트*/
import UserVideoComponent from "./UserVideoComponent";
import CanvasDrawing from "./CanvasDrawing";
import ButtonDefault from "./ButtonDefault";
import WhiteBoard from "./WhiteBoard";
import Chat from "./Chat";
import Header from "./headers/Header";
import SubscriberVideoItem from "./SubscriberVideoItem";
import ChatRoomSideBar from "./sidebar/ChatRoomSideBar";

//아이콘
import { BsCameraVideo } from "react-icons/bs";
import { BsCameraVideoOff } from "react-icons/bs";
import { BsMic } from "react-icons/bs";
import { BsMicMute } from "react-icons/bs";
import { BsPalette } from "react-icons/bs";
import { TfiBlackboard } from "react-icons/tfi";
import { BsMicFill } from "react-icons/bs";
import { BsMicMuteFill } from "react-icons/bs";
import { BsFillCameraVideoFill } from "react-icons/bs";
import { BsFillCameraVideoOffFill } from "react-icons/bs";

//css
import { COLOR } from "./style/style";

//스토어-방 삭제
import useStoreRoomDelete from "../zustand/storeRoomDelete";

//스토어-방 정보 불러오기
import useStoreRoomInfoGet from "../zustand/storeRoomInfoGet";

//스토어-새로고침
import useStoreRefreshStatus from "../zustand/storeRefreshStatus";

function ChatRoom() {
  useEffect(() => {
    console.log("ChatRoom 시작!");
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return navigate("/login");
  }, []);

  //roomTitle, userSessionId, userToken, userNickName, loading, hasErrors
  const roomTitle = localStorage.getItem("title");
  const userSessionId = localStorage.getItem("sessionId");

  //링크 접속(초대링크) 상황을 위한 session id local 저장
  const sessionIdPath = window.location.pathname.substring(6);
  localStorage.setItem("sessionId", sessionIdPath);

  const userProfileImage = localStorage.getItem("profile");
  const userNickName = localStorage.getItem("name");
  const [newNickName, setNewNickName] = useState(userNickName);
  //방 정보 불러오기
  const fetchRoomInfoGet = useStoreRoomInfoGet(
    (state) => state.fetchRoomInfoGet
  );

  const navigate = useNavigate();

  //방 기본 정보
  const [session, setSession] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(null);
  const [mainStreamManager, setMainStreamManager] = useState(undefined); // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
  const [currentVideoDevice, setCurrentVideoDevice] = useState(undefined);
  const [publisherConnectionId, setPublisherConnectionId] = useState(undefined);

  //오디오, 비디오 컨트롤
  const [isPublisherAudio, setIsPublisherAudio] = useState(true);
  const [isPublisherVideo, setIsPublisherVideo] = useState(true);
  const [isSubscriberAudio, setIsSubscriberAudio] = useState(true);
  const [isSubscriberVideo, setIsSubscriberVideo] = useState(true);
  const [nowSubscriber, setNowSubscriber] = useState(null);
  const [isPublisherSpeaker, setIsPublisherSpeaker] = useState(false); //음성 감지 상태 - 게시자

  //사용자 디바이스
  const userDevice = {
    videoId: localStorage.getItem("videoId"),
    videoActive: localStorage.getItem("videoActive"),
    audioId: localStorage.getItem("audioId"),
    audioActive: localStorage.getItem("audioActive"),
  };

  //const [isSubscriberSpeaker, setIsSubscriberSpeaker]=useState(false) //음성 감지 상태 - 참여자
  const [subscriberSpeakerConnectionId, setSubscriberSpeakerConnectionId] =
    useState(undefined);

  //스토어-방 삭제
  const fetchDeleteRoom = useStoreRoomDelete((state) => state.fetchDeleteRoom);

  //캔버스 컨트롤
  const [isCanvas, setIsCanvas] = useState(false);
  const [isCanvasDefault, setIsCanvasDefault] = useState(true);

  //화이트보드
  const [isWhiteBoard, setIsWhiteBoard] = useState(false);

  //새로고침 시
  const refreshSession = (e) => {
    e.preventDefault();
    fetchDeleteRoom(userSessionId);
    //setIsRefresh(true);
    resetSession();
    navigate("/roomWaiting");
    e.returnValue = "";
  };

  //브라우저 새로고침, 종료 시 실행

  useEffect(() => {
    window.addEventListener("beforeunload", refreshSession);
    return () => {
      window.removeEventListener("beforeunload", refreshSession);
    };
  }, []);

  useEffect(() => {
    //방 정보 불러오기
    fetchRoomInfoGet(userSessionId).then((res) => {
      if (res === undefined) {
        return navigate("/roomWaiting");
      }
      console.log("방 정보 불러옴 !! 🤸‍♂️ res : ", res);
      const nowUserFilter = res.data.data.chatRoomUserList.filter(
        (user) => user.nowUser === true
      );
      console.log(
        "nowUserFilter[0].enterRoomToken : ",
        nowUserFilter[0].enterRoomToken
      );
      const userTokenData = nowUserFilter[0].enterRoomToken;
      const userNickNameData = nowUserFilter[0].nickname;
      setNewNickName(userNickNameData);
      //스트림 연결
      connection(userTokenData, userNickNameData);
    });
  }, []);

  //메인 비디오(크게 보기)
  const onClickMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  //나간 인원, 참여자 목록에서 삭제
  const deleteSubscriber = (streamManager) => {
    console.log("streamManager :::::::: ", streamManager);
    let index = subscribers.indexOf(streamManager, 0);
    console.log("❌ deleteSubscriber subscribers : ", subscribers);
    console.log("deleteSubscriber subscribers length : ", subscribers.length);
    if (index > -1) {
      subscribers.splice(index, 1);
      setSubscribers(subscribers);
      console.log("❌❌ deleteSubscriber subscribers : ", subscribers);
      console.log(
        "deleteSubscriber subscribers length 2222 : ",
        subscribers.length
      );
    }
    subscribers.length === 0 && setSubscribers([]);
  };

  /*게시자 디바이스 컨트롤*/

  //게시자 오디오 컨트롤
  const onClickPublisherAudioToggle = () => {
    setIsPublisherAudio(!isPublisherAudio);
  };

  //게시자 오디오 컨트롤
  useEffect(() => {
    console.log("onClickPublisherAudioToggle : ", isPublisherAudio);
    console.log("onClickPublisherAudioToggle publisher : ", publisher);
    if (publisher) {
      publisher.publishAudio(isPublisherAudio);
    }
  }, [isPublisherAudio]);

  //게시자 비디오 컨트롤
  const onClickPublisherVideoToggle = () => {
    setIsPublisherVideo(!isPublisherVideo);
  };

  //게시자 비디오 컨트롤
  useEffect(() => {
    if (publisher) {
      publisher.publishVideo(isPublisherVideo);
    }
  }, [isPublisherVideo]);

  /*참여자 디바이스 컨트롤*/

  //참여자 오디오 컨트롤
  const onClickSubscriberAudioToggle = (connectionId) => {
    const subConnectionId = connectionId;
    setIsSubscriberAudio(!isSubscriberAudio);
    console.log("clientId ::::: ", subConnectionId);
    const subscriberFilter = subscribers.filter((sub) => {
      console.log("filter sub : ", sub);
      console.log(
        "filter sub.stream.connection.session.token : ",
        sub.stream.connection.connectionId
      );
      console.log("filter subTokenId : ", subConnectionId);
      return sub.stream.connection.connectionId === subConnectionId;
    });
    setNowSubscriber(subscriberFilter);
    //.stream.connection.session.token === subTokenId
    console.log("❗ subscriberFilter : ", subscriberFilter);
  };

  //참여자 오디오 컨트롤
  useEffect(() => {
    console.log("onClickSubscriberAudioToggle : ", isSubscriberAudio);
    console.log("❗ nowSubscriber : ", nowSubscriber);
    if (nowSubscriber && nowSubscriber.length > 0) {
      const subscriber = nowSubscriber;
      subscriber[0].subscribeToAudio(isSubscriberAudio);
      return console.log(
        "onClickSubscriberAudioToggle nowSubscriber 22222 : ",
        subscriber
      );
    }
  }, [isSubscriberAudio]);

  //참여자 비디오 컨트롤
  const onClickSubscriberVideoToggle = (connectionId) => {
    const subConnectionId = connectionId;
    setIsSubscriberVideo(!isSubscriberVideo);

    const subscriberFilter = subscribers.filter((sub) => {
      return sub.stream.connection.connectionId === subConnectionId;
    });
    setNowSubscriber(subscriberFilter);
  };

  //참여자 비디오 컨트롤
  useEffect(() => {
    console.log("onClickSubscriberVVVVideoToggle : ", isSubscriberVideo);
    console.log("❗ nowSubscriber : ", nowSubscriber);
    if (nowSubscriber && nowSubscriber.length > 0) {
      const subscriber = nowSubscriber;
      subscriber[0].subscribeToVideo(isSubscriberVideo);
    }
  }, [isSubscriberVideo]);

  //초대하기
  const onClickInviteLink = () => {
    alert("서비스 준비 중인 기능입니다.");
  };

  //캔버스 컨트롤
  const onClickCanvasToggle = () => {
    setIsCanvasDefault(false);
    setIsCanvas(!isCanvas);
  };

  //화이트보드 컨트롤
  const onClickWhiteBoardToggle = () => {
    setIsWhiteBoard(!isWhiteBoard);
  };

  //라이브룸 캡쳐
  const onClickCaptureRoom = () => {
    alert("서비스 준비 중인 기능입니다.");
  };

  //음성감지
  useEffect(() => {
    const mySession = session;
    if (mySession) {
      mySession.on("publisherStartSpeaking", (event) => {
        //음성감지 음성 시작
        const speakerId = event.connection.connectionId;
        console.log(
          "음성감지 시작 User " +
            event.connection.connectionId +
            " start speaking"
        );
        console.log("음성감지 시작 게시자 : ", publisherConnectionId);
        console.log("음성감지 시작 참여자 : ", event.connection.connectionId);
        speakerId === publisherConnectionId
          ? setIsPublisherSpeaker(true)
          : setSubscriberSpeakerConnectionId(speakerId);
      });

      mySession.on("publisherStopSpeaking", (event) => {
        //음성감지 음성 종료
        const speakerId = event.connection.connectionId;
        console.log(
          "음성감지 종료 " + event.connection.connectionId + " stop speaking"
        );
        console.log("음성감지 종료 : ", publisherConnectionId);
        console.log("음성감지 종료 : ", event.connection.connectionId);
        speakerId === publisherConnectionId
          ? setIsPublisherSpeaker(false)
          : setSubscriberSpeakerConnectionId(undefined);
      });
    }
  }, [publisherConnectionId]);

  //연결
  function connection(userToken, userNickName) {
    if (!userToken || !userNickName) {
      return navigate("/roomWaiting");
    }

    const connectionInfo = {
      userToken: userToken,
      userNickName: userNickName,
    };

    console.log("connection info : ", connectionInfo);

    let OV = new OpenVidu(); //openvidu 객체 생성
    OV.enableProdMode();

    //setOV(OV)

    let mySession = OV.initSession(); //세션 생성
    setSession(mySession);

    // On every new Stream received...
    mySession.on("streamCreated", (event) => {
      setSubscribers([]);

      console.log("subscribers 확인 처음!@@ subscribers ::: ", subscribers);

      const newSubscriber = mySession.subscribe(event.stream, undefined);

      console.log("입장 아이디 : ", event.stream.connection.data);
      console.log("subscribers 확인 처음! subscribers ::: ", subscribers);

      const newSubscribers = subscribers;
      newSubscribers.push(newSubscriber);
      setSubscribers([...newSubscribers]);

      console.log("subscribers 확인 1 newSubscriber ::: ", newSubscriber);
      console.log("subscribers 확인 2 newSubscribers ::: ", newSubscribers);
      console.log("subscribers 확인 3 subscribers ::: ", subscribers);
    });

    // On every Stream destroyed...
    mySession.on("streamDestroyed", (event) => {
      console.log(" streamDestroyed event : ", event);
      console.log(" streamDestroyed subscribers 1 : ", subscribers);

      deleteSubscriber(event.stream.streamManager);

      console.log(" streamDestroyed subscribers 2 : ", subscribers);
      console.log("event.stream.typeOfVideo !@!@!@!@ : ", event.stream);
      console.log("퇴장 @@@ : ", event.stream.connection.connectionId);
    });

    // On every asynchronous exception...
    mySession.on("exception", (exception) => {
      console.warn(exception);
    });

    //세션 연결
    mySession
      .connect(userToken, { clientName: userNickName })
      .then(async () => {
        console.log("✨✨✨ 토큰 확인", userToken);
        console.log("✨✨✨✨✨ 유저 : ", userNickName);

        OV.getUserMedia({
          //디바이스 연결
          audioSource: false,
          videoSource: undefined,
          resolution: "1280x720",
          frameRate: 10,
        }).then( async (mediaStream) => {
          
          const devices = mediaStream.getVideoTracks()
          console.log("💥💥채팅방 devices OV", devices)
          const videoDevices = devices.filter(
            (device) => device.kind === "video"
          );
          const currentVideoDeviceIdUser = localStorage.getItem("videoLabel")
          const currentVideoDevice = videoDevices.find(
            (device) => device.label === currentVideoDeviceIdUser
          );
          
          console.log("💥💥채팅방 videoDevices ", videoDevices)
          console.log("💥💥채팅방 선택 currentVideoDevice ", currentVideoDevice)
          if(!currentVideoDevice){ //디바이스가 없다면 대기 페이지로 이동
            alert("디바이스 선택은 필수입니다!")
            return navigate("/roomWating")
          }

          let publisher = OV.initPublisher(undefined, {
            audioSource: undefined, //audio. undefined = default audio
            videoSource: currentVideoDevice, //video. undefined = default webcam
            publishAudio: true,
            publishVideo: true,
            resolution: "680x480", //video size
            frameRate: 30,
            insertMode: "APPEND",
            mirror: true,
          });
          console.log("publisher 확인하기! : ", publisher);
          publisher.once("accessAllowed", async () => {
            mySession.publish(publisher);
            const devices = await OV.getDevices();
            console.log("💥💥채팅방 devices", devices)
            const videoDevices = devices.filter(
              (device) => device.kind === "videoinput"
            );
            //const currentVideoDeviceId = videoDevices[0].label;
            const currentVideoDeviceIdUser = localStorage.getItem("videoLabel")
            
            console.log("💥💥채팅방 현재 카메라", currentVideoDeviceIdUser)
            const currentVideoDevice = videoDevices.find(
              (device) => device.label === currentVideoDeviceIdUser
            );
            console.log("currentVideoDevice @@@@@@@@ : ", currentVideoDevice);

            setCurrentVideoDevice(currentVideoDevice);
            setPublisher(publisher);
            setMainStreamManager(publisher);
            setPublisherConnectionId(publisher.stream.connection.connectionId);
          });
        });

        //음성 감지 컨트롤
        OV.setAdvancedConfiguration({
          publisherSpeakingEventsOptions: {
            interval: 100, // Frequency of the polling of audio streams in ms (default 100)
            threshold: -50, // Threshold volume in dB (default -50)
          },
        });
      })
      .catch((error) => {
        //에러일 경우 연결 종료
        //alert(error.message)
        //leaveSession()
        leaveSessionWaiting();
      });
  }

  //스트림 초기화
  const resetSession = () => {
    console.log("❌ resetSession !!");
    const mySession = session;
    if (mySession) {
      //세션 연결 종료
      mySession.disconnect();
    }

    //스트림 매니저 초기화
    setMainStreamManager(undefined);

    //참여 인원 초기화
    setSession(undefined);
    setSubscribers([]);
    setPublisher(undefined);

    //캔버스 초기화
    setIsCanvas(false);
    setIsCanvasDefault(true);
    console.log("방 삭제 , 초기화 완료!");
  };

  //나가기-대기 페이지
  const leaveSessionWaiting = () => {
    fetchDeleteRoom(userSessionId);
    resetSession();
    return navigate("/roomWaiting");
  };

  //나가기
  const leaveSession = () => {
    fetchDeleteRoom(userSessionId).then((res) => {
      console.log("방 삭제 res ", res);
      //api 삭제 요청
      if (res.status === 200) {
        resetSession();
        navigate("/roomList");
      }
    });
  };

  //나가기 버튼 클릭
  const onClickLeaveSession = () => {
    if (window.confirm("퇴장하시겠습니까?")) {
      leaveSession();
    }
  };

  /*스위치 카메라*/
  const switchCamera = async () => {
    let OV = new OpenVidu();
    try {
      const devices = await OV.getDevices();
      var videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      console.log("devices : ", devices);
      console.log("videoDevices : ", videoDevices);

      if (videoDevices && videoDevices.length > 1) {
        var newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          // Creating a new publisher with specific videoSource
          // In mobile devices the default and first camera is the front one
          var newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);
          setCurrentVideoDevice(newVideoDevice[0]);
          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  // if (loading) {
  //     return <p>Loading</p>;
  //   }
  // if (hasErrors) {
  //     return <p>cannot read data : 서버 응답 에러</p>;
  // }

  return (
    <StWrap>
      <StSessionWrap>
        <Header />
        <StStreamWrap>
          <StSideNav>
            <ChatRoomSideBar />
          </StSideNav>

          <StSessionVideoBox>
            <StSessionVideoBoxView>
              <StSessionHeader>
                <StSessionH1Box>
                  <StSessionH1>{roomTitle}</StSessionH1>
                </StSessionH1Box>

                <StSessionUserBox>
                  <ButtonDefault
                    height="48px"
                    padding="0 30px"
                    borderRadius="24px"
                    bgColor={COLOR.baseDefault}
                    fontColor="#fff"
                    hoverBgColor={COLOR.kakaoDefault}
                    hoverFontColor="#000"
                    onClick={onClickInviteLink}
                  >
                    초대하기
                  </ButtonDefault>
                </StSessionUserBox>
              </StSessionHeader>

              <StSessionVidoContainer>
                <StSessionVidoContainerInner>
                  {publisher !== undefined && (
                    <div className="sessionStreamBox">
                      <StSubscribersSessionStreamInnerBox
                        className={isPublisherSpeaker && "isSpeaker"}
                        onClick={() => onClickMainVideoStream(publisher)}
                      >
                        <StStreamNickNamePublisher>
                          나
                        </StStreamNickNamePublisher>
                        <UserVideoComponent streamManager={publisher} />
                        <StStreamControlButtonBox>
                          <StButtonDeviceOnOff
                            width="150px"
                            fontColor="red"
                            onClick={onClickPublisherVideoToggle}
                          >
                            {isPublisherVideo ? (
                              <BsCameraVideo />
                            ) : (
                              <BsCameraVideoOff className="off" />
                            )}
                          </StButtonDeviceOnOff>
                          <StButtonDeviceOnOff
                            width="150px"
                            fontColor="red"
                            onClick={onClickPublisherAudioToggle}
                          >
                            {isPublisherAudio ? (
                              <BsMic />
                            ) : (
                              <BsMicMute className="off" />
                            )}
                          </StButtonDeviceOnOff>
                        </StStreamControlButtonBox>
                      </StSubscribersSessionStreamInnerBox>
                    </div>
                  )}
                  {subscribers.length > 0 &&
                    subscribers?.map((sub) => {
                      return (
                        <SubscriberVideoItem
                          key={sub.id}
                          sub={sub}
                          subscriberSpeakerConnectionId={
                            subscriberSpeakerConnectionId
                          }
                          subStreamConnectionConnectionId={
                            sub.stream.connection.connectionId
                          }
                          onClickMainVideo={() => {
                            onClickMainVideoStream(sub);
                          }}
                          onClickSubscriberVideoToggle={() => {
                            onClickSubscriberVideoToggle(
                              sub.stream.connection.connectionId
                            );
                          }}
                          onClickSubscriberAudioToggle={() => {
                            onClickSubscriberAudioToggle(
                              sub.stream.connection.connectionId
                            );
                          }}
                          userNickName={
                            JSON.parse(
                              sub.stream.connection.data.substring(
                                0,
                                sub.stream.connection.data.indexOf("%")
                              )
                            ).clientName
                          }
                        />
                      );
                    })}
                </StSessionVidoContainerInner>
              </StSessionVidoContainer>

              {mainStreamManager !== undefined && (
                <StSessionMainVideo>
                  <UserVideoComponent streamManager={mainStreamManager} />
                </StSessionMainVideo>
              )}
            </StSessionVideoBoxView>

            <StMyStreamControlBox>
              <StMyStreamControlBoxLeft>
                <StMyStreamNickNameBox>
                  {userProfileImage && (
                    <StMyProfileImage src={userProfileImage} />
                  )}
                  <StMyProfileNickName>{newNickName}</StMyProfileNickName>
                </StMyStreamNickNameBox>
                <StButtonMyDeviceOnOff
                  width="150px"
                  fontColor="red"
                  onClick={onClickPublisherVideoToggle}
                >
                  {isPublisherVideo ? (
                    <BsFillCameraVideoFill />
                  ) : (
                    <BsFillCameraVideoOffFill className="off" />
                  )}
                </StButtonMyDeviceOnOff>
                <StButtonMyDeviceOnOff
                  width="150px"
                  fontColor="red"
                  onClick={onClickPublisherAudioToggle}
                >
                  {isPublisherAudio ? (
                    <BsMicFill />
                  ) : (
                    <BsMicMuteFill className="off" />
                  )}
                </StButtonMyDeviceOnOff>

                {/* 캔버스 버튼 */}
                <StMyDeviceButton
                  onClick={onClickCanvasToggle}
                  className={isCanvas && "buttonOn"}
                >
                  <BsPalette />
                </StMyDeviceButton>

                {/* 화이트보드 버튼 */}
                <StMyDeviceButton
                  onClick={onClickWhiteBoardToggle}
                  className={isWhiteBoard && "buttonOn"}
                >
                  <TfiBlackboard />
                </StMyDeviceButton>
              </StMyStreamControlBoxLeft>
              <StMyStreamControlBoxRight>
                <ButtonDefault
                  width="auto"
                  height="48px"
                  padding="0 20px"
                  fontSize="18px"
                  fontColor="#fff"
                  bgColor={COLOR.baseLight}
                  hoverBgColor={COLOR.baseDefault}
                  hoverFontColor="#fff"
                  borderRadius="8px"
                  boxShadow="0px 3px 4px #8600F01A"
                  onClick={onClickCaptureRoom}
                >
                  라이브룸 촬영
                </ButtonDefault>

                <ButtonDefault
                  width="auto"
                  height="48px"
                  padding="0 20px"
                  bgColor="#fff"
                  fontSize="18px"
                  fontColor={COLOR.redPoint}
                  hoverBgColor={COLOR.redPoint}
                  hoverFontColor="#fff"
                  borderRadius="8px"
                  boxShadow="0px 3px 4px #8600F01A"
                  onClick={onClickLeaveSession}
                >
                  나가기
                </ButtonDefault>
              </StMyStreamControlBoxRight>
            </StMyStreamControlBox>

            <CanvasDrawing
              className={isCanvas ? "d-block" : "d-none"}
              defaultClass={isCanvasDefault ? "defaultNone" : ""}
            />

            <WhiteBoard className={isWhiteBoard ? "block" : "none"} />
          </StSessionVideoBox>

          <Chat props="sessionId" />
        </StStreamWrap>

        <StFooter></StFooter>
      </StSessionWrap>
    </StWrap>
  );
}

const StMyProfileNickName = styled.span``;
const StMyProfileImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;
const StMyStreamNickNameBox = styled.span`
  max-width: 400px;
  min-width: 140px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 16px;
  padding: 5px 10px;
  background-color: ${COLOR.boxGrayBold};
  color: #fff;
  font-weight: bold;
  box-shadow: 0px 3px 4px #0000001a;
  border-radius: 8px;
`;
const StMyStreamControlBoxRight = styled.div`
  display: flex;
  align-items: center;
  column-gap: 15px;
`;
const StMyStreamControlBoxLeft = styled.div`
  display: flex;
  column-gap: 20px;
`;
const StMyDeviceButton = styled.button`
  width: 48px;
  height: 48px;
  border: 1px solid transparent;
  background-color: ${COLOR.grayLight2};
  border-radius: 50%;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 3px 3px 6px #00000029;
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseDefault};
    color: #fff;
  }
`;
const StButtonMyDeviceOnOff = styled.button`
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  :hover {
    color: ${COLOR.baseDefault};
  }
`;
const StButtonDeviceOnOff = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: ${COLOR.baseLight};
  font-size: 22px;
  cursor: pointer;
  :hover {
    color: ${COLOR.baseDefault};
  }
`;
const StSideNav = styled.nav`
  min-width: 300px;
  background-color: #fff;
  border-right: 1px solid ${COLOR.grayLight};
`;
const StStreamWrap = styled.div`
  display: flex;
  height: calc(100vh - 120px);
`;
const StFooter = styled.footer`
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR.grayLight};
`;

const StSubscribersSessionStreamInnerBox = styled.div`
  height: 100%;
  min-height: 140px;
  border-radius: 5px;
  position: relative;
  border: 3px solid transparent;
  box-sizing: border-box;
`;

const StMyStreamControlBox = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  column-gap: 10px;
  background-color: ${COLOR.boxGrayLight};
  padding: 0 60px;
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
  border-radius: 14px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const StSessionVidoContainerInner = styled.div`
  text-align: left;
`;

const StSessionVidoContainer = styled.div`
  /*
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 20px;
*/
  width: 100%;
  height: 500px;
  margin-top: 70px;
  text-align: center;
`;

const StSessionVideoBoxView = styled.div`
  padding: 30px 60px;
`;
const StSessionVideoBox = styled.div`
  min-width: 900px;
  margin: 0 auto;
  position: relative;
  background-color: ${COLOR.pinkLight};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StSessionMainVideo = styled.div`
  display: none;
`;

const StSessionH1 = styled.h1`
  color: #000;
  font-size: 26px;
  font-weight: bold;
  display: inline;
`;
const StSessionUserBox = styled.div``;
const StSessionH1Box = styled.div`
  display: flex;
  align-items: center;
`;
const StSessionHeader = styled.div`
  padding-bottom: 24px;
  border-bottom: 1px solid ${COLOR.baseDefault};
  display: flex;
  justify-content: space-between;
`;

const StSessionWrap = styled.div`
  width: 100%;
  margin: 0 auto;
`;
const StWrap = styled.div`
  overflow: hidden;
  background-color: #fff;
  ::-webkit-scrollbar {
    /* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
    display: none;
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;

export default ChatRoom;
