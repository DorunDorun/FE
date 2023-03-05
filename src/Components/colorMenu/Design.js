import React from "react";
import styled from "styled-components";
import { AiFillCheckSquare } from "react-icons/ai";

const Design = () => {
  const images = [
    `${process.env.PUBLIC_URL}/asset/images/design/썸네일-01.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/썸네일-02.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/썸네일-03.png`,
    `${process.env.PUBLIC_URL}/asset/images/design/썸네일-04.png`,
  ];

  const [selectedImage, setSelectedImage] = React.useState(images[0]);

  const handleImageChange = (event) => {
    setSelectedImage(images[event.target.selectedIndex]);
  };

  const handleImageClick = (image) => {
    if (selectedImage === image) {
      setSelectedImage(null);
    } else {
      setSelectedImage(image);
    }
  };

  return (
    <Container>
      <StMenu>
        <Stselect
          id="design-select"
          value={images.indexOf(selectedImage)}
          onChange={handleImageChange}
        >
          <option value="">선택</option>
          <option value="0">봄</option>
          <option value="1">여름</option>
          <option value="2">가을</option>
          <option value="3">겨울</option>
        </Stselect>
      </StMenu>
      <StDesign>
        {images.map((image, index) => (
          <div key={image}>
            <img
              src={image}
              className={selectedImage === image ? "selected" : ""}
              onClick={() => handleImageClick(image)}
            />
            {selectedImage === image && <AiFillCheckSquare />}
          </div>
        ))}
      </StDesign>
    </Container>
  );
};

export default Design;

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const StMenu = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;

const Stselect = styled.select`
  display: flex;
  width: 200px;
  height: 35px;
`;

const StDesign = styled.div`
  display: flex;
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
