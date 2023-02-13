import React from "react";

const OpenViduVideoComponent = (props) => {
    const videoRef = React.useRef();

    React.useEffect(() => {
        if (props.streamManager && !!videoRef) {
            props.streamManager.addVideoElement(videoRef.current);
        }
        return () => {};
    }, [props.streamManager, videoRef]);

    return <video autoPlay={true} ref={videoRef} />;
};

export default OpenViduVideoComponent;
