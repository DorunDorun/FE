import React, { useEffect } from 'react';
import ChatRoom from './ChatRoom';

//스토어 방 생성 (방장)
import useStoreRoomCreate from '../zustand/storeRoomCreate';
import { nanoid } from 'nanoid';

const ChatRoomMaster = () => {

    useEffect(()=>{
        console.log('😎😎😎 ChatRoomMaster ! 방장 !!')
    },[])

    //방 생성 데이터 (방장)
    const {data} = useStoreRoomCreate((state) => state.data);
    const loading = useStoreRoomCreate((state) => state.loading);
    const hasErrors = useStoreRoomCreate((state) => state.hasErrors);
    const {token, sessionId, masterName, title, saying} = data

    useEffect(()=>{
      console.log('방장 room data ', data)
      console.log('방장 room data 명언 ', saying)
    })

  return (
    <ChatRoom
    key={nanoid()}
    userSessionId={sessionId}
    userToken={token}
    userNickName={masterName}
    loading={loading}
    hasErrors={hasErrors}
    roomTitle={title}
    />
        
  )
}

export default ChatRoomMaster