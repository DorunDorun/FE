/*기본*/
import React, { useState, useEffect, useRef, useMemo } from "react";
import styled from "styled-components";
import { OpenVidu } from "openvidu-browser";
import { useNavigate } from "react-router-dom";
import { useBeforeunload } from "react-beforeunload";
import html2canvas from "html2canvas";
import { nanoid } from "nanoid";


/*컴포넌트*/
import UserVideoComponent from "./UserVideoComponent";
import CanvasDrawing from "./CanvasDrawing";
import ButtonDefault from "./ButtonDefault";
import WhiteBoard from "./WhiteBoard";
import Chat from "./Chat";
import Header from "./headers/Header";
import SubscriberVideoItem from "./SubscriberVideoItem";
import ChatRoomSideBar from "./sidebar/ChatRoomSideBar";
import UserMediaBackImage from "./UserMediaBackImage";
import MediaBackImageList from "./lists/MediaBackImageList";
import ButtonImageList from "./lists/ButtonImageList";
import { server_url } from "../shared/api";
import ShareImages from "./lists/Share";


//스토어 배경 색상 변경
import { StorePalette } from "../zustand/storePalette";


/*유틸*/
//카카오톡 공유하기
import { shareKakao } from "../utils/shareKakaoLink";

//아이콘
import { BsPalette } from "react-icons/bs";
import { TfiBlackboard } from "react-icons/tfi";
import { GiCardExchange } from "react-icons/gi";

//css
import { COLOR } from "./style/style";

//스토어-방 삭제
import useStoreRoomDelete from "../zustand/storeRoomDelete";

//스토어-방 정보 불러오기
import useStoreRoomInfoGet from "../zustand/storeRoomInfoGet";
//sse 실시간 감지
import useStoreSseListener from "../zustand/storeSseListener";

