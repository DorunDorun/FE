import { connect } from "net";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";

// 스토어
import useStoreRoomCreate from "../zustand/storeRoomCreate";
import { api } from "../shared/api";
import { sendMessage } from "../zustand/storeSendMessage";
import Wait from "./Wait";

const Chat = ({ props }) => {
  const sessionId = props;
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const id = localStorage.getItem("id");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const profile = localStorage.getItem("profile");
  const thumbnail_image_url = localStorage.getItem("thumbnail_image_url");

  const chatRef = useRef("");

  const sock = new SockJS("https://dorundorun.shop/ws-stomp");
  const client = Stomp.over(sock);

  const headers = {
    Authorization: accessToken,
    Refresh: refreshToken,
  };

  // 스토어

  const data = useStoreRoomCreate((state) => state.data);

  //소켓
  const msg = sendMessage((state) => state.data);
  const loading = sendMessage((state) => state.loading);
  const hasErrors = sendMessage((state) => state.hasErrors);
  const fetchData = sendMessage((state) => state.fetch);

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
  console.log(headers);
  // 소켓 연결
  const stompConnect = () => {
    if (sessionId) {
    }
    try {
      client.connect(headers, () => {
        console.log("connect", sessionId);
        // 채팅방 구독
        client.subscribe(
          `/sub/chat/room/${data.data.sessionId}`,
          (res) => {
            console.log(res.body);
            const receive = JSON.parse(res.body);
            console.log(receive);
            fetchData(receive);
            // fetchdata로 보낼것들
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
    const msg = chatRef.current.value;
    if (msg === "") {
      return;
    }
    client.send(
      `/pub/chat/room`,
      {},
      JSON.stringify({
        sessionId: data.data.sessionId,
        socialUid: id,
        nickname: name,
        message: msg,
        // imgByteCode: "이미지 바이트 코드",
      })
    );
    chatRef.current.value = null;
  };
  // console.log(9999, message);

  if (loading) {
    return <Wait />;
  }
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러</p>;
  }

  console.log("주스탠드 타고와", msg);

  // const chatlog = msg.map(
  //   (chating) => console.log(1234, chating.receive.message)
  // console.log(9875, chating.message)
  // <div>
  //   <span>{chating.message}</span>
  // </div>
  // );
  // console.log(1234, chatlog);

  return (
    <Container>
      <ChatHistory>
        {msg.map(
          (chating) => (
            // chating.receive.sessionId === sessionId ?
            // (
            <SendMessage key={chating.receive.messageId}>
              <div>
                <span>{chating.receive.message}</span>
              </div>
            </SendMessage>
          )
          // ) : (
          // <div>
          // <span>{chating.receive.message}</span>
          // </div>
          // )
        )}
      </ChatHistory>
      <Wirte>
        <button>+</button>
        <Input type="text" ref={chatRef} onKeyDown={handleEnterPress} />
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

const ChatHistory = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: calc(100% - 155px);
  overflow-y: scroll;
  align-self: flex-end;

  padding: 10px;
  /* justify-content: flex-end; */
`;

const SendMessage = styled.div`
  display: flex;
  width: 100%;
  /* text-align: right; */
  /* border: 1px solid black; */
  div {
    display: flex;
    justify-content: flex-end;
    align-self: flex-end;

    color: #000;
  }
`;

const Wirte = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
`;

const Input = styled.input`
  width: 280px;
  height: 80px;
  border-radius: 10px;
  background-color: #fff;
  color: #000;
`;
