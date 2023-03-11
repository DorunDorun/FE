import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router";
import { nanoid } from "nanoid";

//컴포넌트
import RoomItem from "../RoomItem";
import { COLOR } from "../style/style";

const RoomListBox = ({
  message,
  scrollBoxRef,
  roomData,
  isNoRooms,
  pageCountReset,
  isRoomEnd,
  isLoading,
  target,
}) => {


  console.log("룸 리스트 박스");

  return (
    <StRoomListBox>
      {/*방 목록 위 타이틀*/}
      <StRoomListBoxInfo>
        <StRoomListBoxInfoH2>{message.welcome}</StRoomListBoxInfoH2>
      </StRoomListBoxInfo>

      {/*방 목록*/}
      <StRoomListBoxRooms>
        <StRoomListBoxRoomsContainer ref={scrollBoxRef}>
          {/*방 목록 없을 떄 문구*/}
          {roomData.length === 0 && isNoRooms 
            && <StNoRooms>{message.noRooms}</StNoRooms>
          }

          {/*방 목록 컴포넌트*/}
          {roomData.map((room) => {
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
                pageCountReset={pageCountReset}
              />
            );
          })}

          {/*방 목록 옵저버 타겟 - 불러올 목록 남아있고, 로딩 중이 아닐 때만 활성화*/}
          {roomData.length > 0 && !isRoomEnd && !isLoading && (
            <StScrollTarget ref={target}>
              <StScrollTargetLoading></StScrollTargetLoading>
            </StScrollTarget>
          )}
        </StRoomListBoxRoomsContainer>
      </StRoomListBoxRooms>
    </StRoomListBox>
  );
};

const StScrollTargetLoading = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #fff;
  border-bottom-color: ${COLOR.baseDefault};
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: rotation 1s linear infinite;
  @keyframes rotation {
    //방 목록 옵저버 타겟 로딩 중 spin
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
const StScrollTarget = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StNoRooms = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  height: 300px;
  font-weight: bold;
  color: #000;

`;

const StRoomListBoxRoomsContainer = styled.div`
  overflow: hidden;
  height: 71vh;
  overflow-y: auto;
  text-align: left;
  ::-webkit-scrollbar {
    //스크롤바 비활성화
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
const StRoomListBox = styled.div`
  margin-top: 30px;
`;

export default React.memo(RoomListBox);
