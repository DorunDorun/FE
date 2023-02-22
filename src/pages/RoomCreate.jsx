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

//css
import { COLOR } from "../Components/style/style";

//버튼 이미지
import joinRoomButtonImageList from "../Components/joinRoomButtonImagePath";

//스토어 방 생성
import useStoreRoomCreate from "../zustand/storeRoomCreate";
//스토어 방장 상태
import useStoreRoomMasterCheck from "../zustand/stoerRoomMasterCheck";

function RoomCreate() {
  const navigate = useNavigate();

  const [roomInfo, setRoomInfo] = useState({
    nickName: "user" + Math.floor(Math.random() * 1000),
    roomTitle: "",
    roomSubTitle: "",
    roomCategory: "",
    roomStatus: true,
    roomPassword: "",
    roomJoinButtonImage: joinRoomButtonImageList.image1.name,
  });

  const {
    nickName,
    roomTitle,
    roomSubTitle,
    roomCategory,
    roomPassword,
    roomStatus,
    roomJoinButtonImage,
  } = roomInfo;

  //입장 버튼 이미지
  const joinRoomButtonImages = [
    joinRoomButtonImageList.image1,
    joinRoomButtonImageList.image2,
    joinRoomButtonImageList.image3,
  ];

  //비밀번호 인풋 활성화
  const [isDisabled, setIsDisabled] = useState(true);

  //유효성 검사
  const [isRegExp, setIsRegExp] = useState({
    title: false,
    subTitle: false,
    password: true,
  });

  //상태메세지
  const [validMessage, setValidMessage] = useState({
    title: "",
    subTitle: "",
    password: "",
  });

  //메세지 양식
  const [messageForm, setMessageForm] = useState({
    title: "한글, 영어, 숫자/ 5~20자 이내",
    subTitle: "한글, 영어, 숫자/ 5~20자 이내",
    password: "비공개 비밀번호 : 영어, 숫자/ 5~10자 이내",
  });

  //카테고리 목록
  const categoryList = [
    {
      categoryName: "공부",
      categoryValue: "STUDY",
      categoryImage: joinRoomButtonImageList.image1.url,
    },
    {
      categoryName: "친목",
      categoryValue: "SOCIAL",
      categoryImage: joinRoomButtonImageList.image2.url,
    },
    {
      categoryName: "취미",
      categoryValue: "HOBBY",
      categoryImage: joinRoomButtonImageList.image3.url,
    },
    {
      categoryName: "운동",
      categoryValue: "WORKOUT",
      categoryImage: joinRoomButtonImageList.image1.url,
    },
    {
      categoryName: "직장인",
      categoryValue: "JOBS",
      categoryImage: joinRoomButtonImageList.image2.url,
    },
    {
      categoryName: "재테크",
      categoryValue: "INVESTMENT",
      categoryImage: joinRoomButtonImageList.image3.url,
    },
    {
      categoryName: "기타",
      categoryValue: "ETC",
      categoryImage: joinRoomButtonImageList.image1.url,
    },
  ];

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
  const onBlurRegExpTitle = (e) => {
    //유효성 검사 방 제목
    const regExpTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|]{5,20}$/;
    let { value } = e.target;
    if (!regExpTitle.test(value.trim())) {
      setIsRegExp({ ...isRegExp, title: false });

      return setValidMessage({ ...validMessage, title: messageForm.title });
    } else {
      setIsRegExp({ ...isRegExp, title: true });

      return setValidMessage({ ...validMessage, title: "" });
    }
  };

  const onBlurRegExpSubTitle = (e) => {
    //유효성 검사 방 내용
    const regExpSubTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|]{5,20}$/;
    let { value } = e.target;
    if (!regExpSubTitle.test(value.trim())) {
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
    console.log("비밀번호 체크 isDisabled 2 : ", isDisabled);
    const regExpPassword = /^[a-z|A-Z|0-9|" "|]{5,10}$/;
    let { value } = e.target;
    if (!regExpPassword.test(value.trim())) {
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

  //방장 상태
  const roomMasterStatus = useStoreRoomMasterCheck(
    (state) => state.roomMasterStatus
  );

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
      const newRoomCreateOpen = {
        //공개 방 정보
        status: roomStatus,
        title: roomTitle,
        subtitle: roomSubTitle,
        category: roomCategory,
        buttonImage: roomJoinButtonImage,
      };

      const newRoomCreatePrivate = {
        //비공개 방 정보
        status: roomStatus,
        title: roomTitle,
        subtitle: roomSubTitle,
        category: roomCategory,
        password: roomPassword,
        buttonImage: roomJoinButtonImage,
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
        return navigate(`/roomWaiting`);
        /*
                if(sessionId){
                    console.log(`sessionId : ${sessionId}`)
                    roomMasterStatus(true) //방장 상태 true
                    //navigate(`/room/${sessionId}`)
                }
                */
      });
    }
  };

  if (loading) {
    return <p>Loading</p>;
  }
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러</p>;
  }

  return (
    <StRoomCreateWrap>
      <StRoomCreateContainer>
        <StRoomCreateTitleBox>
          <StRoomCreateTitle className="roomCreateTitle">
            {" "}
            라이브 룸 만들기{" "}
          </StRoomCreateTitle>
        </StRoomCreateTitleBox>
        <StRoomCreateForm
          onSubmit={(e) => {
            roomCreate(e);
          }}
        >
          {/* 공개 여부 */}
          <StRoomCreateInputDivFlex>
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

                <StPasswordInputBox display={isDisabled ? "none" : "block"}>
                  <InputWithLabelDefault
                    width="100%"
                    height="30px"
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
                  />
                </StPasswordInputBox>
              </StInputItem>
            </StStatusInputBox>
          </StRoomCreateInputDivFlex>

          {/* 방 제목 */}
          <StRoomCreateInputDiv>
            <InputWithLabelDefault
              width="100%"
              height="30px"
              inputType="text"
              inputId="roomTitleInput"
              inputValue={roomTitle}
              onChange={(e) => {
                setRoomInfo({ ...roomInfo, roomTitle: e.target.value });
              }}
              onBlur={onBlurRegExpTitle}
              validMessage={validMessage.title}
              labelText="라이브룸 이름"
              inputPaceholder={messageForm.title}
            />
          </StRoomCreateInputDiv>
          {/* 방 내용 */}
          <StRoomCreateInputDiv>
            <InputWithLabelDefault
              width="100%"
              height="30px"
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
            />
          </StRoomCreateInputDiv>
          {/* 카테고리 */}
          <StRoomCreateInputDiv>
            카테고리
            <StCategoryBox>
              {categoryList.map((category) => {
                return (
                  <RadioGroup
                    key={nanoid()}
                    categoryName={category.categoryName}
                    checked={category.categoryValue === roomCategory}
                    value={category.categoryValue}
                    imageUrl={category.categoryImage}
                    onChange={(e) => {
                      onChangeRadioCategory(e.target.value);
                    }}
                  />
                );
              })}
            </StCategoryBox>
          </StRoomCreateInputDiv>

          {/* 버튼 이미지 
                    <StRoomCreateInputDiv>
                        입장 버튼 이미지 : 
                        {joinRoomButtonImages.map((image)=>{
                            return(
                                <RadioGroupImage 
                                key={nanoid()}
                                imageUrl={image.url}
                                imageName={image.name}
                                checked={image.name === roomJoinButtonImage}
                                onChange={(e)=>{onChangeRoomJoinButtonImage(e.target.value)}}
                                />
                            )
                        })}
                    </StRoomCreateInputDiv>
                    */}
          <StRoomCreateButtonBox>
            <ButtonDefault
              width="100%"
              height="40px"
              bgColor={COLOR.baseLight}
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
const StJoinRoomButtonImage = styled.img``;
const StInputItem = styled.div`
  :nth-child(2) {
    flex-grow: 2;
  }
`;
const StStatusInputBox = styled.div`
  display: flex;
  width: 100%;
  column-gap: 20px;
`;
const StSpanDiv = styled.span`
  display: block;
`;
const StRoomCreateInputDivFlex = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;
const StInputDefault = styled.input.attrs((props) => ({
  type: props.type || "text",
}))``;

const StCategoryBox = styled.div`
  margin-top: 20px;
  display: flex;
  column-gap: 20px;
  justify-content: center;
  align-items: center;
`;

const StPasswordInputBox = styled.div`
  display: ${(props) => props.display || "block"};
`;

const StLabel = styled.label`
  display: inline-block;
  padding: 0 12px 0 4px;
  margin-bottom: 10px;
`;
const StRoomCreateInputDiv = styled.div`
  margin-bottom: 30px;
`;
const StRoomCreateTitle = styled.h2`
  font-family: "LottriaChab";
  font-size: 30px;
  margin-bottom: 80px;
`;
const StRoomCreateTitleBox = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;
const StRoomCreateForm = styled.form`
  width: 100%;
`;
const StRoomCreateContainer = styled.div`
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  padding: 0 200px;
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
