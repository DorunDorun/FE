import React from "react";

const OpenViduVideoComponent = (props) => {
    const videoRef = React.useRef();
    

    React.useEffect(() => {
        if (props.streamManager && !!videoRef) {
            props.streamManager.addVideoElement(videoRef.current);
            //console.log("videoRef.current.srcObject getVideoTracks : " , videoRef.current.srcObject.getVideoTracks()[0])
        }
 
        return () => {};
    }, [props.streamManager, videoRef]);


    return <video autoPlay={true} ref={videoRef} className="userVideoStream" />
};

export default OpenViduVideoComponent;
