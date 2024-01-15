import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsPauseCircleFill } from "react-icons/bs";

import { InfinitySpin } from "react-loader-spinner";

import Section from "./Section";
import useTextToSpeech from "../hooks/useTextToSpeech";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [text, setText] = useState("");

  const audioRef = useRef();
  const progressBarRef = useRef();

  const { audioFile, error, loading, convertTextToSpeech } = useTextToSpeech();

  useEffect(() => {
    const audio = audioRef.current;

    if (audioFile) {
      const audioArrayBuffer = audioFile.AudioStream.buffer;
      const audioURL = URL.createObjectURL(
        new Blob([audioArrayBuffer], { type: "audio/mpeg" })
      );

      audio.src = audioURL;

      audio.addEventListener("loadeddata", () => {
        setDuration(audio.duration);
      });

      audio.addEventListener("timeupdate", updateProgressBar);
      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      return () => {
        URL.revokeObjectURL(audioURL);
        audio.removeEventListener("timeupdate", updateProgressBar);
        audio.removeEventListener("ended", () => {
          setIsPlaying(false);
        });
      };
    }
  }, [audioFile]);

  const updateProgressBar = () => {
    const audio = audioRef.current;
    setCurrentTime(audio.currentTime);
  };

  const togglePlay = () => {
    const audio = audioRef.current;

    if (!audioFile) {
      convertTextToSpeech(text);
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {loading && (
        <InfinitySpin type="Circles" color="#00BFFF" height={80} width={80} />
      )}
      {error && <div>Error: {error.message}</div>}

      <Section text={text} setText={setText} />

      <div className="audio-container">
        {text && <audio ref={audioRef} controls={false} />}

        {audioFile && (
          <div className="progress-container">
            <div
              ref={progressBarRef}
              className="progress-bar"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
        )}

        <div>
          <button
            className="audio-button play"
            disabled={!text}
            onClick={() => togglePlay()}
          >
            {isPlaying ? (
              <BsPauseCircleFill className="icon-btn" />
            ) : (
              <AiFillPlayCircle className="icon-btn" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
