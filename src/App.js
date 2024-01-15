import "./App.css";
import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import AudioPlayer from "./components/AudioPlayer";

function App() {
  return (
    <>
      <div className="container">
        <Header />
        <Toaster position="top-center" reverseOrder={false} />
        <AudioPlayer />
      </div>
    </>
  );
}

export default App;
