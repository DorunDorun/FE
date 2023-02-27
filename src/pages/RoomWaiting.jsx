import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

//컴포넌트
import ButtonDefault from '../Components/ButtonDefault'
import { regExpNickName } from '../Components/apis/RegExp'


//스토어-방 입장
import useStoreRoomJoin from '../zustand/storeRoomJoin'

const RoomWaiting = () => {

  const navigate = useNavigate()


  useEffect(()=>{
    getUserMedia()
  },[])



  //유효성 검사 메세지
  const [validMessageNickName, setValidMessageNickName]=useState("")

  const messageNickName = "2 ~ 20글자 이내로 입력하세요."

  //스토어-방 입장 /공개, 비공개
  const fetchPostRoomJoin = useStoreRoomJoin((state) => state.fetchPostRoomJoin);
  const fetchPostRoomJoinPassword = useStoreRoomJoin((state) => state.fetchPostRoomJoinPassword);
  

  //방 정보 불러오기
  const title = localStorage.getItem("title")
  const nickNameBefroe = localStorage.getItem("name")
  const sessionId = localStorage.getItem("sessionId")
  const statusString = localStorage.getItem("status")
  const status = statusString === "true"

  //디바이스 상태
  const [selectDevice, setSelectDevice]=useState(false)

  const nickNameRef = useRef()
  const videoRef = useRef()


  //닉네임
  const [nickName, setNickName]=useState(nickNameBefroe)


  useEffect(()=>{
    setSelectDevice((currentValue) => currentValue)
  },[selectDevice])


  //방 정보가 없다면 이전 페이지로 이동
  if(!title && !nickNameBefroe && !sessionId && !status){
    alert("방 정보 불러오기 에러! 다시 시도해주세요!")
    return navigate(-1)
  }


  
  
  //비디오, 오디오 불러오기
  const getUserMedia= async ()=>{
    const CONSTRAINTS = { video: true, audio: true };
    await navigator.mediaDevices.getUserMedia(CONSTRAINTS)
    .then((media)=>{
      const video = media.getVideoTracks()[0]
      const audio = media.getAudioTracks()[0]
      if(!video || !audio){
        alert("카메라와 마이크 선택은 필수입니다!")
        return false
      }
      setSelectDevice(true) //디바이스 선택 상태 값
      if(videoRef.current !== null){
        videoRef.current.srcObject = media;
      }
    });
    
  } 
  

  


  //방 입장 api
  const onSubmitJoinRoom=(e)=>{
    e.preventDefault()
    console.log("selectDevice : ", selectDevice)
    if(!selectDevice) { //디바이스 선택 상태 값
      alert("디바이스를 선택해주세요!")
      return false
    }
    
    console.log("regExpNickName(nickName) : ", regExpNickName(nickName))

    if(!regExpNickName(nickName)){ //유효성 실패
      setValidMessageNickName(messageNickName)
      nickNameRef.current.focus()
      console.log("유효성 실패")
      return false
    }else{ //유효성 통과
      console.log("유효성 통과")
      setValidMessageNickName("")      
    }
    console.log("status : ", status)
    if(status){ //공개 방
      const roomJoinPayloadOpen={ //공개 방 정보
        sessionId:sessionId,
        nickName:nickName
      }
      fetchPostRoomJoin(roomJoinPayloadOpen)
      .then((res)=>{
        console.log("공개 방 입장!! res : ", res)
        if(res.data.statusCode === "200"){
          return navigate(`/room/${sessionId}`)
        }else{
          alert("다시 시도해주세요!")
        }
        
      })

    }else{ //비공개 방
      const roomJoinPayloadPrivate={ //비공개 방 정보
        sessionId:sessionId,
        nickName:nickName,
        password:localStorage.getItem("password")
      }
      console.log("roomJoinPayloadPrivate : ", roomJoinPayloadPrivate)
      fetchPostRoomJoinPassword(roomJoinPayloadPrivate)
      .then((res)=>{
        console.log("비공개 방 입장! ", res)
        if(res.data.statusCode === "200"){
          return navigate(`/room/${sessionId}`)
        }else{
          alert("다시 시도해주세요!")
        }
      })
    }     

    
  }

  return (
    <StRoomWaitingWrap>
        <StRoomWaitingContainer>
            <StRoomWaitingTitle>{title}</StRoomWaitingTitle>
            <StRoomWaitingUse>라이브룸에서 사용할 비디오와 프로필을 설정해주세요.</StRoomWaitingUse>
            <StRoomWaitingSettingBox>
              <StRoomWaitingVideo autoPlay ref={videoRef}></StRoomWaitingVideo>
              <StRoomWaitingInputBox onSubmit={onSubmitJoinRoom}>
                <StRoomWaitingInput 
                  value={nickName} 
                  onChange={(e)=>{setNickName(e.target.value)}} 
                  placeholder="사용하실 닉네임을 입력하세요" 
                  minlength="2"
                  maxlength="20"
                  ref={nickNameRef}
                  autoFocus />
                <ButtonDefault width="120px" height="50px" bgColor="#CB8AFE" fontColor="#fff" hoverBgColor="#8500EF" hoverFontColor="#fff">참여하기</ButtonDefault>
              </StRoomWaitingInputBox>
              {validMessageNickName && <StValidMessage>{validMessageNickName}</StValidMessage>}
            </StRoomWaitingSettingBox>
        </StRoomWaitingContainer>
    </StRoomWaitingWrap>
  )
}


const StValidMessage=styled.span`
  color: red;
  position: absolute;
  bottom: -35px;
  left: 0;
  font-weight: bold;
`
const StRoomWaitingVideo=styled.video`
  background-color: #000;
  width: 600px;
`
const StRoomWaitingInput=styled.input.attrs({
  type:"text"
})`
  width: 80%;
  border-radius: 10px;
  border: 2px solid #8D4DBD;
  box-shadow: none;
  padding: 5px 10px;
`
const StRoomWaitingInputBox=styled.form`
  display: flex;
  justify-content: space-between;
  column-gap: 10px;
`
const StRoomWaitingSettingBox=styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  row-gap: 20px;
  position: relative;
`
const StRoomWaitingUse=styled.h3`
  margin-bottom: 50px;
`
const StRoomWaitingTitle=styled.h2`
  font-weight: bold;
  font-size: 30px;
  margin-bottom: 20px;
`
const StRoomWaitingContainer=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: -200px;
`
const StRoomWaitingWrap=styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
`




export default RoomWaiting