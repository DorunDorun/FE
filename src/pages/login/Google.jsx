import React, { useEffect } from "react";

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

  useEffect(() => {
    localStorage.clear();
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("id", id);
    localStorage.setItem("email", email);
    localStorage.setItem("name", name);
    localStorage.setItem("profile", profile);
    // window.location.replace("/room");
  }, []);

  return <div>Google</div>;
};

export default Google;
