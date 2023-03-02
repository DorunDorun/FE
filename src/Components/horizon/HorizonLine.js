import React from "react";

const HorizonLine = ({ text }) => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        borderBottom: "1px solid gray",
        lineHeight: "0.1em",
        margin: "10px 20px 20px 0px",
      }}
    >
      <span style={{ background: "transparent", padding: "0 10px" }}>
        {text}
      </span>
    </div>
  );
};

export default HorizonLine;
