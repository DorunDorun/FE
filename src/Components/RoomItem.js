import React,{useEffect, useState} from 'react'
import styled from 'styled-components'
import {FcLock} from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

//컴포넌트
import ButtonDefault from './ButtonDefault';
//css
import { COLOR } from '../Components/style/style';

const RoomItem = ({sessionId, category, title, subTitle, status, password, userCount,  backgroundImage, onClick}) => {

  const navigate=useNavigate()
  

  //password 입력 상태
  const [isPasswordInputHide, setIsPasswordInputHide]=useState(true)
  //password
  const [roomPasswordInput, setRoomPasswordInput]=useState("")
  //참가자 인원 상태
  const [userStatus, setUserStatus]=useState(COLOR.greenDefault)
  const maxUserCount = 6


  //click props + 비밀번호 창 컨트롤
  const onClickProps=()=>{
    onClick()
    if(!status){
      setIsPasswordInputHide(status)
    }
  }

  useEffect(()=>{
    if(userCount > 1 && userCount < maxUserCount){
      return setUserStatus(COLOR.baseDefault)
    } else if(userCount === maxUserCount){
      return setUserStatus(COLOR.redDefault)
    }else{
      return setUserStatus(COLOR.greenDefault)
    }
  },[])

  //비밀번호 창 닫기 버튼 클릭
  const onClickClosePasswordInput=()=>{
    setIsPasswordInputHide(true)
  }

  //비밀번호 창 확인 버튼 클릭
  const onClickSubmitPassword=()=>{

    //방 비밀번호 비교
    if(roomPasswordInput === password){ //일치

      localStorage.setItem("title", title)
      localStorage.setItem("sessionId", sessionId)
      localStorage.setItem("status", status)
      localStorage.setItem("password", password)
      
      return navigate(`/roomWaiting`)

    }else{
      return alert("입장 비밀번호가 다릅니다!")
    }
  }

  return (
    <StRoomItem>
        <StRoomItemMainInfo backgroundImage={backgroundImage}>
          <StRoomItemMainInfoCategoryBox>
            <StRoomItemMainInfoCategory>{category}</StRoomItemMainInfoCategory>
          </StRoomItemMainInfoCategoryBox>
          <StRoomItemMainInfoButtonBox>
              <StRoomItemMainInfoJoinButtonBox>
                <StRoomItemMainInfoJoinButton onClick={onClickProps}>입장</StRoomItemMainInfoJoinButton>
              </StRoomItemMainInfoJoinButtonBox>
              
          </StRoomItemMainInfoButtonBox>

          <StRoomItemMainInfoRoomInfo>
              <StRoomItemMainInfoRoomInfoLockBox justifyContent={isPasswordInputHide ? "flex-start" : "center"}>
                <StRoomItemMainInfoRoomInfoLock>
                {!status && <FcLock/>}
                </StRoomItemMainInfoRoomInfoLock>
                {
                !isPasswordInputHide &&
                <>
                  <StInputPassword placeholder="password" value={roomPasswordInput} onChange={(e)=>setRoomPasswordInput(e.target.value)}/> 
                  <ButtonDefault fontSize="10px" width="45px" height="25px" borderRadius="5px" hoverBgColor={COLOR.grayLight} onClick={onClickClosePasswordInput}>취소</ButtonDefault>
                  <ButtonDefault fontSize="10px" width="45px" height="25px" borderRadius="5px" fontColor="#fff" bgColor={COLOR.baseLight} hoverBgColor={COLOR.baseDefault} onClick={onClickSubmitPassword}>확인</ButtonDefault>
                  
                </>
                }
              </StRoomItemMainInfoRoomInfoLockBox>
              <StRoomItemMainInfoRoomInfoTitleBox>
                <StRoomItemMainInfoRoomInfoTitle>{title}</StRoomItemMainInfoRoomInfoTitle>
              </StRoomItemMainInfoRoomInfoTitleBox>
              <StRoomItemMainInfoRoomInfoSubTitleBox>
                <StRoomItemMainInfoRoomInfoSubTitle>{subTitle}</StRoomItemMainInfoRoomInfoSubTitle>
              </StRoomItemMainInfoRoomInfoSubTitleBox>
          </StRoomItemMainInfoRoomInfo>

        </StRoomItemMainInfo>

        <StRoomItemPeopleConutBox>
        <StRoomItemPeopleConutBoxStatus status={userStatus}></StRoomItemPeopleConutBoxStatus>
        <StRoomItemPeopleConutBoxTitle>참가자</StRoomItemPeopleConutBoxTitle>
        <StRoomItemPeopleConutBoxCount>
          <StRoomItemUserCount status={userStatus}>{userCount}</StRoomItemUserCount>
          / {maxUserCount}
          </StRoomItemPeopleConutBoxCount>
        </StRoomItemPeopleConutBox>

    </StRoomItem>
  )
}


