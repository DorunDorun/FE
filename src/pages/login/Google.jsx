import React, { useEffect } from "react";
import { LoginStore } from "../../zustand/Store";

const Google = () => {
  //   window.location.href;
  //   let code = new URL(window.location.href).searchParams.get("code");

  //   구글
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

  // console.log(accessToken);
  // console.log(refreshToken);
  // console.log(user_Info);
  // console.log("id", id);
  // console.log("email", email);
  // console.log("name", name);
  // console.log("social", social);
  // console.log("profile", profile);

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
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("profile", profile);

    fetchData(token);
    window.location.replace("/roomList");

  }, []);

  if (loading) {
    return <p>Loading</p>;
  }
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러</p>;
  }

  return <div>Google</div>;
};

export default Google;
