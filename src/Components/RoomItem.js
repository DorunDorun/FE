import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FcLock } from "react-icons/fc";
import { useNavigate } from "react-router-dom";


//컴포넌트
import ButtonDefault from "./ButtonDefault";
import CategoryImageList from "./lists/CategoryImageList";

//css
import { COLOR } from "../Components/style/style";

const RoomItem = ({
  sessionId,
  category,
  title,
  subTitle,
  status,
  password,
  userCount,
  pageCountReset,
  
}) => {

  const navigate = useNavigate();
  
  //방 입장하기

  const onClickRoomJoin = (title, sessionId, status) => {

    if(userCount === 6) return alert("방이 꽉 찼네요! 더 이상 입장할 수 없습니다!")

    console.log("🙋‍♂️🙋‍♂️ title ", title)
    console.log("🙋‍♂️🙋‍♂️ sessionId ", sessionId)
    console.log("🙋‍♂️🙋‍♂️ roomStatus ", status)

    if (!status) { //비공개 상태에 따른 비밀번호 입력 인풋 컨트롤
      setIsPasswordInputHide(status)

    }else{ //공개 방 입장
      const info = {
        title: title,
        sessionId: sessionId,
        status: status,
      }

      console.log(" 방 목록 info : ", info);

      localStorage.setItem("title", title);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("status", status);
      pageCountReset();

      return navigate(`/roomWaiting`);
    }
  };


  //password 입력 상태
  const [isPasswordInputHide, setIsPasswordInputHide] = useState(true);
  //password
  const [roomPasswordInput, setRoomPasswordInput] = useState("");
  //참가자 인원 상태
  const [userStatus, setUserStatus] = useState(COLOR.greenDefault);
  const maxUserCount = 6;

  //방 참여 인원별 상태 circle 컨트롤
  useEffect(() => {
    if (userCount > 1 && userCount < maxUserCount) {
      return setUserStatus(COLOR.baseDefault);
    } else if (userCount === maxUserCount) {
      return setUserStatus(COLOR.redDefault);
    } else {
      return setUserStatus(COLOR.greenDefault);
    }
  }, []);

  //비밀번호 창 닫기 버튼 클릭
  const onClickClosePasswordInput = () => {
    setIsPasswordInputHide(true);
  };

  //비밀번호 창 확인 버튼 클릭
  const onClickSubmitPassword = () => {
    if (roomPasswordInput === password) {
      //방 비밀번호, 입력 번호 일치
      localStorage.setItem("title", title);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("status", status);
      localStorage.setItem("password", password);
      pageCountReset()
      return navigate(`/roomWaiting`);
    } else {
      return alert("입장 비밀번호가 다릅니다!");
    }
  };

  //카테고리 text 영어로 변환된 값
  const [categoryEN, setCategoryEN] = useState("");

  //카테고리 이미지
  const [backgroundImage, setBackgroundImage] = useState(undefined);

  useEffect(() => {
    /*카테고리 응답값 영어로 변환
    현재 한글로 응답 오는 중
    카테고리 배경 이미지 가져오기 위한 코드
    */
    switch (category) {
      case "공부":
        setCategoryEN("STUDY");
        break;
      case "친목":
        setCategoryEN("SOCIAL");
        break;
      case "취미":
        setCategoryEN("HOBBY");
        break;
      case "운동":
        setCategoryEN("WORKOUT");
        break;
      case "직장인":
        setCategoryEN("JOBS");
        break;
      case "재테크":
        setCategoryEN("INVESTMENT");
        break;
      case "기타":
        setCategoryEN("ETC");
        break;
      default:
        setCategoryEN("");
        break;
    }
  }, []);

  //배경 이미지 가져오기
  useEffect(() => {
    setBackgroundImage(CategoryImageList[categoryEN]?.backgroundImageUrl);
  }, [categoryEN]);



  return (
    <StRoomItem>
      <StRoomItemMainInfo>
        {/*방 카테고리 이미지 영역*/}
        <StRoomItemMainInfoCategoryBox
          backgroundImage={backgroundImage}
          title={category}
        ></StRoomItemMainInfoCategoryBox>

        <StRoomItemMainInfoRoomInfo>
          {/*방 제목*/}
          <StRoomItemMainInfoRoomInfoTitleBox>
            <StRoomItemMainInfoRoomInfoTitle title={title}>
              {title}
            </StRoomItemMainInfoRoomInfoTitle>
          </StRoomItemMainInfoRoomInfoTitleBox>

          {/*방 소개글*/}
          <StRoomItemMainInfoRoomInfoSubTitleBox>
            <StRoomItemMainInfoRoomInfoSubTitle title={subTitle}>
              {subTitle}
            </StRoomItemMainInfoRoomInfoSubTitle>
          </StRoomItemMainInfoRoomInfoSubTitleBox>

          {/*입장 버튼*/}
          <StRoomItemMainInfoButtonBox>
            <StRoomItemMainInfoJoinButtonBox>
              <StRoomItemMainInfoJoinButton onClick={()=>onClickRoomJoin(title, sessionId, status)}>
                입장
              </StRoomItemMainInfoJoinButton>
            </StRoomItemMainInfoJoinButtonBox>
          </StRoomItemMainInfoButtonBox>

          {/*비밀번호 인풋*/}
          <StRoomItemMainInfoRoomInfoLockBox
            justifyContent={isPasswordInputHide ? "flex-start" : "center"}
          >
            {!isPasswordInputHide && (
              <>
                <StInputPassword
                  placeholder="password"
                  value={roomPasswordInput}
                  onChange={(e) => setRoomPasswordInput(e.target.value)}
                  autoFocus
                />
                <ButtonDefault
                  fontSize="10px"
                  width="45px"
                  height="36px"
                  borderRadius="5px"
                  hoverBgColor={COLOR.grayLight}
                  onClick={onClickClosePasswordInput}
                >
                  취소
                </ButtonDefault>
                <ButtonDefault
                  fontSize="10px"
                  width="45px"
                  height="36px"
                  borderRadius="5px"
                  fontColor="#fff"
                  bgColor={COLOR.baseLight}
                  hoverBgColor={COLOR.baseDefault}
                  onClick={onClickSubmitPassword}
                >
                  확인
                </ButtonDefault>
              </>
            )}
          </StRoomItemMainInfoRoomInfoLockBox>
        </StRoomItemMainInfoRoomInfo>
      </StRoomItemMainInfo>

      {/*방 목록 하단 정보*/}
      <StRoomItemPeopleConutBox>
        {/*참가자 정보*/}
        <StCountBoxItem>
          <StRoomItemPeopleConutBoxStatus
            status={userStatus}
          ></StRoomItemPeopleConutBoxStatus>
          {/* 
            <StRoomItemPeopleConutBoxTitle>참가자</StRoomItemPeopleConutBoxTitle>
          */}
          <StRoomItemPeopleConutBoxCount>
            {/*<StRoomItemUserCount status={userStatus}>*/}
            <StRoomItemUserCount>{userCount}</StRoomItemUserCount>명 참여중
          </StRoomItemPeopleConutBoxCount>
        </StCountBoxItem>

        {/*자물쇠 아이콘*/}
        <StRoomItemMainInfoRoomInfoLock title="비공개 방">
          {!status && <FcLock />}
        </StRoomItemMainInfoRoomInfoLock>
      </StRoomItemPeopleConutBox>
    </StRoomItem>
  );
};

