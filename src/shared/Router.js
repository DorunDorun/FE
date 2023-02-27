import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// 페이지
import Landing from "../pages/Landing";
import Info from "../pages/Info";
import Notice from "../pages/Notice";
import MyPage from "../pages/MyPage";

// 로그인관련
import Login from "../pages/login/Login";
import Kakao from "../pages/login/Kakao";
import Google from "../pages/login/Google";
import Naver from "../pages/login/Naver";

//방 관련
import RoomCreate from "../pages/RoomCreate";
import RoomList from "../pages/RoomList";
import RoomWaiting from "../pages/RoomWaiting";
import Room from "../pages/Room";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/info" element={<Info />} />
        <Route path="/notice" element={<Notice />} />
        <Route path="/mypage" element={<MyPage />} />

        {/* 리다이렉트 주소 */}
        <Route path="/kakao" element={<Kakao />} />
        <Route path="/google" element={<Google />} />
        <Route path="/naver" element={<Naver />} />

        {/* Room 영역*/}
        <Route path="/roomCreate" element={<RoomCreate />} />
        <Route path="/roomList" element={<RoomList />} />
        <Route path="/roomWaiting" element={<RoomWaiting />} />
        <Route path="/room/:id" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
