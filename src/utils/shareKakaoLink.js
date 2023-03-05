export const shareKakao = (route, title, description, imgUrl) => { // route: 연결될 url, title: 공유링크 타이틀
    
    const kakao={
        route : route,
        title : title,
        description : description,
        imgUrl : imgUrl,
    }

    console.log("카카오톡 공유하기 실행! : ", kakao)


    if (window.Kakao) {
      const kakao = window.Kakao;
      if (!kakao.isInitialized()) {
        kakao.init(process.env.REACT_APP_SHARE_KAKAO_LINK_KEY); // 카카오에서 제공받은 javascript key를 넣어줌 -> .env파일에서 호출시킴
      }
  
      kakao.Link.sendDefault({
        objectType: "feed", // 카카오 링크 공유 여러 type들 중 feed라는 타입 -> 자세한 건 카카오에서 확인
        content: {
          title: title,
          description: description,
          imageUrl: imgUrl,
          link: {
            mobileWebUrl: route,
            webUrl: route
          }
        },
        buttons: [
          {
            title: title,
            link: {
              mobileWebUrl: route,
              webUrl: route
            }
          }
        ]
      });
    }
  };
  