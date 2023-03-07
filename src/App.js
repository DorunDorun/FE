import Router from "./shared/Router";
import React from "react";
import './css/reset.css'
import './css/style.css'


const App = () => {
  

  if (process.env.NODE_ENV === "production") {
    console.log = function no_console() {};
    console.warn = function no_console() {};
    console.warn = function () {};
  }

  return <Router />;

};

export default App;
