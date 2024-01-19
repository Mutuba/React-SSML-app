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
  const [ssml, setSSML] = useState(false);

  const audioRef = useRef();
  const progressBarRef = useRef();

  const { audioFile, error, loading, convertTextToSpeech, setAudioFile } =
    useTextToSpeech();

  useEffect(() => {
    dispatch(fetchContentAction());
    setText(content);
  }, [content, dispatch]);

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
      convertTextToSpeech(text, ssml);
    }

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const resetAudioPlayer = () => {
    setText("");
    setAudioFile(null);

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  return (
    <>
      {loading || contentLoading ? (
        <InfinitySpin type="Circles" color="#00BFFF" height={80} width={80} />
      ) : null}
      {error || contentError ? <div>Oops! Something went wrong</div> : null}

      <Section text={text} setText={setText} ssml={ssml} setSSML={setSSML} />

      <div className="audio-container">
        <audio ref={audioRef} />

        {audioFile ? (
          <>
            <div className="progress-container">
              <div
                ref={progressBarRef}
                className="progress-bar"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            <div className="time-info">
              <span>{formatTime(currentTime)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </>
        ) : null}

        <div>
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
        </div>

        <div className="buttons">
          <button
            className="load-more-button"
            onClick={() => dispatch(fetchContentAction())}
          >
            Load More Content
          </button>
          <button
            className="clear-button"
            onClick={() => resetAudioPlayer()}
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
