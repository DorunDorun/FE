import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatRoom from './ChatRoom';
import { nanoid } from 'nanoid';



//스토어 방 입장 (참여자)
import useStoreRoomJoin from '../zustand/storeRoomJoin';

const ChatRoomSubscriber = () => {

  const navigate = useNavigate()

  //새로고침 상태
  const [isRefresh, setIsRefresh]=useState(false)

    


    

    

    //방 입장 데이터 (참여자)
    const roomInfo = useStoreRoomJoin((state) => state.data.data);
    const loading = useStoreRoomJoin((state) => state.loading);
    const hasErrors = useStoreRoomJoin((state) => state.hasErrors);
    const chatRoomUserList = roomInfo.chatRoomUserList

    useEffect(()=>{
        console.log('참여자 data roomInfo :', roomInfo)
    },[])

    //현재 입장한 유저 필터링
    const nowUserFilter = chatRoomUserList.filter((user)=> user.nowUser === true)
    
    //입장 유저 데이터-공통
    const {title, subtitle, sessionId, saying} = roomInfo
    
    //입장 유저 데이터-개인
    const {enterRoomToken, nickname} = nowUserFilter[0]

    //스토어-방 입장(재갱신)
    const fetchPostRoomJoin = useStoreRoomJoin((state) => state.fetchPostRoomJoin);

    //토큰 값
    const [refreshToken, setRefreshToken]=useState(enterRoomToken)

    
    


    useEffect(()=>{
        console.log('참여자 nowUserFilter :', nowUserFilter)
        const info={
            title:title,
            sessionId:sessionId,
            enterRoomToken:enterRoomToken,
            nickname:nickname
        }
        console.log('참여자 info :', info)
    },[])


/*
//새로고침 시 실행
const preventClose = (e) => {
    console.log("참가자 새로고침")
    e.preventDefault();
    e.returnValue = ""; // chrome에서는 설정이 필요해서 넣은 코드
}

useEffect(() => {
  window.addEventListener("beforeunload", preventClose);    


return () => {
    window.removeEventListener("beforeunload", preventClose);
};
},[]);





//새로고침 시 실행
/*
const reloadToken=()=>{
    const reloadRoomInfo={
      sessionId:sessionId,
      reload:true
  }
    console.log("새로고침 시작 참여자 reloadRoomInfo ", reloadRoomInfo)
    fetchPostRoomJoin(reloadRoomInfo)
      .then((res)=>{
        console.log("새로고침 갱신 참여자 res ", res)
        const refreshNowUser = res.data.data.chatRoomUserList.filter((user)=> user.nowUser === true)
        console.log("새로고침 갱신 참여자 refreshNowUser ", refreshNowUser[0])
        setRefreshToken(refreshNowUser[0].enterRoomToken)
        // return res
    })
    
  }
  
  
  useEffect(()=>{
    console.log("beforeunload 시작 1")
    window.addEventListener('beforeunload', (event) => {
      console.log("beforeunload 시작 2")
        event.preventDefault();
        // Chrome에서는 returnValue 설정 필요
        event.returnValue = ''
        reloadToken()
    })
    return ()=>{
      console.log("beforeunload 종료 1")
      window.removeEventListener('beforeunload', (event) => {
        console.log("beforeunload 종료 2")
        event.preventDefault();
        // Chrome에서는 returnValue 설정 필요
        event.returnValue = ''
        reloadToken()
    })
    }
  },[])

*/




  return (
    <ChatRoom
    key={nanoid()}
    roomTitle={title}
    userSessionId={sessionId}
    userToken={isRefresh ? refreshToken : enterRoomToken}
    //userToken={enterRoomToken}
    userNickName={nickname}
    loading={loading}
    hasErrors={hasErrors}
    />
        
  )
}


export default ChatRoomSubscriber