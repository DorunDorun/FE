import React, { useEffect, useState } from 'react';
import ChatRoom from './ChatRoom';
import { useNavigate } from 'react-router';

//스토어 방 생성 (방장)
import useStoreRoomCreate from '../zustand/storeRoomCreate';
import { nanoid } from 'nanoid';

//스토어 방 입장-재갱신에 사용
import useStoreRoomJoin from '../zustand/storeRoomJoin';

//스토어 방장 상태
import useStoreRoomMasterCheck from '../zustand/stoerRoomMasterCheck';


const ChatRoomMaster = () => {

  const navigate = useNavigate()


    useEffect(()=>{
        console.log('😎😎😎 ChatRoomMaster ! 방장 !!')
    },[])

    //방 생성 데이터 (방장)
    const {data} = useStoreRoomCreate((state) => state.data);
    const loading = useStoreRoomCreate((state) => state.loading);
    const hasErrors = useStoreRoomCreate((state) => state.hasErrors);
    const {token, sessionId, masterName, title, saying} = data

    //스토어-방 입장(재갱신)
    const fetchPostRoomJoin = useStoreRoomJoin((state) => state.fetchPostRoomJoin);

      //방장 상태
      const roomMasterStatus = useStoreRoomMasterCheck((state) => state.roomMasterStatus);

    //토큰 값
    const [refreshToken, setRefreshToken]=useState(token)

    //방 입장 필수 데이터


    useEffect(()=>{
      console.log('방장 room data ', data)
      console.log('방장 room data 명언 ', saying)
    })

  //새로고침 시 실행
  const preventClose = (e) => {
      console.log("방장 새로고침")
      e.preventDefault();
      console.log("방장 새로고침2")
      e.returnValue = ""; // chrome에서는 설정이 필요해서 넣은 코드
      console.log("방장 새로고침3")
  }

  const reloadToken=(e)=>{
    preventClose(e)
    console.log("방장 새로고침4")
    roomMasterStatus(true) //방장 상태 true
  /*
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
  */
  }


  



  




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