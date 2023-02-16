import React, { useEffect } from "react";
import { kakaoStore } from "../../zustand/Store";

const Kakao = () => {
  // 카카오
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
  const thumbnail_image_url = JSON.parse(user_Info[0]).thumbnail_image_url;

  // console.log(typeof user_Info);
  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);
  // console.log("Info", Info);
  // console.log("user_Info", user_Info[0]);
  // console.log("id", id);
  // console.log("email", email);
  // console.log("name", name);
  // console.log("social", social);
  // console.log("profile", profile);
  // console.log("thumbnail_image_url", thumbnail_image_url);

  // const header = kakaoStore((state) => state.header);

  const token = {
    Authorization: localStorage.getItem("accessToken"),
    Refresh: localStorage.getItem("refreshToken"),
  };
  const fetchdata = kakaoStore((state) => state.fetchdata);

  useEffect(() => {
    localStorage.clear();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("profile", profile);
    localStorage.setItem("thumbnail_image_url", thumbnail_image_url);
    // fetch(fetchdata(token));
    // window.location.replace("/room");
  }, []);

  return <div>Kakao</div>;
};

export default Kakao;
