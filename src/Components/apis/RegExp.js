/*유효성 검사*/

//닉네임
export const regExpNickName=(value)=>{
    //유효성 검사 방 제목
    //const regExpTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|(|)|_|-|]{2,20}$/;
    //if (!regExpTitle.test(value.trim())) {
      if (value.length < 2 || value.length > 20) {
      return false
    } else {
        return true
    }
};


//유효성 검사 방 제목
export const regExpTitle = (value) => {
  const regExpTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|~!@#$%^&*()_+|<>?:{}|]{5,20}$/;
  if (!regExpTitle.test(value.trim())) {
    return false
  } else {
    return true
  }
};

//유효성 검사 방 내용
export const regExpSubTitle = (value) => {
  const regExpSubTitle = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|" "|~!@#$%^&*()_+|<>?:{}|]{5,20}$/;
  if (!regExpSubTitle.test(value.trim())) {
    return false
  } else {
    return true
  }
};

//유효성 검사 방 비밀번호
export const regExpPassword = (value) => {
  const regExpPassword = /^[a-z|A-Z|0-9|" "|]{5,10}$/;
  if (!regExpPassword.test(value.trim())) {
    return false
  } else {
    return true
  }
};