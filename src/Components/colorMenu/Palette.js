import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import styled from "styled-components";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";
import { AiFillCheckSquare } from "react-icons/ai";
import { StorePalette } from "../../zustand/storePalette";

const Palette = () => {
  const [color, setColor] = useColor("hex", "#F4E7FF");
  const [colorData, setColorData] = useState("");
  const [selectedBox, setSelectedBox] = useState(null);

  // Zustand 스토어에 접근하여 상태를 변경합니다.
  const setColorInStore = StorePalette((state) => state.setColor);

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const handleClick = () => {
    console.log("선택된 색상 데이터:", color.hex);
    setColorData(color.hex);
    setColorInStore(color.hex);
  };

  const handleBoxClick = (index) => {
    if (selectedBox === index) {
      setSelectedBox(null);
    } else {
      setSelectedBox(index);
    }
  };

  const boxClick = () => {
    const selectedColorIndex = selectedBox;
    if (selectedColorIndex !== null) {
      const menuItem = menuItems.find((item) => {
        return (
          selectedColorIndex >= item.startIndex &&
          selectedColorIndex < item.startIndex + item.colors.length
        );
      });
      const selectedColor =
        menuItem.colors[selectedColorIndex - menuItem.startIndex];
      console.log(selectedColor);
      setColorInStore(selectedColor);
      setSelectedBox(null);
    }
  };

  const menuItems = [
    {
      title: "Cheers",
      className: "StCheers",
      colors: ["#144653", "#01A08C", "#F0C15C", "#FF9E51", "#F66647"],
      startIndex: 0,
    },
    {
      title: "Garden",
      className: "StGarden",
      colors: ["#3F4754", "#352629", "#497446", "#2CF123", "#CD77FE"],
      startIndex: 5,
    },
    {
      title: "Cat",
      className: "StCat",
      colors: ["#FF8225", "#EE6421", "#C43D0D", "#A9928C", "#EFD3BB"],
      startIndex: 10,
    },
    {
      title: "Caramelldanse",
      className: "StCaramelldanse",
      colors: [
        "#615ADE",
        "#3342BC",
        "#3723A6",
        "#BB7FFE",
        "#8F8EFF",
        "#A8CDFF",
      ],
      startIndex: 15,
    },
    {
      title: "Volcano",
      className: "StVolcano",
      colors: [
        "#A38579",
        "#33333B",
        "#141319",
        "#FC7047",
        "#FC5301",
        "#F5400B",
      ],
      startIndex: 21,
    },
    {
      title: "MorningDew",
      className: "StMorningDew",
      colors: [
        "#1A5012",
        "#3B7D1C",
        "#75AB93",
        "#C28BCF",
        "#FABD65",
        "#F78E32",
      ],
      startIndex: 27,
    },
    {
      title: "Forest",
      className: "StForest",
      colors: ["#71D472", "#A7F3B0", "#619B5D", "#1E4032", "#052717"],
      startIndex: 33,
    },
  ];

  return (
    <Container>
      <Stpicker>
        <ColorPicker
          width={228}
          height={100}
          color={color}
          onChange={handleColorChange}
          hideRGB
          hideHSV
        />
        <button onClick={handleClick}>선택 완료</button>
      </Stpicker>
      <Stpalette>
        <StMenu>
          {menuItems.map((item, index) => (
            <React.Fragment key={index}>
              <span>{item.title}</span>
              <div className={item.className}>
                {item.colors.map((color, colorIndex) => (
                  <Box
                    key={colorIndex}
                    sx={{
                      width: 30,
                      height: 30,
                      backgroundColor: color,
                      border:
                        selectedBox === colorIndex + item.startIndex
                          ? "2px solid #fff"
                          : "2px solid transparent",
                    }}
                    onClick={() => {
                      handleBoxClick(colorIndex + item.startIndex);
                    }}
                  >
                    {selectedBox === colorIndex + item.startIndex && (
                      <AiFillCheckSquare color="#fff" />
                    )}
                  </Box>
                ))}
              </div>
            </React.Fragment>
          ))}
          <button
            disabled={selectedBox === null}
            onClick={boxClick}
            style={{ cursor: selectedBox !== null ? "pointer" : "default" }}
          >
            버튼
          </button>
        </StMenu>
      </Stpalette>
    </Container>
  );
};

export default Palette;

const Container = styled.div`
  position: relative;
  height: 100%;
`;

const Stpalette = styled.div`
  display: flex;
  cursor: pointer;
  margin-left: 10px;
`;

const Stpicker = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  margin: auto;
  padding: auto;
  button {
    cursor: pointer;
  }
`;

const StMenu = styled.div`
  display: flex;
  flex-direction: column;
  span {
    display: flex;
    margin-top: 10px;
    margin-bottom: 3px;
    text-align: left;
    font: bold 14px/16px Pretendard;
    letter-spacing: 0px;
    color: #171717;
    opacity: 1;
  }
  div {
    display: flex;
  }
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
    width: 100px;
  }
`;
