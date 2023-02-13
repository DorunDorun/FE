import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Re from "../pages/Re";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/oauth/callback/kakao" element={<Re />} />
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
