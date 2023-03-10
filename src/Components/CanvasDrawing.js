import React, {useRef} from "react";
import CanvasDraw from "react-canvas-draw";
import { GithubPicker } from "react-color";
import { TwitterPicker } from "react-color";
import styled, { StyledComponent } from 'styled-components';


import "../css/style.css";
import { useClickAway } from "../hooks/useClickAway";
import classNames from "classnames";

const defaultProps = {
  onChange: null,
  loadTimeOffset: 5,
  lazyRadius: 0,
  brushRadius: 4,
  brushColor: "#444",
  catenaryColor: "#0a0302",
  //gridColor: "rgba(150,150,150,0.17)",
  hideGrid: true,
  canvasWidth: 1196,
  canvasHeight: 476,
  disabled: false,
  imgSrc: "",
  saveData: "",
  immediateLoading: true,
  hideInterface: false,
  // enablePanAndZoom: false,
  // mouseZoomFactor: 0.01,
  // zoomExtents: { min: 0.33, max: 3 },
};

const colors = [
  "#B80000",
  "#DB3E00",
  "#FCCB00",
  "#008B02",
  "#006B76",
  "#1273DE",
  "#004DCF",
  "#5300EB",
  "#000000",
  "#EB9694",
  "#FAD0C3",
  "#FEF3BD",
  "#C1E1C5",
  "#BEDADC",
  "#C4DEF6",
  "#BED3F3",
  "#D4C4FB",
  "#CCCCCC",
];

//const width = `${Math.ceil(colors.length / 2) * 32}px`;

function CanvasDrawing({className, defaultClass, isCapture}) {
  const classNameProps=className
  const defaultClassProps=defaultClass
  const canvasRef = useRef()
  const [brushColor, setBrushColor] = React.useState("#000000");
  const [showColor, setShowColor] = React.useState(false);
  const [saveData, setSaveData] = React.useState("");

  const getImg = () =>{
    const canvasImageUrl = canvasRef.current.canvasContainer.children[1].toDataURL();
    if(canvasImageUrl){
      return canvasImageUrl
    }
  }

  const paletteRef = useClickAway(() => {
    setShowColor(false);
  });

  const handleClear = () => {
    canvasRef.current.clear();
    setSaveData("");
  };

  const handleCanvasChange = () => {
    const saveData = getImg();
    setSaveData(saveData);
  };

  const props = {
    ...defaultProps,
    className: classNames("canvas"),
    onChange: handleCanvasChange,
    ref: canvasRef,
    brushColor,
    catenaryColor: brushColor,
  };

  return (
    <div className={"canvasWrap " + classNameProps + " " + defaultClassProps}>
      <StCaptureStatusBox className={isCapture}>
        <CanvasDraw {...props} />
        <StCanvasDrawingButtonBox className="button-container">
          <div ref={paletteRef} className="picker-container">
            <button
              className="palette canvasButton"
              onClick={() => {
                setShowColor((s) => !s);
              }}
            >
              <span role="img" aria-label="팔레트 선택">
                🎨
              </span>
              color
            </button>
            {showColor && (
              <div className="picker-popper">
                <TwitterPicker
                  triangle={"hide"}
                  color={brushColor}
                  colors={colors}
                  //width={width}
                  onChangeComplete={(c) => setBrushColor(c.hex)}
                />
            </div>
            )}
          </div>
          <button
            className="undo canvasButton"
            onClick={() => {
              canvasRef.current.undo();
            }}
          >
            <span role="img" aria-label="지우기">
              ↩️
            </span>
            undo
          </button>
          <button className="clear canvasButton" onClick={handleClear}>
            <span className="non-hover" role="img" aria-label="모두 지우기">
              💣
            </span>
            <span className="hover" role="img" aria-label="모두 지우기">
              🧨
            </span>
            clear
          </button>
          {/* <button className="save" onClick={handleSave}>
            <span role="img" aria-label="">
              💾
            </span>
            save
          </button> */}
        </StCanvasDrawingButtonBox>
        {saveData && (
          <div className="canvasSaveDataBox">
            <img src={saveData} alt="드로잉 이미지" />
            <textarea rows={10} value={saveData} readOnly />
          </div>
        )}
      </StCaptureStatusBox>
    </div>
  );
}


const StCaptureStatusBox=styled.div`
  width: 100%;
  height: 100%;
`
const StCanvasDrawingButtonBox=styled.div`
  display: ${(props)=>props.display || "flex"};
`

export default CanvasDrawing;
