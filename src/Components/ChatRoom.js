/*기본*/
import React, { useState, Component, useRef, useEffect } from 'react';
import styled from "styled-components";
import { OpenVidu } from 'openvidu-browser';
import { useNavigate } from 'react-router-dom';


/*컴포넌트*/
import UserVideoComponent from './UserVideoComponent';
import CanvasDrawing from './CanvasDrawing'
import ButtonDefault from './ButtonDefault';
import WhiteBoard from './WhiteBoard';

//스토어-방 삭제
import useStoreRoomDelete from '../zustand/storeRoomDelete';

//스토어-방 정보 불러오기
import useStoreRoomInfoGet from '../zustand/storeRoomInfoGet';


//스토어-새로고침
import useStoreRefreshStatus from '../zustand/storeRefreshStatus';


function ChatRoom () {
    console.log("ChatRoom 시작!")
    //roomTitle, userSessionId, userToken, userNickName, loading, hasErrors
    const roomTitle = localStorage.getItem("title")
    const userSessionId = localStorage.getItem("sessionId")
    const userNickName = localStorage.getItem("name")

    //방 정보 불러오기
    const fetchRoomInfoGet = useStoreRoomInfoGet((state)=>state.fetchRoomInfoGet)

    const [userToken, setUserToken]=useState(undefined)

    const navigate = useNavigate()

    //방 기본 정보
    const [session, setSession] = useState(undefined)
    const [subscribers, setSubscribers]=useState([])
    const [publisher, setPublisher] = useState(null)
    const [mainStreamManager, setMainStreamManager] = useState(undefined) // Main video of the page. Will be the 'publisher' or one of the 'subscribers'
    const [currentVideoDevice, setCurrentVideoDevice]=useState(undefined)
    const [publisherConnectionId, setPublisherConnectionId]=useState(undefined)

    //오디오, 비디오 컨트롤
    const [isPublisherAudio, setIsPublisherAudio]=useState(true)
    const [isPublisherVideo, setIsPublisherVideo]=useState(true)
    const [isSubscriberAudio, setIsSubscriberAudio]=useState(true)
    const [isSubscriberVideo, setIsSubscriberVideo]=useState(true)
    const [nowSubscriber, setNowSubscriber]=useState(null)
    const [isPublisherSpeaker, setIsPublisherSpeaker]=useState(false) //음성 감지 상태 - 게시자
    //const [isSubscriberSpeaker, setIsSubscriberSpeaker]=useState(false) //음성 감지 상태 - 참여자
    const [subscriberSpeakerConnectionId, setSubscriberSpeakerConnectionId]=useState(undefined)


    //스토어-방 삭제
    const fetchDeleteRoom = useStoreRoomDelete((state)=>state.fetchDeleteRoom)

    //스토어-새로고침
    const refreshStatusToggle = useStoreRefreshStatus((state)=>state.refreshStatusToggle)

    //캔버스 컨트롤
    const [isCanvas, setIsCanvas]=useState(false)
    const [isCanvasDefault, setIsCanvasDefault]=useState(true)

    //화이트보드
    const[isWhiteBoard, setIsWhiteBoard]=useState(false)

    const [isRefresh, setIsRefresh]=useState(false)




    //새로고침 시
    const refreshSession = (e) => {
        e.preventDefault();
        fetchDeleteRoom(userSessionId)
        setIsRefresh(true)
        resetSession()
        navigate("/roomWaiting")
    }


    //브라우저 새로고침, 종료 시 실행
    useEffect(() => {
        window.addEventListener("beforeunload", refreshSession);
        return()=>{
            window.removeEventListener("beforeunload", refreshSession);
        }
    },[]);

    useEffect(()=>{ //방 정보 불러오기
        console.log("isRefresh isRefresh : ", isRefresh)
        if(isRefresh===true){
            navigate("/roomWaiting")
        }else{
            fetchRoomInfoGet(userSessionId)
            .then((res)=>{
                if(res === undefined){
                    return navigate("/roomWaiting")
                }
                console.log("방 정보 불러옴 !! 🤸‍♂️ res : ", res)
                const nowUserFilter = res.data.data.chatRoomUserList.filter((user)=> user.nowUser === true)
                console.log("nowUserFilter[0].enterRoomToken : ", nowUserFilter[0].enterRoomToken)
                const userTokenData = nowUserFilter[0].enterRoomToken
                const userNickNameData = nowUserFilter[0].nickname
                //스트림 연결
                connection(userTokenData, userNickNameData)
                
            })
        }
        
        
    },[])


    

    //메인 비디오(크게 보기)
    const onClickMainVideoStream = (stream) => {
        if (mainStreamManager !== stream) {
            setMainStreamManager(stream)
        }
    }

    //나간 인원, 참여자 목록에서 삭제
    const deleteSubscriber = (streamManager) => {
        console.log('streamManager :::::::: ', streamManager)
        let index = subscribers.indexOf(streamManager, 0);
        console.log('❌ deleteSubscriber subscribers : ', subscribers)
        console.log('deleteSubscriber subscribers length : ', subscribers.length)
        if (index > -1) {
            subscribers.splice(index, 1);
            setSubscribers(subscribers)
            console.log('❌❌ deleteSubscriber subscribers : ', subscribers)
            console.log('deleteSubscriber subscribers length 2222 : ', subscribers.length)
        }
        subscribers.length === 0 && setSubscribers([])
    }


    /*게시자 디바이스 컨트롤*/

    //게시자 오디오 컨트롤
    const onClickPublisherAudioToggle=()=>{
        setIsPublisherAudio(!isPublisherAudio)
    }

    //게시자 오디오 컨트롤
    useEffect(()=>{
        console.log('onClickPublisherAudioToggle : ', isPublisherAudio)
        console.log('onClickPublisherAudioToggle publisher : ', publisher)
        if(publisher){
            publisher.publishAudio(isPublisherAudio)
        }
    },[isPublisherAudio])

    //게시자 비디오 컨트롤
    const onClickPublisherVideoToggle=()=>{
        setIsPublisherVideo(!isPublisherVideo)
    }
    
    //게시자 비디오 컨트롤
    useEffect(()=>{
        if(publisher){
            publisher.publishVideo(isPublisherVideo)
        }
    },[isPublisherVideo])


    /*참여자 디바이스 컨트롤*/

    //참여자 오디오 컨트롤
    const onClickSubscriberAudioToggle=(connectionId)=>{
        const subConnectionId = connectionId
        setIsSubscriberAudio(!isSubscriberAudio)
        console.log('clientId ::::: ', subConnectionId)
        const subscriberFilter = subscribers.filter((sub)=>{
            console.log('filter sub : ', sub)
            console.log('filter sub.stream.connection.session.token : ', sub.stream.connection.connectionId)
            console.log('filter subTokenId : ', subConnectionId)
            return sub.stream.connection.connectionId === subConnectionId
        })
        setNowSubscriber(subscriberFilter)
        //.stream.connection.session.token === subTokenId
        console.log('❗ subscriberFilter : ', subscriberFilter)
    }

    //참여자 오디오 컨트롤
    useEffect(()=>{
        console.log('onClickSubscriberAudioToggle : ', isSubscriberAudio)
        console.log('❗ nowSubscriber : ', nowSubscriber)
        if(nowSubscriber && nowSubscriber.length>0){
            const subscriber = nowSubscriber
            subscriber[0].subscribeToAudio(isSubscriberAudio)
            return console.log('onClickSubscriberAudioToggle nowSubscriber 22222 : ', subscriber)
        }
    },[isSubscriberAudio])


    //참여자 비디오 컨트롤
    const onClickSubscriberVideoToggle=(connectionId)=>{
        const subConnectionId = connectionId
        setIsSubscriberVideo(!isSubscriberVideo)
        
        const subscriberFilter = subscribers.filter((sub)=>{

            return sub.stream.connection.connectionId === subConnectionId
        })
        setNowSubscriber(subscriberFilter)
    }

    //참여자 비디오 컨트롤 
    useEffect(()=>{
        console.log('onClickSubscriberVVVVideoToggle : ', isSubscriberVideo)
        console.log('❗ nowSubscriber : ', nowSubscriber)
        if(nowSubscriber && nowSubscriber.length>0){
            const subscriber = nowSubscriber
            subscriber[0].subscribeToVideo(isSubscriberVideo)
        }
    },[isSubscriberVideo])


    //캔버스 컨트롤
    const onClickCanvasToggle=()=>{
        setIsCanvasDefault(false)
        setIsCanvas(!isCanvas)
    }


    //화이트보드 컨트롤
    const onClickWhiteBoardToggle=()=>{
        setIsWhiteBoard(!isWhiteBoard)
    }



    //음성감지
    useEffect(()=>{
        const mySession = session
        if(mySession){
            mySession.on('publisherStartSpeaking', (event) => { //음성감지 음성 시작
                const speakerId = event.connection.connectionId
                console.log('음성감지 시작 User ' + event.connection.connectionId + ' start speaking');
                console.log('음성감지 시작 게시자 : ', publisherConnectionId)
                console.log('음성감지 시작 참여자 : ', event.connection.connectionId)
                speakerId === publisherConnectionId ? setIsPublisherSpeaker(true) : setSubscriberSpeakerConnectionId(speakerId)
            });
            
            mySession.on('publisherStopSpeaking', (event) => { //음성감지 음성 종료
                const speakerId = event.connection.connectionId
                console.log('음성감지 종료 ' + event.connection.connectionId + ' stop speaking');
                console.log('음성감지 종료 : ', publisherConnectionId)
                console.log('음성감지 종료 : ', event.connection.connectionId)
                speakerId === publisherConnectionId ? setIsPublisherSpeaker(false) : setSubscriberSpeakerConnectionId(undefined)
            });
        }
    },[publisherConnectionId])
    


    
    

    //연결
    function connection (userToken, userNickName) {

        const connectionInfo={
            userToken : userToken,
            userNickName : userNickName
        }

        console.log("connection info : ", connectionInfo)

        let OV = new OpenVidu(); //openvidu 객체 생성
        OV.enableProdMode();
        
        //setOV(OV)

        let mySession = OV.initSession(); //세션 생성
        setSession(mySession)

        // On every new Stream received...
        mySession.on('streamCreated', (event) => {
            setSubscribers([])

            console.log('subscribers 확인 처음!@@ subscribers ::: ', subscribers)

            const newSubscriber = mySession.subscribe(event.stream, undefined);

            console.log('입장 아이디 : ', event.stream.connection.data)
            console.log('subscribers 확인 처음! subscribers ::: ', subscribers)

            const newSubscribers = subscribers
            newSubscribers.push(newSubscriber)
            setSubscribers([...newSubscribers])

            console.log('subscribers 확인 1 newSubscriber ::: ', newSubscriber)
            console.log('subscribers 확인 2 newSubscribers ::: ', newSubscribers)
            console.log('subscribers 확인 3 subscribers ::: ', subscribers)
        });

        // On every Stream destroyed...
        mySession.on('streamDestroyed', (event) => {
            console.log(' streamDestroyed event : ' , event)
            console.log(' streamDestroyed subscribers 1 : ' , subscribers)

            deleteSubscriber(event.stream.streamManager);

            console.log(' streamDestroyed subscribers 2 : ' , subscribers)
            console.log('event.stream.typeOfVideo !@!@!@!@ : ' , event.stream)
            console.log('퇴장 @@@ : ', event.stream.connection.connectionId)

        });

        // On every asynchronous exception...
        mySession.on('exception', (exception) => {
            console.warn(exception);
        });

        //세션 연결
        mySession.connect(userToken, {clientName: userNickName})
        .then(async () => {

            console.log('✨✨✨ 토큰 확인', userToken)
            
            console.log('✨✨✨✨✨ 유저 : ', userNickName)

            OV.getUserMedia({
                audioSource: false,
                videoSource: undefined,
                resolution: '1280x720',
                frameRate: 10,
                
            }).then((mediaStream) => {
                var videoTrack = mediaStream.getVideoTracks()[0];
                let publisher = OV.initPublisher(
                    undefined,
                    {
                    audioSource: undefined, //audio. undefined = default audio
                    videoSource: videoTrack, //video. undefined = default webcam
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '680x480', //video size
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: true,
                    }
                );
                console.log('publisher 확인하기! : ', publisher)
                publisher.once('accessAllowed', async () => {
                    mySession.publish(publisher);
                    const devices = await OV.getDevices()
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    const currentVideoDeviceId = videoDevices[0].deviceId
                    const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);
                    console.log('currentVideoDevice @@@@@@@@ : ', currentVideoDevice)

                    setCurrentVideoDevice(currentVideoDevice)
                    setPublisher(publisher);
                    setMainStreamManager(publisher)
                    setPublisherConnectionId(publisher.stream.connection.connectionId)
                });
            })

            //음성 감지 컨트롤
            OV.setAdvancedConfiguration({
                publisherSpeakingEventsOptions: {
                    interval: 100,   // Frequency of the polling of audio streams in ms (default 100)
                    threshold: -50  // Threshold volume in dB (default -50)
                }
            });
        })
        .catch((error) => { //에러일 경우 연결 종료
            //alert(error.message)
            //leaveSession()
            leaveSessionWaiting()
            return navigate('/roomWaiting')
        });

    }




    //스트림 초기화
    const resetSession=()=>{
        console.log("❌ resetSession !!")
        const mySession = session
        if(mySession){ //세션 연결 종료
            mySession.disconnect();
        }

        //스트림 매니저 초기화
        setMainStreamManager(undefined)

        //참여 인원 초기화
        setSession(undefined)
        setSubscribers([])
        setPublisher(undefined)
        
        //캔버스 초기화
        setIsCanvas(false)
        setIsCanvasDefault(true)
        console.log("방 삭제 , 초기화 완료!")
        
    }


    //나가기-대기 페이지
    const leaveSessionWaiting = () => {
        fetchDeleteRoom(userSessionId)
        resetSession()
        navigate('/roomWaiting')
}


    //나가기
    const leaveSession = () => {
        fetchDeleteRoom(userSessionId)
        .then((res)=>{ //api 삭제 요청
            if(res.status === 200){
                resetSession()
                navigate('/roomList')
            }else{
                alert("방 삭제 에러!")
            }
        })
    }
    

    //나가기 버튼 클릭
    const onClickLeaveSession=()=>{
        if(window.confirm("퇴장하시겠습니까?")){
            leaveSession()
        }
    }

    /*스위치 카메라*/
    const switchCamera = async () => {
        let OV = new OpenVidu();
        try {
            const devices = await OV.getDevices()
            var videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log('devices : ' , devices)
            console.log('videoDevices : ' , videoDevices)

            if (videoDevices && videoDevices.length > 1) {

                var newVideoDevice = videoDevices.filter(device => device.deviceId !== currentVideoDevice.deviceId)

                if (newVideoDevice.length > 0) {
                    // Creating a new publisher with specific videoSource
                    // In mobile devices the default and first camera is the front one
                    var newPublisher = OV.initPublisher(undefined, {
                        videoSource: newVideoDevice[0].deviceId,
                        publishAudio: true,
                        publishVideo: true,
                        mirror: true
                    });

                    await session.unpublish(mainStreamManager)
                    await session.publish(newPublisher)
                    setCurrentVideoDevice(newVideoDevice[0])
                    setMainStreamManager(newPublisher)
                    setPublisher(newPublisher)
                }
            }
        } catch (e) {
            console.error(e);
        }
    }

    // if (loading) {
    //     return <p>Loading</p>;
    //   }
    // if (hasErrors) {
    //     return <p>cannot read data : 서버 응답 에러</p>;
    // }



        
    return (
        <StWrap>
            <StSessionWrap>
                <StSessionVideoBox>
                    <StSessionHeader>
                        <StSessionH1>{roomTitle}</StSessionH1>
                    </StSessionHeader>
                    
                    <StSessionVidoContainer>
                        {publisher !== undefined
                        && 
                            <div className="sessionStreamBox">
                                <div className={isPublisherSpeaker && "isSpeaker"}  onClick={() => onClickMainVideoStream(publisher)}>
                                    <StStreamNickNamePublisher>나</StStreamNickNamePublisher>
                                    <UserVideoComponent streamManager={publisher} />
                                    <StStreamControlButtonBox>
                                        <ButtonDefault width="150px" fontColor="red" onClick={onClickPublisherVideoToggle}>{isPublisherVideo ? "내 비디오 on" : "내 비디오 off"}</ButtonDefault>
                                        <ButtonDefault width="150px" fontColor="red" onClick={onClickPublisherAudioToggle}>{isPublisherAudio ? "내 오디오 on" : "내 오디오 off"}</ButtonDefault>
                                    </StStreamControlButtonBox>
                                </div>
                                
                            </div>
                        }
                        {subscribers.length>0
                        &&
                            subscribers?.map((sub, i) => (
                            <div className="sessionStreamBox">
                                {console.log("✔✔✔ subscribers : ", sub)}
                                <div key={sub.id} 
                                className={subscriberSpeakerConnectionId === sub.stream.connection.connectionId && "isSpeaker"} 
                                onClick={() => onClickMainVideoStream(sub)}>
                                    <StStreamNickNamePublisher>{JSON.parse (
                                            sub.stream.connection.data.substring(0,sub.stream.connection.data.indexOf("%"))
                                        ).clientName} 님</StStreamNickNamePublisher>
                                    <UserVideoComponent streamManager={sub} />
                                    <StStreamControlButtonBox>
                                        <ButtonDefault fontColor="red" onClick={()=>{onClickSubscriberVideoToggle(sub.stream.connection.connectionId)}}>
                                            {isSubscriberVideo 
                                            ? "비디오 on"
                                            : "비디오 off"
                                            }
                                            </ButtonDefault>
                                        <ButtonDefault fontColor="red" onClick={()=>{onClickSubscriberAudioToggle(sub.stream.connection.connectionId)}}>
                                            {isSubscriberAudio
                                            ? "오디오 on"
                                            : "오디오 off"
                                            }
                                            </ButtonDefault>
                                    </StStreamControlButtonBox>
                                </div>
                                
                            </div>
                        ))}

                        

                    </StSessionVidoContainer>


                    {mainStreamManager !== undefined
                    &&
                    <StSessionMainVideo>
                        <UserVideoComponent streamManager={mainStreamManager} />
                    </StSessionMainVideo>
                    }


                    <StMyStreamControlBox>
                        <ButtonDefault width="150px" fontColor="red" onClick={onClickPublisherVideoToggle}>{isPublisherVideo ? "내 비디오 on" : "내 비디오 off"}</ButtonDefault>
                        <ButtonDefault width="150px" fontColor="red" onClick={onClickPublisherAudioToggle}>{isPublisherAudio ? "내 오디오 on" : "내 오디오 off"}</ButtonDefault>
                        <ButtonDefault 
                        fontColor="yellow" hoverBgColor="#FFFFEE" hoverFontColor="#000"
                        onClick={onClickCanvasToggle}>Canvas</ButtonDefault>
                        <ButtonDefault onClick={onClickWhiteBoardToggle}
                        bgColor="#fff" fontColor="#000" hoverBgColor="yellow" hoverFontColor="#000">화이트보드</ButtonDefault>
                        <ButtonDefault 
                        bgColor="red" color="#fff" hoverBgColor="yellow" hoverFontColor="#000" 
                        onClick={onClickLeaveSession}>나가기</ButtonDefault>
                    </StMyStreamControlBox>

                    <CanvasDrawing 
                    className={isCanvas ? "d-block" : "d-none"}
                    defaultClass={isCanvasDefault ? "defaultNone" : "" }
                    />

                    <WhiteBoard className={isWhiteBoard ? "block" : "none"}/>

                </StSessionVideoBox>
            </StSessionWrap>
        </StWrap>
    );
}



