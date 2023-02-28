//기본
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

//컴포넌트, 스타일, 아이콘
import ButtonDefault from "../Components/ButtonDefault";
import { GrSort } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";
import { BsFillGridFill } from "react-icons/bs";
import RoomItem from "../Components/RoomItem";
import Wait from "../Components/Wait";
import ListSideBar from "../Components/sidebar/ListSideBar";

//이미지
import { roomListBack } from "../Components/ImagesGlobal";

//css
import { COLOR } from "../Components/style/style";

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

  //메세지
  const message = {
    welcome: "두런두런에 오신걸 환영합니다!",
  };

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

  const onClickSearch = () => {
    alert("서비스 준비 중인 기능입니다.");
  };

  const onClickCategorySearch = () => {
    alert("서비스 준비 중인 기능입니다.");
  };

  const onClickRoomJoin = (title, sessionId, status) => { //방 입장
    const info = {
      title: title,
      sessionId: sessionId,
      status: status,
    };
    console.log(" 방 목록 info : ", info);
    if (status) { //공개 방 입장
      localStorage.setItem("title", title);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("status", status);
      return navigate(`/roomWaiting`);
    }
  };

  //방 만들기 클릭
  const onClickRoomCreate = () => {
    navigate("/roomCreate");
  };

  if (loading) {
    return <Wait />;
  }

  if (hasErrors) {
    alert("다시 시도해주세요!")
    return navigate("/login")
  }
  /*
  if (roomList.length === 0) {
    return <StNoRooms>채팅방이 존재하지 않습니다!</StNoRooms>;
  }
  */

  return (
    <StRoomListWrap>
      <StRoomListSideNav>
        <ListSideBar />
      </StRoomListSideNav>

      <StRoomListCenter>
        <StRoomListTopContainer>
          <StRoomListHeader>
            <StRoomListSearchBox>
              <StRoomListSearchInput placeholder="관심있는 키워드를 검색해보세요!" />
              <StRoomListSearchButton onClick={onClickSearch}>
                <IoIosSearch className="iconSearch" />
              </StRoomListSearchButton>
            </StRoomListSearchBox>
            {/* <StRoomCreateButton >라이브룸 만들기</StRoomCreateButton> */}
            <ButtonDefault
              width="17%"
              height="40px"
              bgColor={COLOR.baseDefault}
              fontColor="#fff"
              hoverBgColor={COLOR.greenLight}
              hoverFontColor="#000"
              onClick={onClickRoomCreate}
            >
              라이브룸 만들기
            </ButtonDefault>
          </StRoomListHeader>

          <StRoomListCategorySlide>
            <ButtonDefault
              onClick={onClickCategorySearch}
              padding="10px 0"
              height="40px"
              lineHeight="20px"
              borderRadius="20px"
              hoverBgColor={COLOR.baseLight}
              hoverFontColor="#fff"
            >
              카테고리1
            </ButtonDefault>
            <ButtonDefault
              onClick={onClickCategorySearch}
              padding="10px 0"
              height="40px"
              lineHeight="20px"
              borderRadius="20px"
              hoverBgColor={COLOR.baseLight}
              hoverFontColor="#fff"
            >
              카테고리2
            </ButtonDefault>
            <ButtonDefault
              onClick={onClickCategorySearch}
              padding="10px 0"
              height="40px"
              lineHeight="20px"
              borderRadius="20px"
              hoverBgColor={COLOR.baseLight}
              hoverFontColor="#fff"
            >
              카테고리3
            </ButtonDefault>
          </StRoomListCategorySlide>
        </StRoomListTopContainer>

        <StRoomListBox>
          <StRoomListBoxInfo>
            <StRoomListBoxInfoH2>{message.welcome}</StRoomListBoxInfoH2>
        
          </StRoomListBoxInfo>

          <StRoomListBoxRooms>
            <StRoomListBoxRoomsContainer>
              {roomList.length === 0 && (
                <StNoRooms>두런두런의 첫 방을 만들어 보세요!</StNoRooms>
              )}
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
                    backgroundImage={roomListBack.study.url}
                    onClick={() => {
                      onClickRoomJoin(
                        room.title,
                        room.sessionId,
                        room.status,
                        room.password
                      );
                    }}
                  />
                );
              })}
            </StRoomListBoxRoomsContainer>
          </StRoomListBoxRooms>
        </StRoomListBox>
      </StRoomListCenter>
    </StRoomListWrap>
  );
};

const StNoRooms = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
`;

const StRoomListSideNav = styled.div`
  width: 300px;
  height: 100vh;
`;

const StRoomListBoxRoomsContainer = styled.div`
  overflow: hidden;
  height: 71vh;
  overflow-y: auto;
  text-align: left;
  ::-webkit-scrollbar {
    /* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
    display: none;
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;
const StRoomListBoxRooms = styled.div`
  text-align: center;
`;

const StRoomListBoxInfoH2 = styled.h2`
  font-family: "LottriaChab";
  font-size: 30px;
  padding-left: 10px;
`;
const StRoomListBoxInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;
const StRoomListBox = styled.div``;
const StRoomListCategorySlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 10px;
  margin-bottom: 36px;
`;
const StRoomCreateButton = styled.button``;
const StRoomListSearchButton = styled.button`
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
  background-color: #f3f3f3;
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseLight};
    color: #fff;
  }
`;
const StRoomListSearchInput = styled.input.attrs((props) => ({
  type: props.type || "text",
}))`
  width: 600px;
  height: 38px;
  border: 1px solid ${COLOR.grayLight};
  border-radius: 8px;
  padding: 8px 10px;
`;
const StRoomListSearchBox = styled.div`
  position: relative;
  margin-right: 15px;
`;
const StRoomListHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const StRoomListTopContainer = styled.div``;

const StRoomListCenter = styled.div`
  width: 100%;
  display: block;
  border-left: 1px solid ${COLOR.grayLight2};
  padding: 36px 85px 36px 36px;
  margin: 0;
  font-size: 0;
`;
const StRoomListWrap = styled.section`
  display: flex;
  justify-content: center;
  background-color: #fff;
  width: 1800px;
`
export default RoomList;