const StCountBoxItem = styled.div`
  display: flex;
  align-items: flex-start;
`;
const StRoomItemUserCount = styled.span`
  margin: 0 4px 0 6px;
  color: ${(props) => props.status};
`;
const StRoomItemPeopleConutBoxCount = styled.span`
  font-size: 14px;
  font-weight: bold;
`;
const StRoomItemPeopleConutBoxTitle = styled.span`
  font-size: 14px;
  font-weight: bold;
  margin: 0 8px;
`;
const StRoomItemPeopleConutBoxStatus = styled.span`
  display: inline-block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${(props) => props.status};
`;
const StRoomItemPeopleConutBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: ${COLOR.pinkLight2};
  border-radius: 0 0 10px 10px;
  position: relative;
`;
const StRoomItemMainInfoRoomInfoSubTitle = styled.span`
  display: inline-block;
  width: 100%;
  font-size: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  height: 100%;
`;
const StRoomItemMainInfoRoomInfoSubTitleBox = styled.div`
  width: 100%;
  height: 42px;
  line-height: 1.3;
`;
const StRoomItemMainInfoRoomInfoTitle = styled.span`
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  width: 100%;
  height: 28px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
const StRoomItemMainInfoRoomInfoTitleBox = styled.div`
  width: 100%;
`;
const StInputPassword = styled.input.attrs({
  type: "password",
})`
  flex-basis: 55%;
  min-width: 55%;
  height: 36px;
  margin: 0;
  padding: 2px 5px;
  border: 1px solid #c1c1c1;
  border-radius: 4px;
`;
const StRoomItemMainInfoRoomInfoLock = styled.i`
  display: flex;
  align-items: center;
  font-size: 25px;
  position: absolute;
  bottom: 23%;
  right: 15px;
  svg path:nth-child(2) {
    fill: ${COLOR.grayLight};
  }
`;
const StRoomItemMainInfoRoomInfoLockBox = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  align-items: center;
  flex-direction: row;
  width: 100%;
  column-gap: 5px;
  position: absolute;
  bottom: 10px;
  left: 0;
`;
const StRoomItemMainInfoRoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 14px;
  padding: 10px 20px 55px;
`;
const StRoomItemMainInfoJoinButton = styled.button`
  width: 100%;
  height: 36px;
  background-color: ${COLOR.baseLight};
  border: none;
  color: #fff;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseDefault};
    color: #fff;
  }
`;
const StRoomItemMainInfoJoinButtonBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
const StRoomItemMainInfoButtonBox = styled.div``;
const StRoomItemMainInfoCategory = styled.span`
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  padding: 6px 16px;
  border-radius: 14px;
  font-size: 14px;
`;
const StRoomItemMainInfoCategoryBox = styled.div`
  display: flex;
  width: 100%;
  height: 108px;
  padding: 0;
  background-image: url(${(props) => props.backgroundImage});
  background-position: top;
  background-repeat: no-repeat;
  background-size: 101% auto;
  border-radius: 6px 6px 0 0;
`;
const StRoomItemMainInfo = styled.div`
  border-bottom: 1px solid #fff;
  border-radius: 10px;
  position: relative;
  background-color: #fff;
`;
const StRoomItem = styled.div`
  width: calc(25% - 40px);
  max-width: 360px;
  max-height: 374px;

  display: inline-block;
  text-align: left;
  border: 4px solid ${COLOR.pinkLight2};
  border-radius: 10px;
  margin: 20px;
  font-size: 16px;
  background-color: ${COLOR.pinkLight2};
  :hover {
    border: 4px solid ${COLOR.baseDefault};
  }
`;

export default React.memo(RoomItem)
