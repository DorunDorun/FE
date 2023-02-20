/*기본*/
import axios from 'axios';
import React, { useState, Component, useRef, useEffect } from 'react';
import styled from "styled-components";
import { OpenVidu } from 'openvidu-browser';
import { nanoid } from 'nanoid'
import { useNavigate } from 'react-router-dom';

//컴포넌트
import ButtonDefault from '../Components/ButtonDefault';
import RadioGroup from '../Components/RadioGroup';
import RadioGroupImage from '../Components/RadioGroupImage';
import InputWithLabelDefault from '../Components/InputWithLabelDefault'

//버튼 이미지
import joinRoomButtonImageList from '../Components/joinRoomButtonImagePath';

//스토어 방 생성
import useStoreRoomCreate from '../zustand/storeRoomCreate';
//스토어 방장 상태
import useStoreRoomMasterCheck from '../zustand/stoerRoomMasterCheck';

//api
import { server_url } from '../shared/api';


const APPLICATION_SERVER_URL = server_url


function RoomCreate () {

    const navigate = useNavigate()


    const [roomInfo, setRoomInfo]=useState({
        nickName: 'user' + Math.floor(Math.random() * 1000),
        roomTitle: "",
        roomSubTitle: "",
        roomCategory:"",
        roomStatus:true,
        roomPassword:"",
        roomJoinButtonImage:joinRoomButtonImageList.image1.name
    })
    

    const {nickName, roomTitle, roomSubTitle, 
        roomCategory, roomPassword, roomStatus, roomJoinButtonImage} = roomInfo
    
    //입장 버튼 이미지
    const joinRoomButtonImages=
    [
        joinRoomButtonImageList.image1, 
        joinRoomButtonImageList.image2, 
        joinRoomButtonImageList.image3
    ]

    //비밀번호 인풋 활성화
    const [isDisabled, setIsDisabled]=useState(true)

    //유효성 검사
    const [isRegExp, setIsRegExp]=useState({
        title: false,
        subTitle: false,
        password: true
    })

    //상태메세지
    const [validMessage, setValidMessage]=useState({
        title: "",
        subTitle: "",
        password: ""
    })

    //메세지 양식
    const [messageForm, setMessageForm]=useState({
        title:"한글,영어,숫자/ 5~20자 이내",
        subTitle:"한글,영어,숫자/ 5~20자 이내",
        password:"비공개 비밀번호 : 영어,숫자/ 5~10자 이내"
    })


    //카테고리 목록
    const categoryList=[
        {id: nanoid(), categoryName: "공부", categoryValue:"STUDY"},
        {id: nanoid(), categoryName: "친목", categoryValue:"SOCIAL"},
        {id: nanoid(), categoryName: "취미", categoryValue:"HOBBY"},
        {id: nanoid(), categoryName: "운동", categoryValue:"WORKOUT"},
        {id: nanoid(), categoryName: "직장인", categoryValue:"JOBS"},
        {id: nanoid(), categoryName: "재테크", categoryValue:"INVESTMENT"},
        {id: nanoid(), categoryName: "기타", categoryValue:"ETC"},
    ]

    //카테고리 선택
    const onChangeRadioCategory=(value)=>{
        setRoomInfo({...roomInfo , roomCategory : value})
    }

    useEffect(()=>{
        console.log("roomCategory : " , roomCategory)
    },[roomCategory])
    

    //방 공개 비공개
    const onChangeRoomStatus=(roomStatusValue)=>{
        setRoomInfo({...roomInfo, roomStatus:roomStatusValue})
        setIsDisabled(roomStatusValue)
        
    }

    useEffect(()=>{
        console.log('roomStatus 변경 ! : ' , roomStatus)
        console.log("isDisabled 는 ", isDisabled)
        if(roomStatus){
            console.log("roomStatus 는 true ", roomStatus)
            setIsRegExp({...isRegExp, password:true})
            setRoomInfo({...roomInfo, roomPassword:""})
            setValidMessage({...validMessage, password:""})
        }
    },[roomStatus])

    //방 입장 버튼 이미지
    const onChangeRoomJoinButtonImage=(value)=>{
        setRoomInfo({...roomInfo, roomJoinButtonImage:value})
    }

    useEffect(()=>{
        console.log("roomJoinButtonImage : " , roomJoinButtonImage)
    },[roomJoinButtonImage])


    /*유효성 검사*/
    const onBlurRegExpTitle=(e)=>{
        //유효성 검사 방 제목
        const regExpTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|]{5,20}$/;
        let { value } = e.target;
        if (!regExpTitle.test(value.trim())) {
          setIsRegExp({...isRegExp, title:false})
          
          return setValidMessage({...validMessage, title:messageForm.title})
        } else {
            setIsRegExp({...isRegExp, title:true})
          
            return setValidMessage({...validMessage, title:""})
        }
      };

      const onBlurRegExpSubTitle=(e)=>{
        //유효성 검사 방 내용
        const regExpSubTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|]{5,20}$/;
        let { value } = e.target;
        if (!regExpSubTitle.test(value.trim())) {
          setIsRegExp({...isRegExp, subTitle:false})
          
          return setValidMessage({...validMessage, subTitle:messageForm.subTitle})
        } else {
            setIsRegExp({...isRegExp, subTitle:true})
          
            return setValidMessage({...validMessage, subTitle:""})
        }
      }


    //유효성 검사 비밀번호
    const onBlurRegExpPassword=(e)=>{
        console.log("비밀번호 체크 isDisabled 2 : ", isDisabled)
        const regExpPassword = /^[a-z|A-Z|0-9|" "|]{5,10}$/;
        let { value } = e.target;
        if (!regExpPassword.test(value.trim())) {
            setIsRegExp({...isRegExp, password:false})
            return setValidMessage({...validMessage, password:messageForm.password})
        } else {
            setIsRegExp({...isRegExp, password:true})
            return setValidMessage({...validMessage, password:""})
        }
    }


      /*토큰 영역*/

    //토큰 가져오기
    const getToken = async () => {
        const sessionId = await createSession(roomInfo.sessionId);
        return await createToken(sessionId);
    }

    //세션 만들기
    const createSession = async (sessionId) => {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions', { customSessionId: sessionId }, {
            headers: { 'Content-Type': 'application/json', },
        });
        return response.data; // The sessionId
    }

    //토큰 만들기
    const createToken = async (sessionId) => {
        const response = await axios.post(APPLICATION_SERVER_URL + 'api/sessions/' + sessionId + '/connections', {}, {
            headers: { 'Content-Type': 'application/json', },
        });
        console.log('토큰 : ' , response.data)
        return response.data; // The token
    }


    //방 생성 데이터
    const {data} = useStoreRoomCreate((state) => state.data);
    const loading = useStoreRoomCreate((state) => state.loading);
    const hasErrors = useStoreRoomCreate((state) => state.hasErrors);
    const fetchData = useStoreRoomCreate((state) => state.fetch);
    
    //방장 상태
    const roomMasterStatus = useStoreRoomMasterCheck((state) => state.roomMasterStatus);


    //방 생성
    const roomCreate = (e) => {
        e.preventDefault()
        //유효성 검사
        const regexpnew={
            title : isRegExp.title,
            subTitle : isRegExp.subTitle,
            password: isRegExp.password
        }

        console.log('regexpnew ' , regexpnew)

        if(!isRegExp.title || !isRegExp.subTitle || !isRegExp.password){
            console.log('유효성 검사 실패')
            return false
        }else{
            console.log('유효성 검사 통과')
            const newRoomCreateOpen={ //공개 방 정보
                status:roomStatus,
                title:roomTitle,
                subtitle:roomSubTitle,
                category:roomCategory,
                buttonImage:roomJoinButtonImage,
            }
    
            const newRoomCreatePrivate={ //비공개 방 정보
                status:roomStatus,
                title:roomTitle,
                subtitle:roomSubTitle,
                category:roomCategory,
                password:roomPassword,
                buttonImage:roomJoinButtonImage,
            }
    
            const newRoomCreatObj = roomStatus ? newRoomCreateOpen : newRoomCreatePrivate
            console.log('✨ newRoomCreatObj : ' , newRoomCreatObj)
            fetchData(newRoomCreatObj)
            .then((res)=>{
                console.log("fetchData 후 응답 값 : " , res)
                const sessionId = res.data.data.sessionId
                const token = res.data.data.token
                if(sessionId && token){
                    console.log(`sessionId : ${sessionId} / token : ${token}`)
                    roomMasterStatus(true) //방장 상태 true
                    navigate('/room')
                }
                
            })
            
        }

        

    }

    if (loading) {
        return <p>Loading</p>;
      }
    if (hasErrors) {
        return <p>cannot read data : 서버 응답 에러</p>;
    }

        
    return (
        <StRoomCreateWrap>
            <h2> Room Create </h2>
            <StRoomCreateForm onSubmit={(e)=>{roomCreate(e)}}>
                {/* 방 제목 */}
                <StRoomCreateInputDiv>
                    <InputWithLabelDefault
                    width="300px"
                    inputType="text"
                    inputId="roomTitleInput"
                    inputValue={roomTitle}
                    onChange={(e)=>{setRoomInfo({...roomInfo, roomTitle:e.target.value})}}
                    onBlur={onBlurRegExpTitle}
                    validMessage={validMessage.title}
                    labelText="방 제목"
                    inputPaceholder={messageForm.title}
                />
                </StRoomCreateInputDiv>
                {/* 방 내용 */}
                <StRoomCreateInputDiv>
                <InputWithLabelDefault
                    width="300px"
                    inputType="text"
                    inputId="roomSubTitleInput"
                    inputValue={roomSubTitle}
                    onChange={(e)=>{setRoomInfo({...roomInfo, roomSubTitle:e.target.value})}}
                    onBlur={onBlurRegExpSubTitle}
                    validMessage={validMessage.subTitle}
                    labelText="방 내용"
                    inputPaceholder={messageForm.subTitle}
                />
                </StRoomCreateInputDiv>
                {/* 카테고리 */}
                <StRoomCreateInputDiv>
                    카테고리 : 
                    {categoryList.map((category)=>{
                        return(
                            <RadioGroup
                            key={category.id}
                            categoryName={category.categoryName}
                            checked={category.categoryValue === roomCategory}
                            value={category.categoryValue}
                            onChange={(e)=>{onChangeRadioCategory(e.target.value)}}
                            />
                        )
                    })}
                </StRoomCreateInputDiv>
                {/* 공개 여부 */}
                <StRoomCreateInputDivFlex>
                    <StSpanDiv>공개여부 :</StSpanDiv>
                    <StInputBox>
                        <StInputItem>
                            <StInputDefault
                                id="isOpenRoom"
                                type="radio"
                                name="roomStatus"
                                required
                                defaultChecked
                                onChange={(e)=>{onChangeRoomStatus(true)}}
                            />
                            <StLabel htmlFor="isOpenRoom">공개</StLabel>
                        </StInputItem>
                        <StInputItem>
                            <StInputDefault
                                id="isPrivateRoom"
                                type="radio"
                                name="roomStatus"
                                onChange={(e)=>{onChangeRoomStatus(false)}}
                            />
                            <StLabel htmlFor="isPrivateRoom">비공개</StLabel>

                            <InputWithLabelDefault
                                width="300px"
                                inputType="text"
                                inputId="roomPasswordInput"
                                inputValue={roomPassword}
                                onChange={(e)=>setRoomInfo({...roomInfo, roomPassword:e.target.value})}
                                onBlur={onBlurRegExpPassword}
                                validMessage={validMessage.password}
                                labelText=""
                                inputPaceholder={messageForm.password}
                                disabled={isDisabled}
                            />


                        </StInputItem>
                    </StInputBox>
                </StRoomCreateInputDivFlex>
                {/* 버튼 이미지 */}
                <StRoomCreateInputDiv>
                    입장 버튼 이미지 : 
                    {joinRoomButtonImages.map((image)=>{
                        return(
                            <RadioGroupImage 
                            key={nanoid()}
                            imageUrl={image.url}
                            imageName={image.name}
                            checked={image.name === roomJoinButtonImage}
                            onChange={(e)=>{onChangeRoomJoinButtonImage(e.target.value)}}
                            />
                        )
                    })}
                </StRoomCreateInputDiv>
                
                <ButtonDefault bgColor="orange" hoverBgColor="purple">방 생성</ButtonDefault>

            </StRoomCreateForm>
        </StRoomCreateWrap>
    );
}


const StJoinRoomButtonImage=styled.img``
const StInputItem=styled.div``
const StInputBox=styled.div``
const StSpanDiv=styled.span`
    display: block;
`
const StRoomCreateInputDivFlex=styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 15px;
`
const StInputDefault=styled.input.attrs(props=>({
    type: props.type || "text",
}))`
`
const StLabel=styled.label`
    padding:0 12px 0 4px;
`
const StRoomCreateInputDiv=styled.div`
    margin-bottom: 15px;
`
const StRoomCreateForm=styled.form``
const StRoomCreateWrap=styled.div``



export default RoomCreate;
