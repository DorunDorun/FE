/*유효성 검사*/

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