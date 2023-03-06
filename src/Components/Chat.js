import { connect } from "net";
import React, { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import styled from "styled-components";
import { AiOutlinePlusSquare } from "react-icons/ai";
import Wait from "./Wait";

// 스토어
import useStoreRoomCreate from "../zustand/storeRoomCreate";
import { api } from "../shared/api";
import { sendMessage } from "../zustand/storeSendMessage";

const Chat = ({ props }) => {
  const nickId = props;
  console.log(nickId);
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
  const sendButtonRef = useRef(null);

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
    if (!sessionId) {
      return;
    }
    // 소켓 연결
    if (sessionId) {
      try {
        client.debug = null;
        client.connect(
          headers,
          () => {
            // 채팅방 구독
            client.subscribe(`/sub/chat/room/${sessionId}`, (res) => {
              const receive = JSON.parse(res.body);

              fetchData(receive);
              // fetchdata로 보낼것들
            });
          },
          headers
        );
      } catch (e) {
        console.log(e);
      }
    }
  }, [sessionId]);

  const sendChat = () => {
    const msg = chatRef.current.value;
    const img = imgRef.current.files[0];
    const now = new Date();
    if (sendButtonRef.current.disabled) return;
    sendButtonRef.current.disabled = true;
    sendButtonRef.current.innerText = "전송 중..."; // 버튼 텍스트 변경
    if (msg === "" && !img) {
      return;
    }
    if (img) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgDataUrl = reader.result;
        const imgDataStr = `data:image/jpeg;base64,${imgDataUrl.split(",")[1]}`;
        client.send(
          `/pub/chat/room`,
          {},
          JSON.stringify({
            sessionId: sessionId,
            socialUid: id,
            nickname: name,
            message: msg,
            imgByteCode: imgDataStr,
            createdAt: now,
          })
        );
        setImage(null);
      };
      reader.readAsDataURL(img);
    } else {
      client.send(
        `/pub/chat/room`,
        {},
        JSON.stringify({
          sessionId: sessionId,
          socialUid: id,
          nickname: name,
          message: msg,
          createdAt: now,
        })
      );
    }

    chatRef.current.value = null;
    imgRef.current.value = null;
    setTimeout(() => {
      sendButtonRef.current.disabled = false;
      sendButtonRef.current.innerText = "전송"; // 버튼 텍스트 변경
    }, 3000);
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
                    <p>{nickId}</p>
                  </SendSet>
                  <SendBox>
                    {chating.receive.imgUrl && (
                      <img src={chating.receive.imgUrl} />
                    )}
                    {chating.receive.message && (
                      <span>{chating.receive.message}</span>
                    )}
                  </SendBox>
                  <span style={{ fontSize: "small" }}>
                    {new Date(chating.receive.createdAt).toLocaleTimeString(
                      "ko-KR",
                      {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </span>
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
                  <span style={{ fontSize: "small" }}>
                    {new Date(chating.receive.createdAt).toLocaleTimeString(
                      "ko-KR",
                      {
                        hour12: true,
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </span>
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
        <Click ref={sendButtonRef} onClick={sendChat}>
          전송
        </Click>
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
  margin-bottom: 7px;
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
