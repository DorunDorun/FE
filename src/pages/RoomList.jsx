//기본
import React, { useEffect, useState, useRef, useMemo } from "react";
import styled from "styled-components";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import queryString from "query-string";

//컴포넌트, 스타일
import ButtonDefault from "../Components/ButtonDefault";
import Wait from "../Components/Wait";
import ListSideBar from "../Components/sidebar/ListSideBar";
import { categoryList } from "../Components/lists/CategoryList";
import RoomListBox from '../Components/Rooms/RoomListBox';
import RoomListHeaderSearch from '../Components/Rooms/RoomListHeaderSearch';
import ScrollTop from '../Components/ScrollTop';

//아이콘
import { SlArrowLeft } from "react-icons/sl";
import { SlArrowRight } from "react-icons/sl";

//이미지
import CategoryImageList from "../Components/lists/CategoryImageList";

//css
import { COLOR } from "../Components/style/style";

//스토어 방 목록
import useStoreRoomList from "../zustand/storeRoomList";
//스토어 방 검색어
import useStoreRoomSearch from '../zustand/storeRoomSearch';



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
  const [isSerachStatus, setIsSerachStatus] = useState(false);
  const scrollBoxRef = useRef(); //검색 후 scroll top을 위한 target 설정
  const searchInputRef = useRef();
  const roomSearchValue = useStoreRoomSearch((state)=>state.roomSearchValue) //검색 컴포넌트에서 전달 받은 값

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

  //전체 목록 상태 값
  const [isGetRoomRefreshMode, setIsGetRoomRefreshMode] = useState(false)


  const pageCountReset=()=>{ //페이지 카운터 초기화
    console.log("👋 pageCountReset!!!")
    setPageCount(1)
    setRoomData([])
  }


  //무한 스크롤 옵션
  const [target, inView] = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 0, /*옵저버 target element 활성화 view 퍼센트
                    0 : 보이자마자
                    1 : 모두 보일 때*/
  });

  //카테고리 슬라이더 영역
  const categorySliderBoxRef = useRef();
  const categorySliderBox = categorySliderBoxRef.current

  const handleNextButtonClick = (nextType) => { //카테고리 슬라이더
    const slideWidth = 300 //슬라이딩 width px

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


  //방 목록 처음으로 초기화
  const resetRoomList = async ()=>{
    if(pageCount > 1){
      await setRoomListMode(listMode.all); //방 목록 모드 전체로 변경
      return pageCountReset()
    }else{
      await setRoomData([])
      return setIsGetRoomRefreshMode(true)
    }
  }

  //방 목록 전체보기
  useEffect(()=>{
    if(isGetRoomRefreshMode){
      getRoomList()
      setIsGetRoomRefreshMode(false)
    }
    
  },[isGetRoomRefreshMode])





  //방 전체 목록 불러오기 api
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
          //setIsNoRooms(true); //방 목록 없는 상태
          console.log("방 목록 끝!");
        }
      });
    setIsLoading(false); //옵저버 target element 활성화
  };


  //상황별 방 목록 불러오기
  useEffect(() => {
    window.history.pushState(null, null, `roomList`) //url 값 변경
    
    if (roomListMode === listMode.all && pageCount === 1) { //방 목록 처음, 전체 불러오기
      console.log("🎄 처음 방 목록 불러오기 mode : ", roomListMode);
      getRoomList()

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


  useEffect(() => { //무한 스크롤 옵저버
    
    console.log("옵저버 시작", inView)

    if (inView && !loading) { //target 감지 && 로딩 중이 아닐 떄 페이지 카운트 +1
      setPageCount((prevState) => prevState + 1)
    }
    console.log("옵저버 끝", inView);
  }, [inView]);


  useEffect(() => { //방 목록 데이터 변경 시
    console.log("⭐ roomData 갯수 : ", roomData.length);
    if(roomData.length === 0 ) setIsNoRooms(true); //방 목록 없는 상태
  }, [roomData]);


  //방 검색 버튼 클릭
  const onSubmitGetRoomSerachList = async () => {
    setRoomListMode(listMode.search); //목록 모드 검색으로 변경
    setPageCount(1); //검색 버튼 클릭 시 페이지 카운트 초기화
    setIsSerachStatus(true); //검색 상태 true
  };

  //검색 상태가 true일 경우 실행 : 검색 버튼 클릭일 경우
  useEffect(() => {
    isSerachStatus && getRoomSerachList();
  }, [isSerachStatus]);

  //방 검색
  const getRoomSerachList = async () => {
    console.log("검색 시작 : ", roomSearchValue);

    //첫 검색일 경우(검색 버튼 클릭일 경우) 스크롤 위치 최상단으로 이동
    if (pageCount === 1) {
      scrollTop("auto")

      setRoomData([]); // 첫 목록이라면 방 목록 초기화
    }
    setIsLoading(true);

    const serachRoomPayload = {
      pageCount: pageCount,
      searchValue: roomSearchValue, //store value
    };

    await fetchGetRoomSearchList(serachRoomPayload).then((res) => {
      const resRoomSearchListData = res.data.data.chattingRoomList;
      setRoomData((prev) => [...prev, ...resRoomSearchListData]);

      console.log("fetchGetRoomList 완료 ", resRoomSearchListData);
      setIsRoomEnd(false); //마지막 목록 상태가 아님

      window.history.pushState(null, null, `roomList?search=${serachRoomPayload.searchValue}`) //url 값 변경

      if (resRoomSearchListData.length < 16) {
        setIsRoomEnd(true); //마지막 목록 상태
        console.log("방 목록 끝!")
        
      } else if (resRoomSearchListData.length === 0) {
        setIsRoomEnd(true); //마지막 목록 상태
        setIsNoRooms(true); //방 목록 없는 상태
        console.log("방 목록 끝!")
      }
    });
    setIsLoading(false);
    setIsSerachStatus(false);
  };



  /*
  const [position, setPosition] = useState(0);
  function onScroll() {
    setPosition(window.scrollY);
    
  }
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [])

  useEffect(() => {
    console.log("scroll position : ", position)
  }, [position])
  */




  //카테고리 검색
  const onClickCategorySearch = (value) => {

    //카테고리 버튼 클릭
    console.log("카테고리 value ", value);

    if (value) { //검색한 값이 있다면 > 버튼 클릭일 경우에만 해당
      setRoomListMode(listMode.category); //목록 모드 변경
      setIsCategorySearch(true); //버튼 클릭 상태(첫 검색)
      setPageCount(1); //첫 검색이므로 페이지 카운트 초기화
      setPrevCategoryValue(value); //이전 검색 값에 현재 카테고리 값 설정
    }
    
  };

  useEffect(() => { //카테고리 버튼 클릭일 경우
    /*처음 검색(true)일 경우 카테고리 목록 불러오기
    처음 검색이 아니면 옵저버 영역에서 컨트롤함*/
    isCategorySearch && getRoomCategorySearchList();
  }, [isCategorySearch]);

  const getRoomCategorySearchList = async () => { //카테고리 검색
    setIsLoading(true);

    //해당 키워드 첫 검색일 경우 스크롤 위치 최상단으로 이동
    if (pageCount === 1) {
      scrollBoxRef.current.scrollTo({
        top: 0,
        behavior: "auto",
      })
      setRoomData([]); // 첫 목록이라면 방 목록 초기화
    }

    console.log("prevCategoryValue : ", prevCategoryValue);

    const serachRoomPayload = {
      pageCount: pageCount,
      categoryValue: prevCategoryValue,
    }

    await fetchGetRoomCategoryList(serachRoomPayload).then((res) => {
      const resRoomSearchListData = res.data.data.chattingRoomList;

      setRoomData((prev) => [...prev, ...resRoomSearchListData]);
      console.log("fetchGetRoomList 완료 ", resRoomSearchListData);
      setIsRoomEnd(false); //마지막 목록 상태가 아님

      window.history.pushState(null, null, `roomList?search=${serachRoomPayload.categoryValue}`) //url 값 변경

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
    setIsCategorySearch(false)

  };

  //위로 올라가기
  const scrollTop=(behaviorValue)=>{
    scrollBoxRef.current.scrollTo({
      top: 0,
      behavior: behaviorValue,
    })
  }

  //스크롤 감지 및 스크롤 top 버튼 컨트롤
  const [isScrollTopStatus, setIsScrollTopStatus]=useState(false)
  const onScroll=()=>{
    const scrollY = scrollBoxRef.current.scrollTop //목록 컴포넌트 스크롤 값

    if(scrollY > 1600 && !isScrollTopStatus){  //2번째 목록 중간부터, 비활성화가 되어 있다면
      setIsScrollTopStatus(true)
    }else{
      setIsScrollTopStatus(false)
    }
  }
  //스크롤 감지
  useEffect(() => {
    scrollBoxRef.current.addEventListener("scroll", onScroll);
    return () => {
      scrollBoxRef.current.removeEventListener("scroll", onScroll);
    };
  }, []);  


  if (loading) { //첫 랜딩에서만 호출
    <Wait />;
  }

  if (hasErrors) {
    //alert("다시 시도해주세요!");
    return navigate("/login");
  }

  console.log("🎄 방 목록 mode : ", roomListMode);

  return (
    <StRoomListWrap>
      <StRoomListSideNav>
        
        {/* 사이드 메뉴 */}
        <ListSideBar resetRoomList={resetRoomList}/>
        
      </StRoomListSideNav>

      <StRoomListCenter>
        <StRoomListTopContainer>

          {/*검색 + 방 만들기 박스*/}
          <RoomListHeaderSearch
            onSubmitGetRoomSerachList={onSubmitGetRoomSerachList}
            searchInputRef={searchInputRef}
            pageCountReset={pageCountReset}
          />

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
                    onClick={() => onClickCategorySearch(category.categoryValue)}
                    width="auto"
                    height="44px"
                    padding="10px 20px"
                    margin="0 4px"
                    lineHeight="20px"
                    borderRadius="20px"
                    fontColor="#6F6F6F"
                    hoverBgColor={COLOR.baseLight}
                    hoverFontColor="#fff"
                    onValue={category.categoryValue}
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
        <RoomListBox
          message={message} 
          scrollBoxRef={scrollBoxRef}
          roomData={roomData}
          isNoRooms={isNoRooms}
          pageCountReset={pageCountReset}
          isRoomEnd={isRoomEnd}
          isLoading={isLoading}
          target={target}
        />

        {/*위로가기*/}
        <ScrollTop 
          display={isScrollTopStatus ? "block" : "none"}
          onClick={()=>scrollTop("smooth")}
        />

      </StRoomListCenter>
      
    </StRoomListWrap>
  );
};


const StRoomListSideNav = styled.div`
  width: 340px;
  height: 100vh;
`;

const StRoomCreateButton = styled.button``;

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
