import React from "react";
import styled from "styled-components";
import { COLOR } from "../style/style";
import { useNavigate } from "react-router";

import ButtonDefault from "../ButtonDefault";

import { IoIosSearch } from "react-icons/io";

const RoomListHeaderSearch = ({
  onSubmitGetRoomSerachList,
  searchInputRef,
  searchValue,
  onChangeSearchValue,
  pageCountReset,
}) => {
  const navigate = useNavigate();

  //방 만들기 클릭
  const onClickRoomCreate = () => {
    pageCountReset();

    navigate("/roomCreate");
  };

  return (
    <StRoomListHeader>
      {/*검색*/}
      <StRoomListSearchBox onSubmit={(e) => onSubmitGetRoomSerachList(e)}>
        <StRoomListSearchInput
          ref={searchInputRef}
          value={searchValue}
          onChange={(e) => onChangeSearchValue(e)}
          placeholder="관심있는 키워드를 검색해보세요!"
          maxLength={20}
        />
        <StRoomListSearchButton>
          <IoIosSearch className="iconSearch" />
        </StRoomListSearchButton>
      </StRoomListSearchBox>
      <ButtonDefault
        width="auto"
        height="auto"
        padding="12px 44px"
        bgColor={COLOR.baseDefault}
        fontColor="#fff"
        hoverBgColor={COLOR.greenDefault}
        hoverFontColor="#000"
        onClick={onClickRoomCreate}
        boxShadow="0px 3px 4px #8600F01A"
        fontFamily="Pretendard"
        fontWeight="normal"
      >
        라이브룸 만들기
      </ButtonDefault>
    </StRoomListHeader>
  );
};

const StRoomListSearchButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  width: 80px;
  height: 43px;
  border-radius: 0 8px 8px 0;
  border: none;
  border-left: 1px solid #c1c1c1;
  background-color: #f3f3f3;
  color: #8b8b8b;
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
  height: 45px;
  border: 1px solid ${COLOR.grayLight};
  border-radius: 8px;
  padding: 8px 85px 10px 10px;
  ::placeholder {
    font-size: 16px;
    font-family: "Pretendard";
  }
`;
const StRoomListSearchBox = styled.form`
  position: relative;
  margin-right: 15px;
`;
const StRoomListHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
`;

export default RoomListHeaderSearch;
