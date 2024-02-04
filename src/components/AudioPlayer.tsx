import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsPauseCircleFill } from "react-icons/bs";
import { InfinitySpin } from "react-loader-spinner";
import SpeechTextEditor from "./SpeechTextEditor";
import useTextToSpeech from "../hooks/useTextToSpeech";

interface AudioPlayerProps {}

const AudioPlayer: React.FC<AudioPlayerProps> = () => {
  const [content, setContent] = useState<string | null>(null);
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState<Error | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [text, setText] = useState<string>(content || "");
  const [ssml, setSSML] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);

  const { audioFile, error, loading, convertTextToSpeech, setAudioFile } =
    useTextToSpeech();

  const fetchContent = async () => {
    const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const articles = (data as { articles: { title: string }[] }).articles;

      const articlesContent = articles
        .map((article) => article.title)
        .join(".");
      setContent(articlesContent);
      setText(articlesContent);
      setContentLoading(false);
    } catch (e: any) {
      setContentError(e);
      setContentLoading(false);
    } finally {
      setContentLoading(false);
    }
  };
  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (audio && audioFile) {
      console.log("Response", audioFile);
      const audioArrayBuffer = audioFile.AudioStream.buffer;
      const audioURL = URL.createObjectURL(
        new Blob([audioArrayBuffer], { type: "audio/mpeg" })
      );

      audio.src = audioURL;

      audio.addEventListener("loadeddata", () => {
        setDuration(audio.duration);
        audio.play();
      });

      audio.addEventListener("timeupdate", () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      return () => {
        URL.revokeObjectURL(audioURL);
        audio.removeEventListener("timeupdate", () => {
          setCurrentTime(audio.currentTime);
        });
        audio.removeEventListener("ended", () => {
          setIsPlaying(false);
        });
      };
    }
  }, [audioFile]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (audio) {
      if (!audioFile) {
        const newAudio = await convertTextToSpeech(text, ssml);
        setAudioFile(newAudio);
      }

      const playPauseHandler = () => {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
      };

      /* readyState values:
      0: HAVE_NOTHING - No information is available about the media resource.
      1: HAVE_METADATA - Metadata (like duration and dimensions) is available.
      2: HAVE_CURRENT_DATA - Enough data is available for the current playback position.
      3: HAVE_FUTURE_DATA - Enough data is available for the current and next playback positions.
      4: HAVE_ENOUGH_DATA - Enough data is available for the entire media resource.
  */
      if (audio.readyState >= 2) {
        playPauseHandler();
      } else {
        const canPlayThroughHandler = () => {
          audio.removeEventListener("canplaythrough", canPlayThroughHandler);
          playPauseHandler();
        };
        audio.addEventListener("canplaythrough", canPlayThroughHandler);
      }

      setIsPlaying(!isPlaying);
    }
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

  const formatTime = (timeInSeconds: number) => {
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
        <InfinitySpin color="#00BFFF" width="80" />
      ) : null}

      {error || contentError ? <div>Oops! Something went wrong</div> : null}

      <SpeechTextEditor
        text={text}
        setText={setText}
        ssml={ssml}
        setSSML={setSSML}
      />

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
            disabled={!text || loading}
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
          <button className="load-more-button" onClick={() => fetchContent()}>
            Load More Content
          </button>
          <button
            className="clear-button"
            onClick={async () => resetAudioPlayer()}
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