const StMyStreamControlBox=styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 10px;
    background-color: #000;
    height: 50px;
`
const StStreamControlButtonBox=styled.div`
    position: absolute;
    bottom: 5px;
    right: 5px;
    z-index: 1;
    display: flex;
    flex-direction: row;
    column-gap: 10px;
`
const StStreamNickNamePublisher=styled.span`
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 1;
    color: #fff;
    padding: 6px 16px;
    border-radius: 14px;
    background-color: rgba( 0, 0, 0, 0.5 );
`
const StSessionVidoContainer=styled.div`
    display:flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap : wrap;
    width: 100%;
    height: 400px;
    column-gap: 20px;
    margin-bottom: 160px;
    row-gap: 20px;
`
const StSessionVideoBox=styled.div`
    width: 1200px;
    margin: 0 auto;
    padding: 10px;
    position: relative;
`

const StSessionMainVideo=styled.div`
    display: none;
`

const StSessionH1=styled.h1`
    padding: 10px 16px;
    background-color: #000;
    color: #fff;
    border-radius: 4px;
    display: inline-block;
`
const StSessionHeader=styled.div`
    margin-bottom: 20px;
`

const StSessionWrap=styled.div`
    width: 100%;
    margin: 0 auto;
`
const StWrap=styled.div`
    
`



export default ChatRoom;
