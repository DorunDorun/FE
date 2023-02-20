/*기본*/
import React, { useState, Component, useRef, useEffect } from 'react';
import styled from "styled-components";
import { OpenVidu } from 'openvidu-browser';
import { useNavigate } from 'react-router-dom';


/*컴포넌트*/
import UserVideoComponent from '../Components/UserVideoComponent';
import CanvasDrawing from '../Components/CanvasDrawing'
import ButtonDefault from '../Components/ButtonDefault';
import WhiteBoard from '../Components/WhiteBoard';

/*api*/
import {server_url, server_url_openvidu} from '../shared/api'

//스토어 방 생성 (방장)
import useStoreRoomCreate from '../zustand/storeRoomCreate';
//스토어 방 입장 (참여자)
import useStoreRoomJoin from '../zustand/storeRoomJoin';


//const APPLICATION_SERVER_URL = server_url_openvidu



function ChatRoom () {

    const navigate = useNavigate()

    //const [OV, setOV]=useState(null)
    //const [myUserName, setMyUserName]=useState('user' + Math.floor(Math.random() * 1000))
    //const [mySessionId, setMySessionId]=useState('SessionA')
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
    const [isSubscriberSpeaker, setIsSubscriberSpeaker]=useState(false) //음성 감지 상태 - 참여자
    const [subscriberSpeakerConnectionId, setSubscriberSpeakerConnectionId]=useState(undefined)

    //캔버스 컨트롤
    const [isCanvas, setIsCanvas]=useState(false)
    const [isCanvasDefault, setIsCanvasDefault]=useState(true)

    //화이트보드
    const[isWhiteBoard, setIsWhiteBoard]=useState(false)


    //방 생성 데이터 (방장)
    const {data} = useStoreRoomCreate((state) => state.data);
    const loading = useStoreRoomCreate((state) => state.loading);
    const hasErrors = useStoreRoomCreate((state) => state.hasErrors);
    const {token, sessionId, roomMaster, master, nickName} = data
    const roomToken = token
    const roomSessionId = sessionId


    //방 입장 데이터 (참여자)
    const roomInfo = useStoreRoomJoin((state) => state.roomInfo);

    console.log("방 입장 sessionId : ", sessionId)

    //브라우저 종료 직전 실행
    useEffect(()=>{
        window.addEventListener('beforeunload', onbeforeunload);
    },[])

    //브라우저 종료 직전 실행
    const onbeforeunload = (e) => {
        console.log("종료")
        leaveSession();
        
    }

    //방 입장 실행
    useEffect(()=>{
        connection()
        return()=>{   
        }
    },[])

    //방장, 일반 참여자 구분
    useEffect(()=>{
        if(isMasterCheck){
            console.log('방장! ', isMasterCheck)
        }else{
            console.log("roomInfo : ", roomInfo)
        }
    },[])

    const isMasterCheck=()=>{
        return roomMaster ? true : false
    }

    useEffect(()=>{
        
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
        //console.log('onClickSubscriberAudioToggle subscribers subTokenId : ', subscribers.stream.connection.session.token)
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
    //화이트보드 오픈 시 본인 카메라 옆으로 빼는 UI 필요
    const onClickWhiteBoardToggle=()=>{
        setIsWhiteBoard(!isWhiteBoard)
    }



    //음성감지
    useEffect(()=>{
        const mySession = session
        if(mySession){
            mySession.on('publisherStartSpeaking', (event) => { //음성감지 음성 시작
                const speakerId = event.connection.connectionId
                console.log('음성감지 시작 User start ' + JSON.parse(event.connection.data).clientData);
                console.log('음성감지 시작 User ' + event.connection.connectionId + ' start speaking');
                console.log('음성감지 시작 게시자 : ', publisherConnectionId)
                console.log('음성감지 시작 참여자 : ', event.connection.connectionId)
                speakerId === publisherConnectionId ? setIsPublisherSpeaker(true) : setSubscriberSpeakerConnectionId(speakerId)
            });
            
            mySession.on('publisherStopSpeaking', (event) => { //음성감지 음성 종료
                const speakerId = event.connection.connectionId
                console.log('음성감지 종료 User stop ' + JSON.parse(event.connection.data).clientData);
                console.log('음성감지 종료 ' + event.connection.connectionId + ' stop speaking');
                console.log('음성감지 종료 : ', publisherConnectionId)
                console.log('음성감지 종료 : ', event.connection.connectionId)
                speakerId === publisherConnectionId ? setIsPublisherSpeaker(false) : setSubscriberSpeakerConnectionId(undefined)
            });
        }
    },[publisherConnectionId])
    


    //방 입장 인증
    
    if(!roomToken || !roomSessionId){ 
        alert("존재하지 않는 방입니다!")
        return navigate('/roomList') 
    }

    const roomJoinAuthCheck=()=>{}
    

    //연결
    const connection = () => {

        let OV = new OpenVidu(); //openvidu 객체 생성
        OV.enableProdMode();
        
        //setOV(OV)

        let mySession = OV.initSession(); //세션 생성
        setSession(mySession)

        // On every new Stream received...
        mySession.on('streamCreated', (event) => {
            setSubscribers([])
            // Subscribe to the Stream to receive it. Second parameter is undefined
            // so OpenVidu doesn't create an HTML video by its own

            console.log('subscribers 확인 처음!@@ subscribers ::: ', subscribers)

            const newSubscriber = mySession.subscribe(event.stream, undefined);

            console.log('입장 아이디 : ', event.stream.connection.connectionId)
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
            //deleteSubscriber(event.stream.connection.connectionId);

        });

        // On every asynchronous exception...
        mySession.on('exception', (exception) => {
            console.warn(exception);
        });

        //세션 연결
        mySession.connect(roomToken, {clientData: master || nickName})
        .then(async () => {

            const userCheck = {
                master:master,
                nickName:nickName
            }

            console.log('✨✨✨ 토큰 확인', roomToken)
            
            console.log('✨✨✨✨✨ 유저 : ', userCheck)

            OV.getUserMedia({
                audioSource: false,
                videoSource: undefined,
                resolution: '1280x720',
                frameRate: 10,
                
            }).then((mediaStream) => {
                var videoTrack = mediaStream.getVideoTracks()[0];
                //var currentVideoDeviceId = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                //var currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);
                //const videoSource = videoDevices[0].deviceId
                let publisher = OV.initPublisher(
                    master || nickName,
                    {
                    audioSource: undefined, // The source of audio. If undefined default microphone
                    videoSource: videoTrack, // The source of video. If undefined default webcam
                    publishAudio: true, // Whether you want to start publishing with your audio unmuted or not
                    publishVideo: true, // Whether you want to start publishing with your video enabled or not
                    resolution: '680x480', // The resolution of your video
                    frameRate: 30, // The frame rate of your video
                    insertMode: 'APPEND', // How the video is inserted in the target element 'video-container'
                    mirror: true, // Whether to mirror your local video or not
                    }
                );
                console.log('publisher 확인하기! : ', publisher)
                publisher.once('accessAllowed', async () => {
                    mySession.publish(publisher);
                    const devices = await OV.getDevices()
                    const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    //const currentVideoDeviceId2 = publisher.stream.getMediaStream().getVideoTracks()[0].getSettings().deviceId;
                    const currentVideoDeviceId = videoDevices[0].deviceId
                    const currentVideoDevice = videoDevices.find(device => device.deviceId === currentVideoDeviceId);
                    console.log('currentVideoDevice @@@@@@@@ : ', currentVideoDevice)

                    //setPublisher(publisher)
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
        .catch((error) => {
            //에러일 경우 연결 종료
            //console.log('❌ There was an error connecting to the session:', error.code, error.message);
            alert(error.message)
            leaveSession()
            return navigate('/roomList')
        });

    }



    //나가기
    const leaveSession = () => {
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

                    //newPublisher.once("accessAllowed", () => {
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

    if (loading) {
        return <p>Loading</p>;
      }
    if (hasErrors) {
        return <p>cannot read data : 서버 응답 에러</p>;
    }



        
    return (
        <StWrap>
            <StSessionWrap>
                <StSessionVideoBox>
                    <StSessionHeader>
                        <StSessionH1>{roomSessionId}</StSessionH1>
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
                                <div key={sub.id} 
                                className={subscriberSpeakerConnectionId === sub.stream.connection.connectionId && "isSpeaker"} 
                                onClick={() => onClickMainVideoStream(sub)}>
                                    <StStreamNickNamePublisher>{JSON.parse(sub.stream.connection.data).clientData} 님</StStreamNickNamePublisher>
                                    <UserVideoComponent streamManager={sub} />
                                    <StStreamControlButtonBox>
                                        <ButtonDefault fontColor="red" onClick={()=>{onClickSubscriberVideoToggle(sub.stream.connection.connectionId)}}>
                                            {isSubscriberVideo 
                                                //${JSON.parse(sub.stream.connection.data).clientData}
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
