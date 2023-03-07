//기본
import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";

//컴포넌트, 스타일
import ButtonDefault from "../Components/ButtonDefault";
import RoomItem from "../Components/RoomItem";
import Wait from "../Components/Wait";
import ListSideBar from "../Components/sidebar/ListSideBar";
import { categoryList } from "../Components/lists/CategoryList";
import { regExpSearch } from "../Components/apis/RegExp";

//아이콘
import { GrSort } from "react-icons/gr";
import { IoIosSearch } from "react-icons/io";
import { BsFillGridFill } from "react-icons/bs";
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

//이미지
import CategoryImageList from "../Components/lists/CategoryImageList";

//css
import { COLOR } from "../Components/style/style";

//스토어 방 목록
import useStoreRoomList from "../zustand/storeRoomList";

const RoomList = () => {
  const navigate = useNavigate();

  //방 목록 유무 판단 - 방 목록 없을 때 메세지 컨트롤
  const [isNoRooms, setIsNoRooms] = useState(false);

  //방 목록 데이터
  const fetchGetRoomList = useStoreRoomList((state) => state.fetchGetRoomList);
  const fetchGetRoomSearchList = useStoreRoomList(
    (state) => state.fetchGetRoomSearchList
  );
  const data = useStoreRoomList((state) => state.data);
  const loading = useStoreRoomList((state) => state.loading);
  const hasErrors = useStoreRoomList((state) => state.hasErrors);
  const roomList = useStoreRoomList((state) => state.roomList);

  //검색
  const [searchValue, setSearchValue] = useState(""); //검색 input 값
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue);
  const [isSerachStatus, setIsSerachStatus] = useState(false);
  const scrollBoxRef = useRef(); //검색 후 scroll top을 위한 target 설정
  const searchInputRef = useRef();

  //room list 모드
  const listMode = {
    all: "all", //전체
    search: "search", //검색
    category: "category", //카테고리
    history: "history", //히스토리
  };
  const [roomListMode, setRoomListMode] = useState(listMode.all);

  //카테고리
  const categoryLists = categoryList;
  const fetchGetRoomCategoryList = useStoreRoomList(
    (state) => state.fetchGetRoomCategoryList
  );
  const [prevCategoryValue, setPrevCategoryValue] = useState("");
  const [isCategorySearch, setIsCategorySearch] = useState(false);

  //메세지
  const message = {
    welcome: "두런두런에 오신걸 환영합니다!",
    noRooms: "두런두런의 첫 방을 만들어 보세요!",
  };

  //무한스크롤
  const [pageCount, setPageCount] = useState(1); //페이지 카운터
  const [isLoading, setIsLoading] = useState(false); //observer target el 컨트롤
  const [roomData, setRoomData] = useState([]); //방 목록 추가
  const [isRoomEnd, setIsRoomEnd] = useState(false); //마지막 목록 체크

  const pageCountReset=()=>{
    console.log("👋 pageCountReset!!!")
    setPageCount(1)
  }

  //무한 스크롤 옵션
  const [target, inView] = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 0, //옵저버 target element 활성화 view 퍼센트 , 0 : 보이자마자 , 1 : 모두 보일 때
  });

  //카테고리 슬라이더
  const categorySliderBoxRef = useRef();
  const categorySliderBox = categorySliderBoxRef.current;
  const handleNextButtonClick = (nextType) => {
    const slideWidth = 300;
    if (!categorySliderBox) return false;
    if (nextType === "prev") {
      categorySliderBox.scrollTo({
        left: categorySliderBox.scrollLeft - slideWidth,
        behavior: "smooth",
      });
    } else {
      // nextType : next
      categorySliderBox.scrollTo({
        left: categorySliderBox.scrollLeft + slideWidth,
        behavior: "smooth",
      });
    }
  };

  //방 목록 불러오기 api
  const getRoomList = async () => {
    setRoomListMode(listMode.all); //방 목록 모드 전체로 변경
    setIsLoading(true); //옵저버 target element 비활성화
    console.log("getRoomList 시작");
    await fetchGetRoomList(pageCount) //api - 전체
      .then((res) => {
        const resRoomListData = res.data.data.chattingRoomList;
        setRoomData((prev) => [...prev, ...resRoomListData]);
        console.log("fetchGetRoomList 완료 ", resRoomListData);
        setIsRoomEnd(false); //옵저버 target element 그대로 보이기

        if (resRoomListData.length < 16) {
          //방 목록 갯수가 응답 최대 값보다 작다면
          setIsRoomEnd(true); //옵저버 target element 숨기기
          console.log("방 목록 끝!");
        } else if (resRoomListData.length === 0) {
          setIsRoomEnd(true); //옵저버 target element 숨기기
          setIsNoRooms(true); //방 목록 없는 상태
          console.log("방 목록 끝!");
        }
      });
    setIsLoading(false); //옵저버 target element 활성화
  };

  //상황별 방 목록 불러오기
  useEffect(() => {
    if (roomListMode === listMode.all && pageCount === 1) {
      console.log("🎄 처음 방 목록 불러오기 mode : ", roomListMode);
      getRoomList();
    } else if (pageCount > 1) {
      console.log("🎄 방 목록 mode : ", roomListMode);
      //리스트 모드에 따른 조건문
      switch (roomListMode) {
        case listMode.all: //전체 목록
          getRoomList();
          break;
        case listMode.search: //일반 검색
          getRoomSerachList();
          break;
        case listMode.category: //카테고리 검색
          getRoomCategorySearchList();
          break;
        default: //기본 : 전체 목록
          getRoomList();
          break;
      }
    }
  }, [pageCount]);

  useEffect(() => {
    //무한 스크롤
    console.log("옵저버 시작", inView);

    if (inView && !loading) {
      //target 감지 && 로딩 중이 아닐 떄
      setPageCount((prevState) => prevState + 1);
    }

    console.log("옵저버 끝", inView);
  }, [inView]);

  useEffect(() => {
    console.log("⭐ roomData 갯수 : ", roomData.length);
  }, [roomData]);

  //검색어 변경시 pagecount 초기화
  const onChangeSearchValue = (e) => {
    const { value } = e.target;
    setSearchValue(value);
    setPageCount(1);
  };

  //방 검색 버튼 클릭
  const onSubmitGetRoomSerachList = async (e) => {
    e.preventDefault();
    if (!regExpSearch(searchValue)) {
      //검색어 유효성 검사 실패일 경우
      searchInputRef.current.focus();
      return false;
    }
    setRoomListMode(listMode.search); //목록 모드 검색으로 변경
    setPageCount(1); //검색 버튼을 누르면 무조건 페이지 카운트 초기화
    setIsSerachStatus(true); //검색 상태 true
  };

  //검색 상태가 true일 경우 실행 : 검색 버튼 클릭일 경우
  useEffect(() => {
    isSerachStatus && getRoomSerachList();
  }, [isSerachStatus]);

  //방 검색
  const getRoomSerachList = async () => {
    console.log("검색 시작 : ", searchValue);

    //첫 검색일 경우(검색 버튼 클릭일 경우) 스크롤 위치 최상단으로 이동
    if (pageCount === 1) {
      scrollBoxRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
      setRoomData([]); // 첫 목록이라면 방 목록 초기화
    }

    await setPrevSearchValue(searchValue); //이전 검색 기록을 현재 검색어로 세팅
    setIsLoading(true);

    const serachRoomPayload = {
      pageCount: pageCount,
      searchValue: searchValue,
    };

    await fetchGetRoomSearchList(serachRoomPayload).then((res) => {
      const resRoomSearchListData = res.data.data.chattingRoomList;
      setRoomData((prev) => [...prev, ...resRoomSearchListData]);

      console.log("fetchGetRoomList 완료 ", resRoomSearchListData);
      setIsRoomEnd(false); //마지막 목록 상태가 아님

      if (resRoomSearchListData.length < 16) {
        setIsRoomEnd(true); //마지막 목록 상태
        console.log("방 목록 끝!");
      } else if (resRoomSearchListData.length === 0) {
        setIsRoomEnd(true); //마지막 목록 상태
        setIsNoRooms(true); //방 목록 없는 상태
        console.log("방 목록 끝!");
      }
    });
    setIsLoading(false);
    setIsSerachStatus(false);
  };

  //카테고리 검색
  const onClickCategorySearch = (value) => {
    //카테고리 버튼 클릭
    console.log("카테고리 value ", value);

    if (value) {
      //검색한 값이 있다면 > 버튼 클릭일 경우에만 해당
      setRoomListMode(listMode.category); //목록 모드 변경
      setIsCategorySearch(true); //버튼 클릭 상태(첫 검색)
      setPageCount(1); //첫 검색이므로 페이지 카운트 초기화
      setPrevCategoryValue(value); //이전 검색 값에 현재 카테고리 값 설정
    }
  };

  useEffect(() => {
    //카테고리 버튼 클릭일 경우

    //처음 검색(true)일 경우 카테고리 목록 불러오기
    //처음 검색이 아니면 옵저버 영역에서 컨트롤함
    isCategorySearch && getRoomCategorySearchList();
  }, [isCategorySearch]);

  const getRoomCategorySearchList = async () => {
    setIsLoading(true);

    //해당 키워드 첫 검색일 경우 스크롤 위치 최상단으로 이동
    if (pageCount === 1) {
      scrollBoxRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      });
      setRoomData([]); // 첫 목록이라면 방 목록 초기화
    }

    console.log("prevCategoryValue : ", prevCategoryValue);

    const serachRoomPayload = {
      pageCount: pageCount,
      categoryValue: prevCategoryValue,
    };
    await fetchGetRoomCategoryList(serachRoomPayload).then((res) => {
      const resRoomSearchListData = res.data.data.chattingRoomList;

      setRoomData((prev) => [...prev, ...resRoomSearchListData]);
      console.log("fetchGetRoomList 완료 ", resRoomSearchListData);
      setIsRoomEnd(false); //마지막 목록 상태가 아님

      if (resRoomSearchListData.length < 16) {
        setIsRoomEnd(true); //마지막 목록 상태
        console.log("방 목록 끝!");
      } else if (resRoomSearchListData.length === 0) {
        setIsRoomEnd(true); //마지막 목록 상태
        setIsNoRooms(true); //방 목록 없는 상태
        console.log("방 목록 끝!");
      }
    });
    setIsLoading(false);
    setIsCategorySearch(false);
  };

  //방 입장하기
  const onClickRoomJoin = (title, sessionId, status) => {
    const info = {
      title: title,
      sessionId: sessionId,
      status: status,
    };
    console.log(" 방 목록 info : ", info);
    if (status) {
      //공개 방 입장
      localStorage.setItem("title", title);
      localStorage.setItem("sessionId", sessionId);
      localStorage.setItem("status", status);
      pageCountReset()
      return navigate(`/roomWaiting`);
    }
  };

  //방 만들기 클릭
  const onClickRoomCreate = () => {
    pageCountReset()
    navigate("/roomCreate");
  };

  if (loading) { //첫 랜딩에서만 호출
    pageCount === 1 && <Wait />;
  }

  if (hasErrors) {
    //alert("다시 시도해주세요!");
    return navigate("/login");
  }

  console.log("🎄 방 목록 mode : ", roomListMode);

  return (
    <StRoomListWrap>
      <StRoomListSideNav>
        <ListSideBar />
      </StRoomListSideNav>

      <StRoomListCenter>
        <StRoomListTopContainer>
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
              width="17%"
              height="40px"
              bgColor={COLOR.baseDefault}
              fontColor="#fff"
              hoverBgColor={COLOR.greenDefault}
              hoverFontColor="#000"
              onClick={onClickRoomCreate}
              boxShadow="0px 3px 4px #8600F01A"
            >
              라이브룸 만들기
            </ButtonDefault>
          </StRoomListHeader>

          {/*카테고리*/}
          <StRoomListCategorySlide>
            {/*카테고리 슬라이드 prev*/}
            <StButtonCircle onClick={() => handleNextButtonClick("prev")}>
              <SlArrowLeft />
            </StButtonCircle>

            {/*카테고리 목록*/}
            <StRoomListCategorySlideContainer ref={categorySliderBoxRef}>
              {categoryLists.map((category) => {
                return (
                  <ButtonDefault
                    key={nanoid()}
                    onClick={() =>
                      onClickCategorySearch(category.categoryValue)
                    }
                    width="auto"
                    height="44px"
                    padding="10px 20px"
                    margin="0 4px"
                    lineHeight="20px"
                    borderRadius="20px"
                    fontColor="#6F6F6F"
                    hoverBgColor={COLOR.baseLight}
                    hoverFontColor="#fff"
                  >
                    {category.categorySubTitle}
                  </ButtonDefault>
                );
              })}
            </StRoomListCategorySlideContainer>

            {/*카테고리 슬라이드 next*/}
            <StButtonCircle onClick={() => handleNextButtonClick("next")}>
              <SlArrowRight />
            </StButtonCircle>
          </StRoomListCategorySlide>
        </StRoomListTopContainer>

        {/*방 목록 영역*/}
        <StRoomListBox>

          {/*방 목록 위 타이틀*/}
          <StRoomListBoxInfo>
            <StRoomListBoxInfoH2>{message.welcome}</StRoomListBoxInfoH2>
          </StRoomListBoxInfo>

          {/*방 목록*/}
          <StRoomListBoxRooms>
            <StRoomListBoxRoomsContainer ref={scrollBoxRef}>
              {/*방 목록 없을 떄 문구*/}
              {roomData.length === 0 && isNoRooms && (
                <StNoRooms>{message.noRooms}</StNoRooms>
              )}

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

              {/*방 목록 옵저버 타겟 - 불러올 목록 남아있고, 로딩 중이 아닐 때만 활성화*/}
              {roomData.length > 0 && !isRoomEnd && !isLoading && (
                <StScrollTarget ref={target}>
                  <StScrollTargetLoading></StScrollTargetLoading>
                </StScrollTarget>
              )}
            </StRoomListBoxRoomsContainer>
          </StRoomListBoxRooms>
        </StRoomListBox>
      </StRoomListCenter>
    </StRoomListWrap>
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

const StButtonCircle = styled.div`
  border: 1px solid #707070;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 15px;
  padding: 12px;
  cursor: pointer;
  :hover {
    background-color: ${COLOR.baseLight};
    color: #fff;
    border-color: ${COLOR.baseLight};
  }
`;

const StRoomListCategorySlideContainer = styled.div`
  width: 85%;
  overflow: hidden;
  overflow-x: auto;
  white-space: nowrap;
  ::-webkit-scrollbar {
    //스크롤바 비활성화
    /* ( 크롬, 사파리, 오페라, 엣지 ) 동작 */
    display: none;
  }
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
`;
const StRoomListCategorySlide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  height: 44px;
  margin: 0 auto;
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
  height: 38px;
  border: 1px solid ${COLOR.grayLight};
  border-radius: 8px;
  padding: 8px 85px 10px 10px;
`;
const StRoomListSearchBox = styled.form`
  position: relative;
  margin-right: 15px;
`;
const StRoomListHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 32px;
`;

const StRoomListTopContainer = styled.div`
  padding-bottom: 30px;
  border-bottom: 1px solid ${COLOR.grayLight2};
`;

const StRoomListCenter = styled.div`
  width: 100%;
  display: block;
  border-left: 1px solid ${COLOR.grayLight2};
  padding: 36px 85px 36px 40px;
  margin: 0;
  font-size: 0;
  height: 100vh;
`;
const StRoomListWrap = styled.section`
  display: flex;
  justify-content: center;
  background-color: #fff;
  width: 1800px;
`;
export default RoomList;
