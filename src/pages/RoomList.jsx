//기본
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';

//컴포넌트, 스타일, 아이콘
import ButtonDefault from '../Components/ButtonDefault';
import {GrSort} from 'react-icons/gr';
import { GoSearch } from 'react-icons/go';
import {BsFillGridFill} from 'react-icons/bs';
import RoomItem from '../Components/RoomItem';

//스토어 방 목록
import useStoreRoomList from '../zustand/storeRoomList';

//스토어 방 입장
import useStoreRoomJoin from '../zustand/storeRoomJoin';
//스토어 방장 상태
import useStoreRoomMasterCheck from '../zustand/stoerRoomMasterCheck';


const RoomList = () => {

  const navigate = useNavigate()

  //방 목록 데이터
  const fetchGetRoomList = useStoreRoomList((state) => state.fetchGetRoomList);
  const data = useStoreRoomList((state) => state.data);
  const loading = useStoreRoomList((state) => state.loading);
  const hasErrors = useStoreRoomList((state) => state.hasErrors);
  const roomList = useStoreRoomList((state) => state.roomList);

  //방 입장 데이터
  const fetchPostRoomJoin = useStoreRoomJoin((state) => state.fetchPostRoomJoin);
  const roomJoinData = useStoreRoomJoin((state) => state.data);
  const roomInfo = useStoreRoomJoin((state) => state.roomInfo);

  const storeRoomPassword = useStoreRoomJoin((state) => state.roomPassword);

  //방장 상태
  const roomMasterStatus = useStoreRoomMasterCheck((state) => state.roomMasterStatus);



  //방 목록 무한스크롤 api
  let roomGetPageCount = 1

  useEffect(()=>{
    getRoomList(roomGetPageCount)
  },[roomGetPageCount])

  const getRoomList=(roomGetPageCount)=>{
    fetchGetRoomList(roomGetPageCount)
    .then((res)=>{
      console.log('방 목록 fetch res data :', res)
      console.log('방 목록 chattingRoomList :', roomList)
    })
    
  }
  console.log("data : ", data)
  console.log("roomList : ", roomList)



  const onClickRoomJoin=(title, status, password, sessionId)=>{
    //room status가 true면 바로 패치
    if(status){
      fetchPostRoomJoin(sessionId)
      .then((res)=>{
        console.log("방 입장 res res ", res)
        if(res.status === 200){
          roomMasterStatus(false)
            return navigate("/room")
        }
      })
    }else{//room status가 false면
      //roomItem에서 컨트롤
    }
    const roomInfo={
      title : title,
      status : status,
      password : password,
      sessionId : sessionId
    }
    
    console.log("입장 클릭한 방 정보 " , roomInfo)

  }

  //방 만들기 클릭
  const onClickRoomCreate=()=>{
    navigate('/roomCreate')
  }


  if (loading) {
    return <p>Loading</p>;
  }
  if (hasErrors) {
      return <p>cannot read data : 서버 응답 에러</p>;
  }


  return (
    <StRoomListWrap>
        <StRoomListCenter>
          <StRoomListHeader>
              <StRoomListSearchBox>
                <StRoomListSearchInput placeholder="관심있는 키워드를 검색해보세요!"/>
                <StRoomListSearchButton>
                  <GoSearch/>
                </StRoomListSearchButton>
              </StRoomListSearchBox>
              <StRoomCreateButton onClick={onClickRoomCreate}>라이브룸 만들기</StRoomCreateButton>
          </StRoomListHeader>

          <StRoomListCategorySlide>
            <ButtonDefault>카테고리1</ButtonDefault>
            <ButtonDefault>카테고리2</ButtonDefault>
            <ButtonDefault>카테고리3</ButtonDefault>
          </StRoomListCategorySlide>

          <StRoomListBox>
            <StRoomListBoxInfo>
              <StRoomListBoxInfoH2>두런두런에 오신걸 환영합니다!</StRoomListBoxInfoH2>
              <StRoomListBoxInfoSortBox>
                <StRoomListSortSelectBox>
                  <option>생성일</option>
                </StRoomListSortSelectBox>
                <StButtonTransparent><BsFillGridFill/></StButtonTransparent>
                <StButtonTransparent><GrSort/></StButtonTransparent>
              </StRoomListBoxInfoSortBox>
            </StRoomListBoxInfo>

            <StRoomListBoxRooms>
              <StRoomListBoxRoomsContainer>

              {/* category, title, subtitle, privateStatus, peopleCount */}
              {roomList?.map((room)=>{
                return (
                  <RoomItem
                  key={nanoid()}
                  sessionId={room.sessionId}
                  title={room.title}
                  subTitle={room.subtitle}
                  category={room.category}
                  status={room.status}
                  userCount={room.cntUser}
                  password={room.password}
                  onClick={()=>{onClickRoomJoin(room.title, room.status, room.password, room.sessionId)}}
                  />
                )
              })}
                
              </StRoomListBoxRoomsContainer>
            </StRoomListBoxRooms>

          </StRoomListBox>
        </StRoomListCenter>
    </StRoomListWrap>
  )
}



const StRoomListBoxRoomsContainer=styled.div`
  display: flex;
  justify-content: flex-start;
  row-gap: 20px;
  column-gap: 20px;
  flex-wrap: wrap;
  border: 1px solid blue;
`
const StRoomListBoxRooms=styled.div`
  display: flex;
  justify-content: center;
`
const StButtonTransparent=styled.button``
const StRoomListSortSelectBox=styled.select``
const StRoomListBoxInfoSortBox=styled.div``
const StRoomListBoxInfoH2=styled.h2``
const StRoomListBoxInfo=styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`
const StRoomListBox=styled.div``
const StRoomListCategorySlide=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`
const StRoomCreateButton=styled.button``
const StRoomListSearchButton=styled.button``
const StRoomListSearchInput=styled.input.attrs(props=>({
  type: props.type || "text"
}))`
  width: 300px;
`
const StRoomListSearchBox=styled.div``
const StRoomListHeader=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
`

const StRoomListCenter=styled.div`
  max-width: 1400px;
  min-width: 1112px;
  border: 1px solid green;
  padding: 20px;
`
const StRoomListWrap=styled.section``



export default RoomList