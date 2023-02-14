import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Re from "../pages/Re";
import Room from "../pages/Room";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/home" element={<Re />} />
        {/* <Route path="/oauth/callback/kakao" element={<Re />} /> */}

        {/* Room 영역*/}
        <Route path="/room" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
