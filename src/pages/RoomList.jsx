//기본
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

//컴포넌트, 스타일, 아이콘
import ButtonDefault from '../Components/ButtonDefault';
import {GrSort} from 'react-icons/gr';
import { IoIosSearch } from 'react-icons/io';
import {BsFillGridFill} from 'react-icons/bs';
import RoomItem from '../Components/RoomItem';

//css
import { COLOR } from '../Components/style/style';



//스토어 방 목록
import useStoreRoomList from "../zustand/storeRoomList";


const RoomList = () => {
  const navigate = useNavigate();

  //방 목록 데이터
  const fetchGetRoomList = useStoreRoomList((state) => state.fetchGetRoomList);
  const data = useStoreRoomList((state) => state.data);
  const loading = useStoreRoomList((state) => state.loading);
  const hasErrors = useStoreRoomList((state) => state.hasErrors);
  const roomList = useStoreRoomList((state) => state.roomList);

/*

  //방 입장 데이터
  const fetchPostRoomJoin = useStoreRoomJoin(
    (state) => state.fetchPostRoomJoin
  );
  const roomJoinData = useStoreRoomJoin((state) => state.data);
  const roomInfo = useStoreRoomJoin((state) => state.roomInfo);

  const storeRoomPassword = useStoreRoomJoin((state) => state.roomPassword);

  //방장 상태
  const roomMasterStatus = useStoreRoomMasterCheck((state) => state.roomMasterStatus);

  //스토어-새로고침
  const refreshStatusToggle = useStoreRefreshStatus((state)=>state.refreshStatusToggle)
  const isRefresh = useStoreRefreshStatus((state)=>state.isRefresh)

*/

  //방 목록 무한스크롤 api
  let roomGetPageCount = 1;

  useEffect(() => {
    getRoomList(roomGetPageCount);
  }, [roomGetPageCount]);

  const getRoomList = (roomGetPageCount) => {
    fetchGetRoomList(roomGetPageCount).then((res) => {
      console.log("방 목록 fetch res data :", res);
      console.log("방 목록 chattingRoomList :", roomList);
    });
  };
  console.log("data : ", data);
  console.log("roomList : ", roomList);


  const onClickRoomJoin=(title, sessionId, status)=>{
    const info={
      title:title,
      sessionId:sessionId,
      status:status
    }
    console.log(" 방 목록 info : ", info)
    if(status){ //공개 방

      localStorage.setItem("title", title)
      localStorage.setItem("sessionId", sessionId)
      localStorage.setItem("status", status)
      return navigate(`/roomWaiting`)
    }
    
  }

  //방 만들기 클릭
  const onClickRoomCreate = () => {
    navigate("/roomCreate");
  };

  /*
  if (loading) {
    return <Wait />;
  }
  */
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러</p>;
  }
  if(roomList.length === 0){
    return <p>채팅방이 존재하지 않습니다~!</p>
  }

  return (
    <StRoomListWrap>
        <StRoomListSideNav>사이드 메뉴</StRoomListSideNav>
        
        <StRoomListCenter>
          <StRoomListHeader>
              <StRoomListSearchBox>
                <StRoomListSearchInput placeholder="관심있는 키워드를 검색해보세요!"/>
                <StRoomListSearchButton>
                  <IoIosSearch className="iconSearch"/>
                </StRoomListSearchButton>
              </StRoomListSearchBox>
              {/* <StRoomCreateButton >라이브룸 만들기</StRoomCreateButton> */}
              <ButtonDefault 
              width="17%" height="40px" 
              bgColor={COLOR.baseDefault} fontColor="#fff" 
              hoverBgColor={COLOR.greenLight} hoverFontColor="#000"
              onClick={onClickRoomCreate}
              >라이브룸 만들기</ButtonDefault>
          </StRoomListHeader>

        <StRoomListCategorySlide>
          <ButtonDefault>카테고리1</ButtonDefault>
          <ButtonDefault>카테고리2</ButtonDefault>
          <ButtonDefault>카테고리3</ButtonDefault>
        </StRoomListCategorySlide>

        <StRoomListBox>
          <StRoomListBoxInfo>
            <StRoomListBoxInfoH2>
              두런두런에 오신걸 환영합니다!
            </StRoomListBoxInfoH2>
            <StRoomListBoxInfoSortBox>
              <StRoomListSortSelectBox>
                <option>생성일</option>
              </StRoomListSortSelectBox>
              <StButtonTransparent>
                <BsFillGridFill />
              </StButtonTransparent>
              <StButtonTransparent>
                <GrSort />
              </StButtonTransparent>
            </StRoomListBoxInfoSortBox>
          </StRoomListBoxInfo>

          <StRoomListBoxRooms>
            <StRoomListBoxRoomsContainer>
              {/* category, title, subtitle, privateStatus, peopleCount */}
              {roomList?.map((room) => {
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
                  onClick={()=>{onClickRoomJoin(room.title, room.sessionId, room.status, room.password)}}
                  />
                );
              })}
            </StRoomListBoxRoomsContainer>
          </StRoomListBoxRooms>
        </StRoomListBox>
      </StRoomListCenter>
    </StRoomListWrap>
  )
  
}



const StRoomListSideNav=styled.div`
  max-width: 320px;
  min-width: 220px;
  height: 100vh;
`

const StRoomListBoxRoomsContainer=styled.div`
  display: flex;
  justify-content: flex-start;
  row-gap: 20px;
  column-gap: 20px;
  flex-wrap: wrap;
  border: 1px solid blue;
  min-width: 80%;
`
const StRoomListBoxRooms=styled.div`
  display: flex;
  justify-content: center;
`
const StButtonTransparent=styled.button``
const StRoomListSortSelectBox=styled.select``
const StRoomListBoxInfoSortBox=styled.div``
const StRoomListBoxInfoH2=styled.h2`
  font-family: "LottriaChab";
  font-size: 30px;
`
const StRoomListBoxInfo=styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const StRoomListBox = styled.div``;
const StRoomListCategorySlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  margin-bottom: 30px;
`
const StRoomCreateButton=styled.button``
const StRoomListSearchButton=styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  width: 80px;
  height: 36px;
  border-radius: 0 8px 8px 0;
  border: none;
  border-left: 1px solid #c1c1c1;
  background-color: #F3F3F3;
  cursor: pointer;
  :hover{
    background-color: ${COLOR.baseLight};
    color: #fff;
  }
`
const StRoomListSearchInput=styled.input.attrs(props=>({
  type: props.type || "text"
}))`
  width: 600px;
  height: 38px;
  border: 1px solid ${COLOR.grayLight};
  border-radius: 8px;
  padding: 8px 10px;
`
const StRoomListSearchBox=styled.div`
  position: relative;
  margin-right: 15px;
`
const StRoomListHeader=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`

const StRoomListCenter=styled.div`
  max-width: 1500px;
  min-width: 1200px;
  border: 1px solid green;
  padding: 30px;
`
const StRoomListWrap=styled.section`
  display: flex;
  background-color: #fff;
`

export default RoomList;
