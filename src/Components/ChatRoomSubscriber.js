import React, { useEffect } from 'react';
import ChatRoom from './ChatRoom';
import { nanoid } from 'nanoid';

//스토어 방 입장 (참여자)
import useStoreRoomJoin from '../zustand/storeRoomJoin';


const ChatRoomSubscriber = () => {

    useEffect(()=>{
        console.log('😀😀😀 ChatRoomSubscriber ! 참여자 !!')
    },[])


    //방 입장 데이터 (참여자)
    const roomInfo = useStoreRoomJoin((state) => state.roomInfo);
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

    //입장 유저 데이터에 title 포함이 가능한지?
        //비효율적이라면 저장소 활용

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


  return (
    <ChatRoom
    key={nanoid()}
    roomTitle={title}
    userSessionId={sessionId}
    userToken={enterRoomToken}
    userNickName={nickname}
    loading={loading}
    hasErrors={hasErrors}
    />
        
  )
}


export default ChatRoomSubscriber