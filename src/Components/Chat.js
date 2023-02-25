import { connect } from "net";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";
import { AiOutlinePlusSquare } from "react-icons/ai";

// 스토어
import useStoreRoomCreate from "../zustand/storeRoomCreate";
import { api } from "../shared/api";
import { sendMessage } from "../zustand/storeSendMessage";
import Wait from "./Wait";

const Chat = () => {
  // const sessionId = props;
  const sessionId = localStorage.getItem("sessionId");
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");
  const id = localStorage.getItem("id");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");
  const profile = localStorage.getItem("profile");
  const thumbnail_image_url = localStorage.getItem("thumbnail_image_url");

  const chatRef = useRef("");
  const imgRef = useRef("");

  const sock = new SockJS("https://dorundorun.shop/ws-stomp");
  const client = Stomp.over(sock);

  const headers = {
    Authorization: accessToken,
    Refresh: refreshToken,
  };

  //소켓
  const msg = sendMessage((state) => state.data);
  const loading = sendMessage((state) => state.loading);
  const hasErrors = sendMessage((state) => state.hasErrors);
  const fetchData = sendMessage((state) => state.fetch);

  // 채팅 엔터키 전송
  const handleEnterPress = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault(); // 기본 엔터키 동작 막기
      sendChat(); // 데이터 전송하는 함수 호출
    }
  };

  // 화상방정보 가져오기
  useEffect(() => {
    stompConnect();
  }, []);

  // 소켓 연결
  const stompConnect = () => {
    try {
      client.connect(headers, () => {
        // 채팅방 구독
        client.subscribe(
          `/sub/chat/room/${sessionId}`,
          (res) => {
            const receive = JSON.parse(res.body);
            fetchData(receive);
            // fetchdata로 보낼것들
          },
          headers
        );
      });
      // 소켓이 닫히면 다시 연결
      client.onclose = () => {
        console.log("소켓이 끊어졌습니다. 다시 연결합니다.");
        setTimeout(() => stompConnect(), 5000);
      };
    } catch (e) {
      console.log(e);
      // CORS 에러 처리
      if (e.headers && e.headers.message) {
        console.log(`CORS 에러: ${e.headers.message}`);
        // 적절한 오류 처리를 해주어야 합니다.
      } else {
        console.log(`CORS 에러 발생: ${e}`);
      }
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

  let lastSentTime = 0;
  const sendChat = () => {
    const now = Date.now();
    const timeDiff = now - lastSentTime;
    if (timeDiff < 1000) {
      // 마지막 메시지 전송 후 1초 이내에 메시지를 보내면 도배로 간주
      console.log(now);
      console.log(timeDiff);
      alert("도배 방지: 메시지를 너무 빠르게 보내지 마세요.");
      console.log("도배 방지: 메시지를 너무 빠르게 보내지 마세요.");
      console.error("도배 방지: 메시지를 너무 빠르게 보내지 마세요.");
      return;
    }

    const msg = chatRef.current.value;
    const img = imgRef.current.files[0];
    if (msg === "" && !img) {
      // 메시지와 이미지 둘 다 없을 경우
      return;
    }
    if (img) {
      // 이미지 파일이 있는 경우
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgDataUrl = reader.result;
        const imgDataStr = `data:image/jpeg;base64,${imgDataUrl.split(",")[1]}`;
        client.send(
          "/pub/chat/room",
          {},
          JSON.stringify({
            sessionId: sessionId,
            socialUid: id,
            nickname: name,
            message: msg,
            imgByteCode: imgDataStr, // 압축하지 않고 그대로 사용
          })
        );
        // 이미지 미리보기 초기화
        setImage(null);
      };
      reader.readAsDataURL(img);
    } else {
      // 메시지만 있는 경우
      client.send(
        "/pub/chat/room",
        {},
        JSON.stringify({
          sessionId: sessionId,
          socialUid: id,
          nickname: name,
          message: msg,
        })
      );
    }

    chatRef.current.value = null;
    imgRef.current.value = null;
    lastSentTime = now;

    // return문 수정
    if (true) {
      return;
    }
  };

  const [image, setImage] = useState();
  const [imageFile, setImageFile] = useState("null");
  const imageUpLoad = async (e) => {
    imagePreview(e.target.files[0]);
    setImageFile(e.target.files[0]);
    const imgFile = e.target.files[0];
  };

  // 이미지 미리보기
  const imagePreview = (fileBlob) => {
    const reader = new FileReader();
    reader.readAsDataURL(fileBlob);
    return new Promise((resolve) => {
      reader.onload = () => {
        setImage(reader.result);
        resolve();
      };
    });
  };

  const remove = () => {
    setImage(null);
  };

  if (loading) {
    return <Wait />;
  }
  if (hasErrors) {
    return <p>cannot read data : 서버 응답 에러</p>;
  }

  // console.log("주스탠드 타고와", msg);

  // const chatlog = msg.map(
  //   (chating) => console.log(1234, chating.receive.message)
  // console.log(9875, chating.message)
  // <div>
  //   <span>{chating.message}</span>
  // </div>
  // );
  // console.log(1234, chatlog);

  // const chatlog = todos.map(
  //   (chating) => console.log(1234, chatlog)

  return (
    <Container>
      <ChatHistory>
        <img src={image} onClick={remove} />
        {sessionId &&
          msg
            .slice(0)
            .reverse()
            .map((chating) =>
              chating.receive.nickname === name ? (
                <SendMessage
                  key={chating.receive.messageId || chating.receive.fileId}
                >
                  <SendSet>
                    <p>{chating.receive.nickname}</p>
                  </SendSet>
                  <SendBox>
                    {chating.receive.imgUrl && (
                      <img src={chating.receive.imgUrl} />
                    )}
                    {chating.receive.message && (
                      <span>{chating.receive.message}</span>
                    )}
                  </SendBox>
                </SendMessage>
              ) : (
                <ReceivedMessage>
                  <Set>
                    <p>{chating.receive.nickname}</p>
                  </Set>
                  <Box>
                    {chating.receive.imgUrl && (
                      <img src={chating.receive.imgUrl} />
                    )}
                    {chating.receive.message && (
                      <span>{chating.receive.message}</span>
                    )}
                  </Box>
                </ReceivedMessage>
              )
            )}
      </ChatHistory>
      <Wirte>
        <Select>
          <label htmlFor="ex_file">
            <AiOutlinePlusSquare size="38px" />
          </label>
          <input
            type="file"
            name="image/*"
            ref={imgRef}
            id="ex_file"
            accept="image/jpg, image/png, image/jpeg"
            onChange={imageUpLoad}
          />
        </Select>

        <Input type="text" ref={chatRef} onKeyDown={handleEnterPress}></Input>
        <Click onClick={sendChat}>전송</Click>
      </Wirte>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  background-color: #ffffff;
  border-left: 1px solid #202020;
  width: 348px;
  height: 100%;
  color: #202020;
`;

const ChatHistory = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: calc(100% - 80px);
  overflow-y: scroll;
  padding: 10px;
  img {
    width: auto;
    height: auto;
    object-fit: cover;
  }
`;

const SendMessage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: flex-end;
`;

const ReceivedMessage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  word-break: break-all;
  justify-content: center;
  align-items: flex-start;
`;

const SendSet = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-self: flex-end;
  align-items: center;
`;

const Set = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: flex-start;
`;

const SendBox = styled.div`
  display: flex;
  max-width: 70%;
  justify-content: flex-end;
  background: #8600f0 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;
  margin-left: 70px;
  img {
    /* Layout Properties */
    width: 188px;
    height: 105px;
    object-fit: scale-down;
    background-color: #fff;
  }
  span {
    font: 14px/22px Pretendard;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
    padding: 5px;
    word-wrap: break-word;
    word-break: break-all;
  }
`;

const Box = styled.div`
  display: flex;
  max-width: 70%;
  background: #000000 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;
  img {
    /* Layout Properties */
    width: 188px;
    height: 105px;
    object-fit: scale-down;
    background-color: #fff;
  }
  span {
    font: 14px/22px Pretendard;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
    padding: 5px;
    word-wrap: break-word;
    word-break: break-all;
  }
`;

const Wirte = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #fff;
`;

const Select = styled.div`
  display: flex;
  margin-left: 3px;
  margin-right: 2px;
  label {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  input[type="file"] {
    position: absolute;
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

const Input = styled.input`
  width: 280px;
  border-radius: 10px;
  background-color: #fff;
  color: #000;
  padding: 10px;
`;

const Click = styled.button`
  display: flex;
  padding: auto;
  width: 50px;
  background-color: #8600f0;
  color: #fff;
  border: none;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;
