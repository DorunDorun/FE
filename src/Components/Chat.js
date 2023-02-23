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
  const imgRef = useRef("");

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
  console.log(data);
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
          `/sub/chat/room/${sessionId}`,
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
    const img = imgRef.current.files[0];
    if (msg === "" && !img) {
      // 메시지와 이미지 둘 다 없을 경우
      return;
    }
    if (img) {
      // 이미지 파일이 있는 경우
      const reader = new FileReader(); // FileReader 객체 생성
      reader.onload = (event) => {
        // 파일 로드가 완료되면 실행되는 함수
        const imgData = new Uint8Array(event.target.result); // 파일의 바이트 코드 추출
        const imgDataStr = btoa(String.fromCharCode.apply(null, imgData)); // 바이트 코드를 base64 문자열로 변환
        client.send(
          `/pub/chat/room`,
          {},
          JSON.stringify({
            sessionId: sessionId,
            socialUid: id,
            nickname: name,
            message: msg,
            imgByteCode: imgDataStr, // 이미지 바이트 코드 전송
          })
        );
      };
      reader.readAsArrayBuffer(img); // 파일 읽기
    } else {
      // 메시지만 있는 경우
      client.send(
        `/pub/chat/room`,
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
        <img src={image} onClick={remove} />
        {sessionId &&
          msg
            .slice(0)
            .reverse()
            .map((chating) =>
              chating.receive.nickname === name ? (
                <SendMessage
                  key={chating.receive.messageId}
                  messageLength={chating.receive.message.length}
                >
                  <SendSet>
                    {/* <img src={profile} / */}
                    <p>{chating.receive.nickname}</p>
                  </SendSet>
                  <SendBox>
                    <span>{chating.receive.message}</span>
                  </SendBox>
                </SendMessage>
              ) : (
                <ReceivedMessage>
                  <Set>
                    {/* <img src={profile} /> */}
                    <p>{chating.receive.nickname}</p>
                  </Set>
                  <Box>
                    <span>{chating.receive.message}</span>
                  </Box>
                </ReceivedMessage>
              )
            )}
      </ChatHistory>
      <Wirte>
        <Select>
          <label htmlFor="ex_file">
            <AiOutlinePlusSquare size="25px" />
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
  /* position: fixed;
  top: 70px;
  bottom: 0;
  right: 0; 
  width: 280px;
  height: 100%;
  */
  width: 370px;
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
  }
`;

const SendMessage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${({ messageLength }) =>
    messageLength > 10 &&
    `
    height: auto;
    padding: 10px;
    white-space: pre-wrap;
  `}
`;

const ReceivedMessage = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${({ messageLength }) =>
    messageLength > 10 &&
    `
    height: auto;
    padding: 10px;
    white-space: pre-wrap;
  `}
`;

const SendSet = styled.div`
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-self: flex-end;
  align-items: center;
  img {
    width: 36px;
    height: 36px;
    border-radius: 20px;
  }
`;

const Set = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: flex-start;
  img {
    width: 36px;
    height: 36px;
    border-radius: 20px;
  }
`;

const SendBox = styled.div`
  display: flex;
  max-width: 70%;
  justify-content: flex-end;
  background: #8600f0 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;
  margin-left: 50px;
  span {
    font: 14px/22px Pretendard;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
    padding: 5px;
  }
`;

const Box = styled.div`
  display: flex;
  max-width: 70%;
  background: #000000 0% 0% no-repeat padding-box;
  border-radius: 8px;
  opacity: 1;
  span {
    font: 14px/22px Pretendard;
    letter-spacing: 0px;
    color: #ffffff;
    opacity: 1;
    padding: 5px;
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
    display: inline-block;
    font-size: inherit;
    line-height: normal;
    vertical-align: middle;
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
`;

const Click = styled.button`
  display: flex;
  background-color: #8600f0;
  color: #fff;
  border: none;
  border-radius: 5px;
  justify-content: center;
  align-items: center;
`;
