import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsPauseCircleFill } from "react-icons/bs";
import { InfinitySpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";

import Section from "./Section";
import useTextToSpeech from "../hooks/useTextToSpeech";
import { fetchContent as fetchContentAction } from "../actions/contentActions";

const AudioPlayer = () => {
  const dispatch = useDispatch();
  const content = useSelector((state) => state.content.content);
  const contentLoading = useSelector((state) => state.content.loading);
  const contentError = useSelector((state) => state.content.error);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [text, setText] = useState(content);

  const audioRef = useRef();
  const progressBarRef = useRef();

  const { audioFile, error, loading, convertTextToSpeech } = useTextToSpeech();

  useEffect(() => {
    dispatch(fetchContentAction());
    setText(content);
  }, [dispatch, content]);

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
      {loading || contentLoading ? (
        <InfinitySpin type="Circles" color="#00BFFF" height={80} width={80} />
      ) : null}
      {error || contentError ? <div>Oops! Something went wrong</div> : null}

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

        <div className="buttons">
          <button
            className="audio-button"
            disabled={!text}
            onClick={() => togglePlay()}
          >
            {isPlaying ? (
              <BsPauseCircleFill className="icon-btn" />
            ) : (
              <AiFillPlayCircle className="icon-btn" />
            )}
          </button>
          <button
            className="load-more-button"
            onClick={() => dispatch(fetchContentAction())}
          >
            Load More Content
          </button>
          <button
            className="clear-button"
            onClick={() => setText("")}
            disabled={!text}
          >
            Clear Text
          </button>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
