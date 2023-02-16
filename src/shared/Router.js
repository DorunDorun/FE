import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";

import Login from "../pages/login/Login";
import Kakao from "../pages/login/Kakao";

//방 관련
import RoomCreate from '../pages/RoomCreate';
import RoomList from '../pages/RoomList';
import Room from "../pages/Room";
import Google from "../pages/login/Google";
import Naver from "../pages/login/Naver";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        {/* 리다이렉트 주소 */}
        <Route path="/kakao" element={<Kakao />} />
        <Route path="/google" element={<Google />} />
        <Route path="/naver" element={<Naver />} />

        {/* Room 영역*/}
        <Route path="/roomCreate" element={<RoomCreate />} />
        <Route path="/roomList" element={<RoomList />} />
        <Route path="/room" element={<Room />} />
        
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
