/*기본*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

//컴포넌트
import ButtonDefault from "../Components/ButtonDefault";
import RadioGroup from "../Components/RadioGroup";
import RadioGroupImage from "../Components/RadioGroupImage";
import InputWithLabelDefault from "../Components/InputWithLabelDefault";
import { categoryList } from "../Components/lists/CategoryList"; //카테고리 목록
import LinkPrev from '../Components/apis/LinkPrev';

//유효성 검사
import { regExpTitle, regExpSubTitle, regExpPassword,} from "../Components/apis/RegExp";

//css
import { COLOR } from "../Components/style/style";


//스토어 방 생성
import useStoreRoomCreate from "../zustand/storeRoomCreate";
//스토어 방장 상태
import useStoreRoomMasterCheck from "../zustand/stoerRoomMasterCheck";
//sse 실시간 감지
import useStoreSseListener from '../zustand/storeSseListener';

function RoomCreate() {

  const navigate = useNavigate();

  //방 만들기 정보
  const [roomInfo, setRoomInfo] = useState({
    roomTitle: "",
    roomSubTitle: "",
    roomCategory: "",
    roomStatus: true,
    roomPassword: "",
  });

  const { roomTitle, roomSubTitle, roomCategory, roomPassword, roomStatus, roomJoinButtonImage} = roomInfo;

  //비밀번호 인풋 활성화
  const [isDisabled, setIsDisabled] = useState(true);

  //유효성 검사
  const [isRegExp, setIsRegExp] = useState({
    title: false,
    subTitle: false,
    password: true,
  });

  //유효성 검사 상태메세지
  const [validMessage, setValidMessage] = useState({
    title: "",
    subTitle: "",
    password: "",
  });

  //메세지 양식
  const [messageForm, setMessageForm] = useState({
    title: "5~20자 이내로 입력하세요",
    subTitle: "5~20자 이내로 입력하세요",
    password: "영어, 숫자/ 5~10자 이내",
  });

  //카테고리 선택
  const onChangeRadioCategory = (value) => {
    setRoomInfo({ ...roomInfo, roomCategory: value });
  };


  useEffect(() => {
    console.log("roomCategory : ", roomCategory);
  }, [roomCategory]);


  //방 공개 비공개
  const onChangeRoomStatus = (roomStatusValue) => {
    setRoomInfo({ ...roomInfo, roomStatus: roomStatusValue });
    setIsDisabled(roomStatusValue);
  };

  //방 공개 비공개
  useEffect(() => {
    console.log("roomStatus 변경 ! : ", roomStatus);
    console.log("isDisabled 는 ", isDisabled);
    if (roomStatus) {
      console.log("roomStatus 는 true ", roomStatus);
      setIsRegExp({ ...isRegExp, password: true });
      setRoomInfo({ ...roomInfo, roomPassword: "" });
      setValidMessage({ ...validMessage, password: "" });
    }
  }, [roomStatus]);

  //방 입장 버튼 이미지
  const onChangeRoomJoinButtonImage = (value) => {
    setRoomInfo({ ...roomInfo, roomJoinButtonImage: value });
  };

  useEffect(() => {
    console.log("roomJoinButtonImage : ", roomJoinButtonImage);
  }, [roomJoinButtonImage]);

  /*유효성 검사*/

  //유효성 검사 방 제목
  const onBlurRegExpTitle = (e) => {
    if (!regExpTitle(e.target.value)) {
      setIsRegExp({ ...isRegExp, title: false });
      return setValidMessage({ ...validMessage, title: messageForm.title });
    } else {
      setIsRegExp({ ...isRegExp, title: true });
      return setValidMessage({ ...validMessage, title: "" });
    }
  };

  //유효성 검사 방 내용
  const onBlurRegExpSubTitle = (e) => {
    if (!regExpSubTitle(e.target.value)) {
      setIsRegExp({ ...isRegExp, subTitle: false });
      return setValidMessage({
        ...validMessage,
        subTitle: messageForm.subTitle,
      });
    } else {
      setIsRegExp({ ...isRegExp, subTitle: true });
      return setValidMessage({ ...validMessage, subTitle: "" });
    }
  };

  //유효성 검사 비밀번호
  const onBlurRegExpPassword = (e) => {
    if (!regExpPassword(e.target.value)) {
      setIsRegExp({ ...isRegExp, password: false });
      return setValidMessage({
        ...validMessage,
        password: messageForm.password,
      });
    } else {
      setIsRegExp({ ...isRegExp, password: true });
      return setValidMessage({ ...validMessage, password: "" });
    }
  };

  //방 생성 데이터
  const { data } = useStoreRoomCreate((state) => state.data);
  const loading = useStoreRoomCreate((state) => state.loading);
  const hasErrors = useStoreRoomCreate((state) => state.hasErrors);
  const fetchData = useStoreRoomCreate((state) => state.fetch);


  //sse 실시간 감지
  const sseListener = useStoreSseListener((state) => state.sseListener);



  //방 생성
  const roomCreate = (e) => {
    e.preventDefault();
    //유효성 검사
    const regexpnew = {
      title: isRegExp.title,
      subTitle: isRegExp.subTitle,
      password: isRegExp.password,
    };

    console.log("regexpnew ", regexpnew);

    if (!isRegExp.title || !isRegExp.subTitle || !isRegExp.password) {
      console.log("유효성 검사 실패");
      return false;
    } else {
      console.log("유효성 검사 통과");
      
      const newRoomCreateOpen = { //공개 방 정보
        status: roomStatus,
        title: roomTitle,
        subtitle: roomSubTitle,
        category: roomCategory,
      };

      const newRoomCreatePrivate = { //비공개 방 정보
        status: roomStatus,
        title: roomTitle,
        subtitle: roomSubTitle,
        category: roomCategory,
        password: roomPassword,
      };

      //공개방, 비공개방 전달 정보 다름
      const newRoomCreatObj = roomStatus
        ? newRoomCreateOpen
        : newRoomCreatePrivate;
      console.log("✨ newRoomCreatObj : ", newRoomCreatObj);

      fetchData(newRoomCreatObj).then((res) => {
        console.log("fetchData 후 응답 값 : ", res);
        const { title, masterName, sessionId, status } = res.data.data;

        if (title && masterName && sessionId) {
          if (status) {
            //공개 방
            localStorage.setItem("title", title);
            localStorage.setItem("sessionId", sessionId);
            localStorage.setItem("status", status);
          } else {
            //비공개 방
            localStorage.setItem("title", title);
            localStorage.setItem("sessionId", sessionId);
            localStorage.setItem("status", status);
            localStorage.setItem("password", roomPassword);
          }
        }
        sseListener()
        return navigate(`/roomWaiting`);

      });
    }
  };


  if (loading) {
    return <p>Loading</p>;
  }
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러! 다시 시도해주세요!</p>;
  }

  return (
    <StRoomCreateWrap>
      <StRoomCreateContainer>

        <StRoomCreateTitleBox>

           {/*뒤로가기*/}
          <LinkPrev title="방 목록으로 돌아가기"/>

           {/*방 생성 타이틀*/}
          <StRoomCreateTitle className="roomCreateTitle">
            라이브 룸 만들기
          </StRoomCreateTitle>

        </StRoomCreateTitleBox>

        <StRoomCreateForm onSubmit={(e) => {roomCreate(e);}}>

          {/* 방 제목 */}
          <StRoomCreateInputDiv>
            <InputWithLabelDefault
              width="85%"
              labelWidth="15%"
              positionLeft="15%"
              height="44px"
              inputType="text"
              inputId="roomTitleInput"
              inputValue={roomTitle}
              onChange={(e) => {
                setRoomInfo({ ...roomInfo, roomTitle: e.target.value });
              }}
              onBlur={onBlurRegExpTitle}
              validMessage={validMessage.title}
              labelText="이름"
              inputPaceholder={messageForm.title}
              maxLength={20}
            />
          </StRoomCreateInputDiv>


          {/* 공개 여부 */}
          <StRoomCreateInputDivFlex margin="0 0 16px 0">
            <StSpanNormal>
              공개 설정
            </StSpanNormal>
            <StStatusInputBox>
              <StInputItem>
                <StInputDefault
                  id="isOpenRoom"
                  type="radio"
                  name="roomStatus"
                  required
                  defaultChecked
                  onChange={(e) => {
                    onChangeRoomStatus(true);
                  }}
                />
                <StLabel htmlFor="isOpenRoom">공개</StLabel>
              </StInputItem>
              <StInputItem>
            
                <StInputDefault
                  id="isPrivateRoom"
                  type="radio"
                  name="roomStatus"
                  onChange={(e) => {
                    onChangeRoomStatus(false);
                  }}
                />
                <StLabel htmlFor="isPrivateRoom">비공개</StLabel>

              </StInputItem>

            </StStatusInputBox>

          </StRoomCreateInputDivFlex>

          {/*방 비공개 비밀번호 인풋*/}
          <StRoomCreateInputDivFlex>
            <StPasswordInputBox display={isDisabled ? "none" : "block"}>
                <InputWithLabelDefault
                  width="100%"
                  positionLeft="0"
                  height="44px"
                  inputType="text"
                  inputId="roomPasswordInput"
                  inputValue={roomPassword}
                  onChange={(e) =>
                    setRoomInfo({ ...roomInfo, roomPassword: e.target.value })
                  }
                  onBlur={onBlurRegExpPassword}
                  validMessage={validMessage.password}
                  labelText=""
                  inputPaceholder={messageForm.password}
                  disabled={isDisabled}
                  maxLength={10}
                />
              </StPasswordInputBox>

          </StRoomCreateInputDivFlex>

          {/* 카테고리 */}
          <StRoomCreateInputDiv>
            <StRoomCreateInputDivCategory>
              <StSpanNormalCategoryBox>
                <StSpanNormal>카테고리</StSpanNormal>
              </StSpanNormalCategoryBox>
              <StCategoryBox>
                <StCategoryBoxContainer>
                  {categoryList.map((category) => {
                    return (
                      <RadioGroup
                        key={nanoid()}
                        categoryName={category.categoryName}
                        checked={category.categoryValue === roomCategory}
                        value={category.categoryValue}
                        imageUrl={category.categoryImage}
                        room="roomCreate"
                        onChange={(e) => {
                          onChangeRadioCategory(e.target.value);
                        }}
                      />
                    );
                  })}
                </StCategoryBoxContainer>
              </StCategoryBox>
            </StRoomCreateInputDivCategory>
          </StRoomCreateInputDiv>

            {/* 방 내용 */}
          <StRoomCreateInputDiv>
            <InputWithLabelDefault
              width="85%"
              labelWidth="15%"
              positionLeft="15%"
              height="44px"
              inputType="text"
              inputId="roomSubTitleInput"
              inputValue={roomSubTitle}
              onChange={(e) => {
                setRoomInfo({ ...roomInfo, roomSubTitle: e.target.value });
              }}
              onBlur={onBlurRegExpSubTitle}
              validMessage={validMessage.subTitle}
              labelText="소개글"
              inputPaceholder={messageForm.subTitle}
              maxLength={20}
            />
          </StRoomCreateInputDiv>

          {/* 만들기 버튼 */}
          <StRoomCreateButtonBox>
            <ButtonDefault
              width="100%"
              height="56px"
              bgColor={COLOR.grayLight}
              fontSize="20px"
              fontColor="#fff"
              hoverBgColor={COLOR.baseDefault}
            >
              만들기
            </ButtonDefault>
          </StRoomCreateButtonBox>
        </StRoomCreateForm>
      </StRoomCreateContainer>
    </StRoomCreateWrap>
  );
}




