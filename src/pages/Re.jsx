import React, { useEffect, useState } from "react";
import { setCookie, getCookie } from "../shared/Cookie";
import axios from "axios";
import { kakaoStore } from "../zustand/Store";
import { useNavigate } from "react-router-dom";

const Re = () => {
  const navigate = useNavigate();
  // 인가코드
  let code = new URL(window.location.href).searchParams.get("code");
  console.log(code);

  useEffect(async () => {
    await fetchData(code);
    // navigate("/room");
  }, []);

  const data = kakaoStore((state) => state.data);
  const loading = kakaoStore((state) => state.loading);
  const hasErrors = kakaoStore((state) => state.hasErrors);
  const fetchData = kakaoStore((state) => state.fetch);

  if (loading) {
    return <p>Loading</p>;
  }
  if (hasErrors) {
    return <p>cannot read data</p>;
  }

  console.log("카카오", data);
  // setCookie(code);
  // getCookie(code);
  // console.log(setCookie);
  // console.log(getCookie);
  return <div>Re</div>;
};

export default Re;
