import React from "react";
import Chat from "../Components/Chat";
import ChatRoomSideBar from "../Components/sidebar/ChatRoomSideBar";
import { StorePalette } from "../zustand/storePalette";
import MyPage from "./MyPage";

const Test = () => {
  const colorData = StorePalette((state) => state.color);
  console.log(colorData); // 주스탠드에서 넘겨받은 chatRoomData 값 출력
  return (
    <>
      <MyPage />
      {/* <ChatRoomSideBar /> */}
    </>
  );
};

export default Test;
