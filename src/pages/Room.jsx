/*기본*/
import React, { useEffect } from 'react';

//컴포넌트
import ChatRoomMaster from '../Components/ChatRoomMaster';
import ChatRoomSubscriber from '../Components/ChatRoomSubscriber';

//스토어 - 방장 상태
import useStoreRoomMasterCheck from '../zustand/stoerRoomMasterCheck';

//const APPLICATION_SERVER_URL = server_url_openvidu



function ChatRoomMain () {

    const isRoomMaster = useStoreRoomMasterCheck((state) => state.isRoomMaster);

    useEffect(()=>{
        console.log("isRoomMaster : " , isRoomMaster)
    })

        
    return (
        <>
        {
        isRoomMaster ? <ChatRoomMaster/> : <ChatRoomSubscriber/>
        }
        </>
    ); 
}





export default ChatRoomMain;
