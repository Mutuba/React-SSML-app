import { useEffect, useRef, useState } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { BsPauseCircleFill } from "react-icons/bs";
import { toast } from "react-hot-toast";
import AWS from "aws-sdk";
import Section from "./Section";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_CLIENTID,
  secretAccessKey: process.env.REACT_APP_SECRETKEY,
  region: process.env.REACT_APP_REGION,
});

const polly = new AWS.Polly();

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [text, setText] = useState("");

  const audioRef = useRef();
  const progressBarRef = useRef();

  const [audioFile, setAudioFile] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  const convertTextToSpeechPromise = () => {
    return new Promise((resolve, reject) => {
      polly.synthesizeSpeech(
        {
          Text: text,
          OutputFormat: "mp3",
          VoiceId: "Salli",
        },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    });
  };

  const convertTextToSpeech = async () => {
    try {
      const data = await convertTextToSpeechPromise();

      setLoading(false);
      setAudioFile(data);
      toast.success("Text converted to speech successfully!");
    } catch (error) {
      setLoading(false);
      setError(error);
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

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
      convertTextToSpeech();
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