function ChatRoom() {
  useEffect(() => {
    console.log("ChatRoom 시작!");

    //로그인(토큰) 검증
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return navigate("/login");
    }
  }, []);



  /*뒤로가기 클릭
    1. 뒤로가기 이벤트 막기
    2. confirm 확인 시 방 나가기 로직 실행 > 삭제 api 후 방 목록으로 이동
  */
  const locationBack = ()=>{
    console.log("locationBack 1")
    window.history.pushState(null, null, window.location.href)
    console.log("locationBack 2")
    if(window.confirm("저장하지 않은 정보를 잃을 수 있습니다. 뒤로 가시겠습니까?")){
      console.log("locationBack 3")
      return leaveSession()
    }
  }

  //뒤로가기 감지 및 컨트롤
  useEffect(()=>{
    window.history.pushState(null, null, window.location.href)
    window.addEventListener("popstate", locationBack)
    return()=>{
      window.removeEventListener("popstate", locationBack)
    }
  },[])

  


  //roomTitle, userSessionId, userToken, userNickName, loading, hasErrors
  const roomTitle = localStorage.getItem("title");
  const userSessionId = localStorage.getItem("sessionId");

  const [roomStatus, setRoomStatus] = useState(null);

  const userProfileImage = localStorage.getItem("profile");
  const userNickName = localStorage.getItem("name");
  const [newNickName, setNewNickName] = useState(userNickName);

  //유저 프로필 이미지
  const [userInfo, setUserInfo] = useState({
    mediaBackImage: "1",
    userMediaBackImage: undefined,
  });

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
  const userVideoEnabled = localStorage.getItem("videoEnabled") === "true";
  const userAudioEnabled = localStorage.getItem("audioEnabled") === "true";
  const [isPublisherAudio, setIsPublisherAudio] = useState(userAudioEnabled);
  const [isPublisherVideo, setIsPublisherVideo] = useState(userVideoEnabled);
  const [isSubscriberAudio, setIsSubscriberAudio] = useState(true);
  const [isSubscriberVideo, setIsSubscriberVideo] = useState(true);
  const [nowSubscriber, setNowSubscriber] = useState(null);
  const [isPublisherSpeaker, setIsPublisherSpeaker] = useState(false); //음성 감지 상태 - 게시자
  //const [isSubscriberSpeaker, setIsSubscriberSpeaker]=useState(false) //음성 감지 상태 - 참여자
  const [subscriberSpeakerConnectionId, setSubscriberSpeakerConnectionId] =
    useState(undefined);

  //스토어-방 삭제
  const fetchDeleteRoom = useStoreRoomDelete((state) => state.fetchDeleteRoom);

  //캔버스 컨트롤
  const [isCanvas, setIsCanvas] = useState(false);
  const [isCanvasDefault, setIsCanvasDefault] = useState(true);
  const [isWhiteBoardCanvasDefault, setIsWhiteBoardCanvasDefault] = useState(true);
  const [isCapture, setIsCapture] = useState(false);

  //캔버스 컨테이너 (캡쳐용)
  const captureBoxRef = useRef();

  //화이트보드
  const [isWhiteBoard, setIsWhiteBoard] = useState(false);


  //배경 색상 변경
  const colorData = StorePalette((state) => state.colorData);
  const colorDataName = StorePalette((state) => state.colorDataName);
  const colorDataDefault = "#831fc5"

  const colorDataForm=(colorData)=>{
    return `transparent linear-gradient(0deg, #d699ff 7%, ${colorData} 101%, #d699ff 50%) 0% 0% no-repeat`
  }

  const [colorDataValue, setColorDataValue]=useState(colorDataForm(colorDataDefault))
  

    useEffect(()=>{
      const colorDataFunc=()=>{
        console.log(" colorDataName : ", colorDataName)
        switch(colorDataName){
          case ("color"):
            setColorDataValue(colorDataForm(colorData))
            break;
          case ("frame"):
            setColorDataValue(`url("${colorData}") no-repeat center center/ 100% 100%`)
            break;
          default:
            setColorDataValue(colorDataForm(colorDataDefault))
        }
      } 
      colorDataFunc()

      return()=>{
        colorDataFunc()
      }
      
    
    },[colorData])
  

  //브라우저 새로고침, 종료 시 실행
  const deleteSession = async (e) => {
    //await fetchDeleteRoom(userSessionId);
    //setIsRefresh(true);

    const headers = {
      type: "application/json; charset=UTF-8",
      authorization: localStorage.getItem("accessToken"),
      refresh: localStorage.getItem("refreshToken"),
    };
    console.log("❌ 방 삭제 navigator.sendBeacon 실행!");

    await navigator.sendBeacon(`${server_url}api/rooms/${userSessionId}/delete`, JSON.stringify(headers)) //삭제 api
    await navigator.sendBeacon(`${server_url}api/count`) //sse 실시간 감지

    resetSession();
    return navigate("/roomWaiting");
  };

  //새로고침 감지 경고창
  useBeforeunload((event) => {
    event.preventDefault();
  });

  //sse 실시간 감지
  const sseListener = useStoreSseListener((state) => state.sseListener);

  //브라우저 새로고침, 종료 시 실행
  useEffect(() => {
    window.addEventListener("unload", deleteSession);
    return () => {
      window.removeEventListener("unload", deleteSession);
    };
  }, []);

  //프로필 이미지 불러오기
  //console.log("🎨MediaBackImageList : ", MediaBackImageList);

  const userMediaBackImageFilter = useMemo(
    () =>
      MediaBackImageList.filter(
        (MediaBackImage) => MediaBackImage.name === userInfo.mediaBackImage
      ),
    [userInfo.mediaBackImage]
  );
  //console.log("🎨🎨userMediaBackImageFilter : ", userMediaBackImageFilter);

  const userMediaBackImage = useMemo(
    () => userMediaBackImageFilter[0]?.medium,
    [userMediaBackImageFilter]
  );
  //console.log("🎨🎨🎨userMediaBackImage : ", userMediaBackImage)

  //방 정보 불러오기
  useEffect(() => {
    fetchRoomInfoGet(userSessionId).then(async (res) => {
      if (res === undefined) return navigate("/roomWaiting");

      console.log("방 정보 불러옴 !! 🤸‍♂️ res : ", res);

      //현재 유저 필터링
      const nowUserFilter = res.data.data.chatRoomUserList.filter(
        (user) => user.nowUser === true
      );
      console.log(
        "nowUserFilter[0].enterRoomToken : ",
        nowUserFilter[0].enterRoomToken
      );
      console.log(
        "nowUserFilter[0].mediaBackImage : ",
        nowUserFilter[0].mediaBackImage
      );

      await setUserInfo({
        ...userInfo,
        mediaBackImage: String(nowUserFilter[0].mediaBackImage),
      });
      const userTokenData = nowUserFilter[0].enterRoomToken;
      const userNickNameData = nowUserFilter[0].nickname;
      setNewNickName(userNickNameData);

      //스트림 연결
      connection(
        userTokenData,
        userNickNameData,
        String(nowUserFilter[0].mediaBackImage)
      );
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
    let index = subscribers.indexOf(streamManager, 0)
    if (index > -1) {
      subscribers.splice(index, 1)
      setSubscribers(subscribers)
    }
    subscribers.length === 0 && setSubscribers([])
  }

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

  //카카오톡 공유 sdk 추가
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  //초대하기
  const onClickInviteLink = () => {
    const status = localStorage.getItem("status") === "true"; //방 상태

    /*기본 공통 정보*/
    const route = window.location.href;
    const title = "두런두런에 초대합니다!";
    const description = roomTitle;

    const protocol = window.location.protocol
    const host = window.location.host

    const shareUrl = `${protocol}//${host}/roomWaiting/join?`

    console.log("🔥route : ", route)
    console.log("🔥protocol : ", protocol)
    console.log("🔥host : ", host)
    console.log("🔥get url : ", ``)


    /*공유링크 썸네일*/
    console.log("ShareImages : ", ShareImages);
    const imgFilter = ShareImages.filter((img) => img.name === "1");
    const imgUrl = imgFilter[0].imageUrl; //이미지 경로 가져오기 .제거
    console.log("imgFilter:", imgFilter);
    console.log("imgUrl:", imgUrl);

    
    if (status) {
      //공개방
      const routeOpen = shareUrl + `&sessionId=${userSessionId}&title=${description}&status=${status}`;
      return shareKakao(routeOpen, title, description, imgUrl);
    } else {
      //비공개방
      const password = localStorage.getItem("password");
      const routePrivate = shareUrl + `&sessionId=${userSessionId}&title=${description}&status=${status}&password=${password}`;
      return shareKakao(routePrivate, title, description, imgUrl);
    }
    
  };

  //캔버스 컨트롤
  const onClickCanvasToggle = () => {
    setIsCanvasDefault(false);
    setIsCanvas(!isCanvas);
  };

  //화이트보드 컨트롤
  const onClickWhiteBoardToggle = () => {
    setIsWhiteBoardCanvasDefault(false)
    setIsWhiteBoard(!isWhiteBoard);
  };

  //라이브룸 캡쳐
  const onClickCaptureRoom = async () => {
    console.log("캡쳐 시작");
    await setIsCapture(true);

    html2canvas(captureBoxRef.current, {
      //options
      //height: 737,
    }).then((canvas) => {
      console.log("canvas 캡쳐 : ", canvas);
      onSaveImage(
        canvas.toDataURL("image/png"),
        `DorunDorun-${roomTitle}-${newNickName}.png`
      );
    });
  };

  //캡쳐 이미지 저장
  const onSaveImage = (uri, fileName) => {
    console.log("onSaveImage");
    const link = document.createElement("a");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.href = uri;
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
    setIsCapture(false);
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
  function connection(userToken, userNickName, userMediaBackImageNumber) {
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

    //프로필 이미지 불러오기
    console.log("🔥MediaBackImageList : ", MediaBackImageList);

    const userMediaBackImageFilter = MediaBackImageList.filter(
      (MediaBackImage) => MediaBackImage.name === userMediaBackImageNumber
    );
    console.log("🔥🔥userMediaBackImageFilter : ", userMediaBackImageFilter);

    const userMediaBackImageConnect = userMediaBackImageFilter[0]?.medium;
    console.log("🔥🔥🔥userMediaBackImage : ", userMediaBackImage);

    //세션 연결
    mySession
      .connect(userToken, {
        clientName: userNickName,
        userMediaBackImage: userMediaBackImageConnect,
      })
      .then(() => {
        console.log("✨✨✨ 토큰 확인", userToken);
        console.log("✨✨✨✨✨ 유저 : ", userNickName);
        console.log(
          "✨✨✨✨✨ 유저 userMediaBackImage : ",
          userMediaBackImage
        );

        OV.getUserMedia({
          //디바이스 연결
          audioSource: false,
          videoSource: undefined,
          resolution: "1280x720",
          frameRate: 10,
        }).then(async (mediaStream) => {
          const videoTrack = mediaStream.getVideoTracks()[0];
          const user = {
            userVideoEnabled: userVideoEnabled,
            userAudioEnabled: userAudioEnabled,
          };
          console.log("suer : ", user);
          if (!videoTrack) {
            //디바이스가 없다면 대기 페이지로 이동
            alert("디바이스 선택은 필수입니다!");
            return navigate("/roomWating");
          }

          let publisher = OV.initPublisher(undefined, {
            audioSource: undefined, //audio. undefined = default audio
            videoSource: videoTrack, //video. undefined = default webcam
            publishAudio: userAudioEnabled,
            publishVideo: userVideoEnabled,
            resolution: "340x200", //video size
            frameRate: 30,
            insertMode: "APPEND",
            mirror: true,
          });
          console.log("publisher 확인하기! : ", publisher);
          publisher.once("accessAllowed", async () => {
            mySession.publish(publisher);
            const devices = await OV.getDevices();
            console.log("💥💥채팅방 devices", devices);
            const videoDevices = devices.filter(
              (device) => device.kind === "videoinput"
            );
            //const currentVideoDeviceId = videoDevices[0].label;
            const currentVideoDeviceIdUser = localStorage.getItem("videoLabel");

            console.log("💥💥채팅방 현재 카메라", currentVideoDeviceIdUser);
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
      .catch((error) => { //에러일 경우 연결 종료
        leaveSessionWaiting() //삭제 후 대기페이지로 이동
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
    setIsWhiteBoardCanvasDefault(true)

    console.log("방 삭제 , 초기화 완료!");
  };

  //나가기-대기 페이지
  const leaveSessionWaiting = () => {
    const fetchDeleteRoomInfo={
      sessionId: userSessionId,
      prevStatus:false
    }
    fetchDeleteRoom(fetchDeleteRoomInfo)
    resetSession();
    return navigate("/roomWaiting");
  };

  //나가기
  const leaveSession = () => {
    const fetchDeleteRoomInfo={
      sessionId: userSessionId,
      prevStatus:false
    }
    //prev false
    fetchDeleteRoom(fetchDeleteRoomInfo).then((res) => {
      console.log("방 삭제 res ", res);
      //api 삭제 요청
      if (res.status === 200) {
        sseListener(); //sse 실시간 감지
        resetSession();
        return navigate("/roomList");
      }
    });
  };

  //나가기 버튼 클릭
  const onClickLeaveSession = () => {
    if (window.confirm("퇴장하시겠습니까?")) {
      leaveSession();
    }
  };

  const [isSwitchCamera, setIsSwitchCamera] = useState(false);
  /*스위치 카메라*/
  const switchCamera = async () => {
    setIsSwitchCamera(!isSwitchCamera);
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
            frameRate: 30,
            resolution: "340x200",
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

  const cameraSwtichImage = {
    default: process.env.PUBLIC_URL + "/asset/images/button/cameraSwtich.png",
  };

  const canvasImage = {
    default: process.env.PUBLIC_URL + "/asset/images/button/canvas.png",
  };

  const whiteBoardImage = {
    default: process.env.PUBLIC_URL + "/asset/images/button/whiteBoard.png",
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

          <StSessionVideoBox ref={captureBoxRef} background={colorDataValue}>
            {/* ? `transparent linear-gradient(0deg, #d699ff 7%, ${colorData} 101%, #d699ff 50%) 0% 0% no-repeat;` 
          : `transparent linear-gradient(0deg, #d699ff 7%, #831fc5 101%, #d699ff 50%) 0% 0% no-repeat` */}
            <StSessionHeader>
              <StSessionHeaderContainer>
                <StSessionH1Box>
                  <StSessionH1>{roomTitle}</StSessionH1>
                </StSessionH1Box>

                <StSessionUserBox visibility={isCapture ? "hidden" : "visible"}>
                  <ButtonDefault
                    height="42px"
                    padding="0 30px"
                    borderRadius="4px"
                    bgColor={COLOR.silverLight}
                    fontColor="#000"
                    hoverBgColor={COLOR.basePinkBold}
                    hoverFontColor="#fff"
                    onClick={onClickInviteLink}
                  >
                    초대하기
                  </ButtonDefault>
                </StSessionUserBox>
              </StSessionHeaderContainer>
            </StSessionHeader>

            <StSessionVidoContainer>
              <StSessionVidoContainerInner>
                {publisher !== undefined && (
                  <div className="sessionStreamBox">
                    <StSubscribersSessionStreamInnerBox
                      className={isPublisherSpeaker && "isSpeaker"}
                      onClick={() => onClickMainVideoStream(publisher)}
                    >
                      <StStreamNickNamePublisher>나</StStreamNickNamePublisher>

                      {/*비디오*/}
                      <UserVideoComponent streamManager={publisher} />

                      {/*디바이스 컨트롤*/}
                      <StStreamControlButtonBox>
                        <StButtonDeviceOnOff
                          width="150px"
                          fontColor="red"
                          onClick={onClickPublisherVideoToggle}
                          bgColor={
                            isPublisherVideo
                              ? COLOR.greenButtonOn
                              : COLOR.redButtonOff
                          }
                          color={
                            isPublisherVideo
                              ? COLOR.greenButtonOn2
                              : COLOR.redButtonOff2
                          }
                        >
                          <StButtonIconImage
                            src={
                              isPublisherVideo
                                ? image.videoOnS
                                : image.videoOffS
                            }
                          />
                        </StButtonDeviceOnOff>
                        <StButtonDeviceOnOff
                          width="150px"
                          fontColor="red"
                          bgColor={
                            isPublisherAudio
                              ? COLOR.greenButtonOn
                              : COLOR.redButtonOff
                          }
                          color={
                            isPublisherAudio
                              ? COLOR.greenButtonOn2
                              : COLOR.redButtonOff2
                          }
                          onClick={onClickPublisherAudioToggle}
                        >
                          <StButtonIconImage
                            src={
                              isPublisherAudio
                                ? image.audioOnS
                                : image.audioOffS
                            }
                          />
                        </StButtonDeviceOnOff>
                      </StStreamControlButtonBox>
                    </StSubscribersSessionStreamInnerBox>

                    {/*비디오 off 프로필 이미지*/}
                    {!isPublisherVideo && (
                      <StRoomWaitingVideoBox>
                        <UserMediaBackImage
                          borderRadius="0"
                          userMediaBackImage={userMediaBackImage}
                        />
                      </StRoomWaitingVideoBox>
                    )}
                  </div>
                )}

                {/*참여자가 있을 경우*/}
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
                        videoActive={sub.stream.connection.stream.videoActive}
                        audioActive={sub.stream.connection.stream.audioActive}
                        userMediaBackImage={
                          JSON.parse(
                            sub.stream.connection.data.substring(
                              0,
                              sub.stream.connection.data.indexOf("%")
                            )
                          ).userMediaBackImage
                        }
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
            {/* 
              {mainStreamManager !== undefined && (
                <StSessionMainVideo>
                  <UserVideoComponent streamManager={mainStreamManager} />
                </StSessionMainVideo>
              )}
            */}
            <StMyStreamControlBox 
              display={isCapture ? "none" : "flex"}
            >
              <StMyStreamControlBoxLeft>
                <StMyStreamNickNameBox>
                  {userProfileImage && (
                    <StMyProfileImage src={userProfileImage} />
                  )}
                  <StMyProfileNickName>{newNickName}</StMyProfileNickName>
                </StMyStreamNickNameBox>

                {/*카메라 변경*/}
                <StMyDeviceButton
                  onClick={switchCamera}
                  className={isSwitchCamera && "buttonOn"}
                  title="카메라가 2대 이상일 경우 전환됩니다"
                >
                  <MyControllButtonImg src={cameraSwtichImage.default} />
                </StMyDeviceButton>

                {/*디바이스 on off*/}
                <StButtonMyDeviceOnOff
                  title="카메라 on/off"
                  width="150px"
                  fontColor="red"
                  bgColor={
                    isPublisherVideo ? COLOR.greenButtonOn : COLOR.redButtonOff
                  }
                  color={
                    isPublisherVideo
                      ? COLOR.greenButtonOn2
                      : COLOR.redButtonOff2
                  }
                  onClick={onClickPublisherVideoToggle}
                >
                  <StButtonIconImage
                    src={isPublisherVideo ? image.videoOnM : image.videoOffM}
                  />
                  {/* 
                    {isPublisherVideo ? (
                      <BsFillCameraVideoFill />
                    ) : (
                      <BsFillCameraVideoOffFill className="off" />
                    )}
                    */}
                </StButtonMyDeviceOnOff>
                <StButtonMyDeviceOnOff
                  title="마이크 on/off"
                  width="150px"
                  fontColor="red"
                  bgColor={
                    isPublisherAudio ? COLOR.greenButtonOn : COLOR.redButtonOff
                  }
                  color={
                    isPublisherAudio
                      ? COLOR.greenButtonOn2
                      : COLOR.redButtonOff2
                  }
                  onClick={onClickPublisherAudioToggle}
                >
                  <StButtonIconImage
                    src={isPublisherAudio ? image.audioOnM : image.audioOffM}
                  />
                  {/* 
                    {isPublisherAudio ? (
                      <BsMicFill />
                    ) : (
                      <BsMicMuteFill className="off" />
                    )}
                  */}
                </StButtonMyDeviceOnOff>

                {/* 캔버스 버튼 */}
                <StMyDeviceButton
                  title="그림 그리기"
                  onClick={onClickCanvasToggle}
                  className={isCanvas && "buttonOn"}
                >
                  {/* <BsPalette /> */}
                  <MyControllButtonImg src={canvasImage.default} />
                </StMyDeviceButton>

                {/* 화이트보드 버튼 */}
                <StMyDeviceButton
                  title="화이트보드"
                  onClick={onClickWhiteBoardToggle}
                  className={isWhiteBoard && "buttonOn"}
                >
                  {/* <TfiBlackboard /> */}
                  <MyControllButtonImg src={whiteBoardImage.default} />
                </StMyDeviceButton>
                
              </StMyStreamControlBoxLeft>
              <StMyStreamControlBoxRight>
                <ButtonDefault
                  width="auto"
                  height="48px"
                  padding="0 28px"
                  fontSize="18px"
                  fontColor="#fff"
                  fontFamily="Pretendard"
                  fontWeight="normal"
                  bgColor={COLOR.basePinkRegular}
                  hoverBgColor={COLOR.basePinkDeep}
                  hoverFontColor="#fff"
                  borderRadius="8px"
                  borderNormal={`1px solid ${COLOR.basePinkDeep}`}
                  boxShadow="0px 3px 4px #8600F01A"
                  onClick={onClickCaptureRoom}
                >
                  라이브룸 촬영
                </ButtonDefault>

                <ButtonDefault
                  width="auto"
                  height="48px"
                  padding="0 28px"
                  bgColor={COLOR.baseRedRagular}
                  fontSize="18px"
                  fontColor="#fff"
                  fontFamily="Pretendard"
                  fontWeight="normal"
                  hoverBgColor={COLOR.baseRedDeep}
                  hoverFontColor="#fff"
                  borderRadius="8px"
                  borderNormal={`1px solid ${COLOR.baseRedDeep}`}
                  boxShadow="0px 3px 4px #8600F01A"
                  onClick={onClickLeaveSession}
                >
                  나가기
                </ButtonDefault>
              </StMyStreamControlBoxRight>
            </StMyStreamControlBox>

            <StCanvasContianer
              className={isCanvas ? "d-block" : "d-none"}
              defaultClass={isCanvasDefault ? "defaultNone" : ""}
            >
              <CanvasDrawing
                className={isCanvas ? "d-block" : "d-none"}
                defaultClass={isCanvasDefault ? "defaultNone" : ""}
                isCapture={isCapture ? "captureOn" : ""}
              />
            </StCanvasContianer>

            <WhiteBoard
              className={isWhiteBoard ? "block" : "none"}
              isCapture={isCapture}
            />


            <StCanvasContianer
              className={isWhiteBoard ? "d-block" : "d-none"}
              defaultClass={isWhiteBoardCanvasDefault ? "defaultNone" : ""}
            >
              <CanvasDrawing 
                canvasName="whiteBoard"
                className={isWhiteBoard ? "d-block" : "d-none"}
                defaultClass={isWhiteBoardCanvasDefault ? "defaultNone" : ""}
                isCapture={isCapture ? "captureOn" : ""}
              />
            </StCanvasContianer>


          </StSessionVideoBox>

          <Chat props={newNickName} />
        </StStreamWrap>

        {/* <StFooter></StFooter> */}
      </StSessionWrap>
    </StWrap>
  );
}

const MyControllButtonImg = styled.img`
  src: ${(props) => props.src};
`;

const StButtonIconImage = styled.img`
  src: ${(props) => props.src};
`;

const StCanvasContianer = styled.div`
  background-color: transparent;
  position: absolute;
  top: 94px;
  left: 0;
  z-index: 9;
  width: 100%;
  height: calc(100% - 184px);
`;
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
  background-color: ${COLOR.grayBold};
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
  width: 48px;
  height: 48px;
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color};
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseDefault};
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
  padding: 0;
  border-radius: 50%;
  background-color: ${(props) => props.bgColor || "transparent"};
  color: ${(props) => props.color};
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseDefault};
  }
`;
const StSideNav = styled.nav`
  min-width: 300px;
  height: calc(100vh - 120px);
  background-color: #fff;
  border-right: 1px solid ${COLOR.grayLight};
`;
const StStreamWrap = styled.div`
  display: flex;
  height: calc(100vh - 70px);
  overflow-x: auto;
`;
const StFooter = styled.footer`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${COLOR.grayLight};
`;

const StSubscribersSessionStreamInnerBox = styled.div`
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

const StMyStreamControlBox = styled.div`
  width: 100%;
  height: 80px;
  display: ${(props) => props.display};
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  column-gap: 10px;
  background: transparent linear-gradient(180deg, #4e4e4e 0%, #2c2c2c 100%) 0%
    0% no-repeat;
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

const StSessionVidoContainerInner = styled.div`
  text-align: left;
  height: 476px;
  overflow: hidden;
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
  text-align: center;
  padding: 70px 60px 0;
  flex-grow: 2;
`;

const StSessionVideoBoxView = styled.div`
  padding: 30px 60px;
`;
const StSessionVideoBox = styled.div`
  //min-width: 900px;
  max-width: 1272px;
  width: 1272px;
  //min-width: 1150px;
  margin: 0 auto;
  position: relative;
  background: ${(props)=>props.background};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StSessionMainVideo = styled.div`
  display: none;
`;

const StSessionH1 = styled.h1`
  color: #fff;
  font-size: 26px;
  font-weight: bold;
  display: inline;
`;
const StSessionUserBox = styled.div`
  visibility: ${(props) => props.visibility};
`;
const StSessionH1Box = styled.div`
  display: flex;
  align-items: center;
`;

const StSessionHeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const StSessionHeader = styled.div`
  width: calc(100% - 120px);
  border-bottom: 1px solid #fff;
  display: flex;
  justify-content: center;
  padding: 30px 0 25px;
  margin: 0 auto;
`;

const StSessionWrap = styled.div`
  width: 100%;
  margin: 0 auto;
`;
const StWrap = styled.div`
  min-width: 1600px;
  background-color: #fff;
  ::-webkit-scrollbar {
    /* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
    display: none;
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;

export default ChatRoom;