const StRoomCreateButtonBox = styled.div`
  margin-top: 50px;
`;
const StInputItem = styled.div`
  display: flex;
  align-items: center;
  :nth-child(2) {
    flex-grow: 2;
  }
`;
const StStatusInputBox = styled.div`
  display: flex;
  width: 100%;
  column-gap: 20px;
`;

const StSpanNormal=styled.span`
  display: block;
  font-weight: bold;
  flex-basis: 15%;
  min-width: 32px;
`
const StRoomCreateInputDivFlex = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
  margin: ${(props)=>props.margin || "0 0 30px 0"};
  position: relative;
`;
const StInputDefault = styled.input.attrs((props) => ({
  type: props.type || "text",
}))``;


const StCategoryBoxContainer=styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 20px;
  row-gap: 20px;

`
const StCategoryBox = styled.div`
  width: 100%;  
  flex-basis: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px 0;
`;

const StPasswordInputBox = styled.div`
  width: 100%;
  display: ${(props) => props.display || "block"};
  margin-bottom: 5px;
`;

const StLabel = styled.label`
  display: inline-block;
  padding: 0 12px 0 4px;
  //margin-bottom: 10px;
`;

const StSpanNormalCategoryBox=styled.div`
  display: flex;
  align-items: flex-start;
  flex-basis: 15%;
  padding-top: 15px;
  span{
    flex-basis: 100%;
  }
`

const StRoomCreateInputDivCategory=styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  position: relative;
  border-top: 1px solid #dfdfdf;
  border-bottom: 1px solid #dfdfdf;
`
const StRoomCreateInputDiv = styled.div`
  margin-bottom: 40px;
  display: flex;
  align-items: center;
  position: relative;
`;
const StRoomCreateTitle = styled.h2`
  font-family: "LottriaChab";
  font-size: 30px;
  margin-bottom: 60px;
`;
const StRoomCreateTitleBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  position: relative;
`;
const StRoomCreateForm = styled.form`
  width: 100%;
`;
const StRoomCreateContainer = styled.div`
  width: 60%;
  max-width: 1100px;
  min-width: 900px;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  background-color: #fff;
  padding: 30px 200px 0;
`;
const StRoomCreateWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6e8ff;
  width: 100vw;
  min-width: 1200px;
  height: 100vh;
`;

export default RoomCreate;
