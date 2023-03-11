import React, { useState } from "react";
import styled from "styled-components";
import { AiFillCheckSquare } from "react-icons/ai";
import { StoreDesign } from "../../zustand/storeDesign";

const Design = () => {
  const images = [
    `${process.env.PUBLIC_URL}/asset/images/design/thumb-01.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/thumb-02.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/thumb-03.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/thumb-04.png`,
  ];
  const frames = [
    `${process.env.PUBLIC_URL}/asset/images/design/frame-01.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/frame-02.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/frame-03.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/frame-04.png`,
  ];
  const [selectedImage, setSelectedImage] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleImageChange = (event) => {
    setSelectedImage(images[event.target.selectedIndex]);
  };

  const handleImageClick = (image) => {
    if (selectedImage === image) {
      setSelectedImage(null);
      setIsButtonDisabled(true);
    } else {
      setSelectedImage(image);
      setIsButtonDisabled(false);
    }
  };

  // Zustand 스토어에 접근하여 상태를 변경합니다.
  const setDesignColor = StoreDesign((state) => state.setColor);

  const handleButtonClick = () => {
    if (selectedImage !== null) {
      const selectedFrame = frames[images.indexOf(selectedImage)];
      // console.log(`선택한 이미지: ${selectedFrame}`);
      setDesignColor(selectedFrame);
    }
  };

  const colorData = StoreDesign((state) => state.color);
  console.log(colorData); // Zustand에서 넘겨받은 colorData 값 출력

  return (
    <Container>
      <StDesign>
        {images.map((image, index) => (
          <div key={image}>
            <img
              src={image}
              className={selectedImage === image ? "selected" : ""}
              onClick={() => handleImageClick(image)}
            />
            {selectedImage === image && (
              <StCheck>
                <AiFillCheckSquare />
              </StCheck>
            )}
          </div>
        ))}
      </StDesign>
      <button
        disabled={isButtonDisabled}
        onClick={handleButtonClick}
        style={{
          cursor: selectedImage !== null ? "pointer" : "default",
          backgroundColor: selectedImage !== null ? "#8600f0" : "gray",
        }}
      >
        선택 완료
      </button>
    </Container>
  );
};

export default Design;

const Container = styled.div`
  position: relative;
  height: 100%;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-left: 15px;
    width: 100px;
    border-radius: 5px;
    border: none;
    color: #fff;
  }
`;

const StDesign = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  div {
    display: flex;
    img {
      margin-bottom: 10px;
      justify-content: center;

      width: 200px;
    }
  }
`;

const StCheck = styled.div`
  position: absolute;
  color: #fff;
  width: 30px;
  height: 30px;
`;