const StRoomItemUserCount=styled.span`
  margin-right: 5px;
  color: ${(props)=>props.status};
`
const StRoomItemPeopleConutBoxCount=styled.span`
  font-size: 14px;
  font-weight: bold;
`
const StRoomItemPeopleConutBoxTitle=styled.span`
  font-size: 14px;
  font-weight: bold;
  margin: 0 8px;
`
const StRoomItemPeopleConutBoxStatus=styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: ${(props)=>props.status};
`
const StRoomItemPeopleConutBox=styled.div`
  display: flex;
  align-items: center;
  padding: 8px 10px 8px 20px;
`
const StRoomItemMainInfoRoomInfoSubTitle=styled.span`
  display: inline-block;
  width: 100%;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 100%;
`
const StRoomItemMainInfoRoomInfoSubTitleBox=styled.div`
  width:100%;
  height: 28px;
`
const StRoomItemMainInfoRoomInfoTitle=styled.span`
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  width: 100%;
  height: 28px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
const StRoomItemMainInfoRoomInfoTitleBox=styled.div`
  width:100%;
`
const StInputPassword=styled.input.attrs({
  type:"password"
})`
  flex-basis: 55%;
  min-width: 55%;
  padding: 0;
  margin: 0;
  padding: 2px 5px;
`
const StRoomItemMainInfoRoomInfoLock=styled.i``
const StRoomItemMainInfoRoomInfoLockBox=styled.div`
  display: flex;
  justify-content: ${(props)=>props.justifyContent};
  align-items: center;
  flex-direction: row;
  width: 100%;
  column-gap: 5px;
`
const StRoomItemMainInfoRoomInfo=styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 14px;
  padding: 10px 20px 30px;
  height: 130px;
`
const StRoomItemMainInfoJoinButton=styled.button`
  background-color: ${COLOR.baseLight};
  border: none;
  color: #000;
  border-radius: 50px;
  width: 60px;
  height: 60px;
  font-weight: bold;
  cursor: pointer;
  :hover{
    background-color: ${COLOR.baseDefault};
    color: #fff;
  }
`
const StRoomItemMainInfoJoinButtonBox=styled.div`
  display: flex;
  justify-content: flex-end;
  padding-right: 20px;
`
const StRoomItemMainInfoButtonBox=styled.div``
const StRoomItemMainInfoCategory=styled.span`
  background-color: rgba( 0, 0, 0, 0.6 );
  color: #fff;
  padding: 6px 16px;
  border-radius: 14px;
  font-size: 14px;
`
const StRoomItemMainInfoCategoryBox=styled.div`
  display: flex;
  padding: 15px 6px;
`
const StRoomItemMainInfo=styled.div`
  border-bottom: 1px solid purple;
  border-radius: 10px;
  background-image: url(${(props)=>props.backgroundImage});
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100% 80px;
`
const StRoomItem=styled.div`
  display: inline-block;
  text-align: left;
  border: 1px solid ${COLOR.baseDefault};
  border-radius: 10px;
  width: calc(25% - 20px);
  max-width: 360px;
  margin: 10px;
  font-size: 16px;
`




export default RoomItem