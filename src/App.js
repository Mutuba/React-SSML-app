import React from "react";
import "./App.css";
import Header from "./components/Header";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <AudioPlayer />
      </div>
    </>
  );
}

export default App;
