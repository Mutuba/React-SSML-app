import { useState } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_CLIENTID,
  secretAccessKey: process.env.REACT_APP_SECRETKEY,
  region: process.env.REACT_APP_REGION,
});

const polly = new AWS.Polly();

const useTextToSpeech = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const convertTextToSpeechPromise = (text) => {
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

  const convertTextToSpeech = async (text) => {
    try {
      setLoading(true);
      const data = await convertTextToSpeechPromise(text);
      setAudioFile(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return { audioFile, error, loading, convertTextToSpeech };
};

export default useTextToSpeech;
