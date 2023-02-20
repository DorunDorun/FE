import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";

// 스토어
import useStoreRoomCreate from "../zustand/storeRoomCreate";

const Chat = ({ props }) => {
  console.log(props);
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const id = localStorage.getItem("id");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const profile = localStorage.getItem("profile");
  const thumbnail_image_url = localStorage.getItem("thumbnail_image_url");

  const chatRef = useRef("");

  const navigate = useNavigate();

  const sock = new SockJS("https://dorundorun.shop/ws-stomp");
  const client = Stomp.over(sock);

  const headers = {
    Authorization: accessToken,
    Refresh: refreshToken,
  };

  const data = useStoreRoomCreate((state) => state.data);
  console.log(data);

  //  data에 뭐가 찍힐까요?

  // 채팅 엔터키/shif+enter 막기
  const handleEnterPress = (e) => {
    if (e.keyCode === 13 && e.shiftKey == false) {
      window.scrollTo(0, 0);
    }
  };

  // 화상방정보 가져오기
  useEffect(() => {
    stompConnect();
  }, []);

  // 소켓 연결
  const stompConnect = () => {
    // console.log(sessionid)
    // if(sessionid){
    // console.log(sessionid)
    // }
    try {
      client.debug = null;
      //웹소켓 연결시 stomp에서 자동으로 connect이 되었다는것을
      //console에 보여주는데 그것을 감추기 위한 debug

      client.connect(headers, () => {
        // console.log(sessionid)
        client.subscribe(
          `/sub/chat/room/{sessionId}`,
          (res) => {
            console.log(res.body);
            const receive = JSON.parse(res.body);
            console.log(receive);
            // fetchdata();
            // fetchdata로 보낼것들
            // 토큰값, 방정보= sessionid nickname, message, file, id
          },
          headers
        );
      });
    } catch (e) {
      console.log(e);
    }
  };

  //웹소켓 connect-subscribe 부분

  const stompDisConnect = () => {
    try {
      client.debug = null;
      client.disconnect(() => {
        client.unsubscribe("sub-0");
      }, headers);
    } catch (e) {
      console.log(e);
    }
  };

  // 채팅 전송
  const sendChat = () => {
    client.debug = null;
    const message = chatRef.current.value;
    if (message === "") {
      return;
    }
    client.send(
      `/pub/chat`,
      headers,
      JSON.stringify({
        userEmail: email,
        message: message,
      })
    );
    chatRef.current.value = null;
  };
  // console.log(9999, message);

  return (
    <Container>
      <Wirte>
        <textarea type="text" ref={chatRef} onKeyDown={handleEnterPress} />
        <button onClick={sendChat}>전송</button>
      </Wirte>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  background-color: #f5f3ff;
  border-left: 1px solid #202020;
  position: fixed;
  top: 70px;
  bottom: 0;
  right: 0;
  width: 280px;
  height: 100%;
  color: #202020;
`;

const Wirte = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
  margin-top: 760px;
  textarea {
    width: 280px;
    height: 80px;
    border-radius: 10px;
    background-color: #fff;
    color: #000;
  }
`;
