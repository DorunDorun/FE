import React,{useState} from 'react'
import styled from 'styled-components'
import {FcLock} from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

//컴포넌트
import ButtonDefault from './ButtonDefault';
//스토어 방장 상태
import useStoreRoomMasterCheck from '../zustand/stoerRoomMasterCheck';
import useStoreRoomJoin from '../zustand/storeRoomJoin';

const RoomItem = ({sessionId, category, title, subTitle, status, password, userCount, onClick}) => {

  const navigate=useNavigate()
  

  //방 입장 데이터
  const fetchPostRoomJoinPassword = useStoreRoomJoin((state) => state.fetchPostRoomJoinPassword);
  //방장 상태
  const roomMasterStatus = useStoreRoomMasterCheck((state) => state.roomMasterStatus);

  //password 입력 상태
  const [isPasswordInputHide, setIsPasswordInputHide]=useState(true)
  //password
  const [roomPasswordInput, setRoomPasswordInput]=useState("")

  const onClickProps=()=>{
    onClick()
    if(!status){
      setIsPasswordInputHide(status)
    }

  }

  //닫기 버튼 클릭
  const onClickClosePasswordInput=()=>{
    setIsPasswordInputHide(true)
  }

  //확인 버튼 클릭
  const onClickSubmitPassword=()=>{
    console.log("확인 클릭! 비밀번호 : ", roomPasswordInput)
    //방 비밀번호 비교
    if(roomPasswordInput === password){
      const joinInfo={
        sessionId:sessionId,
        password:roomPasswordInput
      }
      fetchPostRoomJoinPassword(joinInfo)
      .then((res)=>{
        console.log("방 비밀번호 입장 res res ", joinInfo)
        if(res.status === 200){
          roomMasterStatus(false)
            return navigate("/room")
        }
      })
    }else{
      return alert("비밀번호가 다릅니다!")
    }
  }

  return (
    <StRoomItem>
        <StRoomItemMainInfo>
        <StRoomItemMainInfoCategory>{category}</StRoomItemMainInfoCategory>

        <StRoomItemMainInfoButtonBox>
            <StRoomItemMainInfoJoinButton onClick={onClickProps}>입장</StRoomItemMainInfoJoinButton>
            {
            !isPasswordInputHide &&
            <>
              <input type="text" placeholder="비밀번호를 입력하세요." value={roomPasswordInput} onChange={(e)=>setRoomPasswordInput(e.target.value)}/> 
              <ButtonDefault onClick={onClickSubmitPassword}>확인</ButtonDefault>
              <button onClick={onClickClosePasswordInput}>닫기</button>
            </>
            }
            
        </StRoomItemMainInfoButtonBox>

        <StRoomItemMainInfoRoomInfo>
            <StRoomItemMainInfoRoomInfoLock>
            {!status && <FcLock/>}
            </StRoomItemMainInfoRoomInfoLock>
            <StRoomItemMainInfoRoomInfoTitle>{title}</StRoomItemMainInfoRoomInfoTitle>
            <StRoomItemMainInfoRoomInfoSubTitle>{subTitle}</StRoomItemMainInfoRoomInfoSubTitle>
        </StRoomItemMainInfoRoomInfo>

        </StRoomItemMainInfo>

        <StRoomItemPeopleConutBox>
        <StRoomItemPeopleConutBoxStatus></StRoomItemPeopleConutBoxStatus>
        <StRoomItemPeopleConutBoxTitle>참가자</StRoomItemPeopleConutBoxTitle>
        <StRoomItemPeopleConutBoxCount>{userCount} / 6</StRoomItemPeopleConutBoxCount>
        </StRoomItemPeopleConutBox>

    </StRoomItem>
  )
}



const StRoomItemPeopleConutBoxCount=styled.span`

`
const StRoomItemPeopleConutBoxTitle=styled.span`
  margin: 0 10px;
`
const StRoomItemPeopleConutBoxStatus=styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: purple;
`
const StRoomItemPeopleConutBox=styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px 8px 20px;
`
const StRoomItemMainInfoRoomInfoSubTitle=styled.span`
  
`
const StRoomItemMainInfoRoomInfoTitle=styled.span`
  
`
const StRoomItemMainInfoRoomInfoLock=styled.i``
const StRoomItemMainInfoRoomInfo=styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  padding: 10px 10px 30px;
`
const StRoomItemMainInfoJoinButton=styled.button`
  background-color: purple;
  border: none;
  color: #fff;
  border-radius: 50px;
  width: 50px;
  height: 50px;
  cursor: pointer;
`
const StRoomItemMainInfoButtonBox=styled.div``
const StRoomItemMainInfoCategory=styled.span`
  background-color: rgba( 0, 0, 0, 0.6 );
  color: #fff;
  padding: 6px 16px;
  border-radius: 14px;
`
const StRoomItemMainInfo=styled.div`
  border-bottom: 1px solid purple;
  border-radius: 10px;
`
const StRoomItem=styled.div`
  border: 1px solid purple;
  border-radius: 10px;
  flex-basis: 23.7%;
`




export default RoomItem