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

  const convertTextToSpeech = async (text, ssml) => {
    const params = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Salli",
    };

    if (ssml) {
      params.TextType = "ssml";
    }

    try {
      const data = await polly.synthesizeSpeech(params).promise();
      setLoading(false);
      setAudioFile(data);
    } catch (error) {
      setLoading(false);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { audioFile, error, loading, convertTextToSpeech, setAudioFile };
};

export default useTextToSpeech;
