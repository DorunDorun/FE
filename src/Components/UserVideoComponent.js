import React, { Component } from 'react';
import '../css/UserVideo.css';
import OpenViduVideoComponent from "./OvVideo";

const UserVideoComponent = (props) => {
    return (
        <div className="UserVideoComponent">
            {props.streamManager !== undefined ? (
                <OpenViduVideoComponent streamManager={props.streamManager} userMediaBackImage={props.userMediaBackImage} />
            ) : null}
        </div>
    );
};

export default UserVideoComponent;

