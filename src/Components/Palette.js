import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import styled from "styled-components";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { AiFillCheckSquare } from "react-icons/ai";

const Palette = () => {
  const [color, setColor] = useColor("hex", "#F4E7FF");
  const [colorData, setColorData] = useState("");

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleClick = () => {
    console.log("Color data:", color);
    setColorData(color);
  };

  return (
    <Stpicker>
      <ColorPicker
        width={228}
        height={70}
        color={color}
        onChange={handleColorChange}
        hideRGB
        hideHSV
      />
      <button onClick={handleClick}>전송</button>
    </Stpicker>
  );
};
export default Palette;

export const PCheers = () => {
  const [selectedBox, setSelectedBox] = useState(null);

  const handleBoxClick = (index) => {
    if (selectedBox === index) {
      setSelectedBox(null); // 선택한 박스를 다시 누르면 선택 해제
    } else {
      setSelectedBox(index);
    }
  };

  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#144653",
          border:
            selectedBox === 0 ? "2px solid #fff" : "2px solid transparent",
        }}
        onClick={() => handleBoxClick(0)}
      >
        {selectedBox === 0 && <AiFillCheckSquare />}
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#01A08C",
          border:
            selectedBox === 1 ? "2px solid #fff" : "2px solid transparent",
        }}
        onClick={() => handleBoxClick(1)}
      >
        {selectedBox === 1 && <AiFillCheckSquare />}
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#F0C15C ",
          border:
            selectedBox === 2 ? "2px solid #fff" : "2px solid transparent",
        }}
        onClick={() => handleBoxClick(2)}
      >
        {selectedBox === 2 && <AiFillCheckSquare />}
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#FF9E51 ",
          border:
            selectedBox === 3 ? "2px solid #fff" : "2px solid transparent",
        }}
        onClick={() => handleBoxClick(3)}
      >
        {selectedBox === 3 && <AiFillCheckSquare />}
      </Box>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#F66647",
          border:
            selectedBox === 4 ? "2px solid #fff" : "2px solid transparent",
        }}
        onClick={() => handleBoxClick(4)}
      >
        {selectedBox === 4 && <AiFillCheckSquare />}
      </Box>
    </Stpalette>
  );
};

export const PGarden = () => {
  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#3F4754",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#352629",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#497446",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#2CF123",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#CD77FE",
        }}
      />
    </Stpalette>
  );
};

export const PCat = () => {
  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#FF8225",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#EE6421",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#C43D0D",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#A9928C",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: " #EFD3BB",
        }}
      />
    </Stpalette>
  );
};

export const PCaramelldanse = () => {
  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#615ADE",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#3342BC",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#3723A6",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#BB7FFE",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#8F8EFF",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#A8CDFF",
        }}
      />
    </Stpalette>
  );
};

export const PVolcano = () => {
  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#FF8225",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#33333B",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#141319 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#FC7047 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: " #FC5301 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: " #F5400B ",
        }}
      />
    </Stpalette>
  );
};

export const PMorningDew = () => {
  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#1A5012 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#3B7D1C ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#75AB93 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#C28BCF ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#FABD65 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: " #F78E32 ",
        }}
      />
    </Stpalette>
  );
};

export const PForest = () => {
  return (
    <Stpalette>
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#71D472",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#A7F3B0",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#619B5D ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: "#1E4032 ",
        }}
      />
      <Box
        sx={{
          width: 40,
          height: 40,
          backgroundColor: " #052717 ",
        }}
      />
    </Stpalette>
  );
};

const Stpalette = styled.div`
  display: flex;
  margin: auto;
`;

const Stpicker = styled.div`
  display: flex;
  flex-direction: column;
`;
