import React, { useEffect } from "react";
import Wait from "../../Components/Wait";
import { LoginStore } from "../../zustand/Store";

const Naver = () => {
  // 네이버
  const accessToken = new URL(window.location.href).searchParams.get(
    "Authorization"
  );

  const refreshToken = new URL(window.location.href).searchParams.get(
    "Refresh"
  );

  const Info = new URL(window.location.href).searchParams.get("user_Info");
  const user_Info = [decodeURIComponent(Info)];
  const id = JSON.parse(user_Info[0]).id;
  const email = JSON.parse(user_Info[0]).email;
  const name = JSON.parse(user_Info[0]).name;
  const social = JSON.parse(user_Info[0]).social;
  const profile = JSON.parse(user_Info[0]).profile;
  const gender = JSON.parse(user_Info[0]).gender;
  const birthday = JSON.parse(user_Info[0]).birthday;
  const birthyear = JSON.parse(user_Info[0]).birthyear;
  const age_range = JSON.parse(user_Info[0]).age_range;

  //방 생성 데이터
  const data = LoginStore((state) => state.data);
  const loading = LoginStore((state) => state.loading);
  const hasErrors = LoginStore((state) => state.hasErrors);
  const fetchData = LoginStore((state) => state.fetch);

  const token = {
    Authorization: accessToken,
    Refresh: refreshToken,
  };

  useEffect(() => {
    localStorage.clear();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("id", id);
    localStorage.setItem("social", social);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("profile", profile);
    localStorage.setItem("gender", gender);
    localStorage.setItem("birthday", birthday);
    localStorage.setItem("birthyear", birthyear);
    localStorage.setItem("age_range", age_range);

    fetchData(token);
    window.location.replace("/roomList");
  }, []);

  if (loading) {
    return <Wait />;
  }
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러</p>;
  }

  return <div>Naver</div>;
};

export default Naver;
