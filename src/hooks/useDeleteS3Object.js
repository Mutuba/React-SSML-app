import { useState } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_CLIENTID,
  secretAccessKey: process.env.REACT_APP_SECRETKEY,
  region: process.env.REACT_APP_REGION,
});

const useDeleteS3Object = () => {
  const [audioFile, setAudioFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteS3Object = async (text, ssml) => {
    const polly = new AWS.Polly();
    const params = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Salli",
    };

    if (ssml) {
      params.TextType = "ssml";
    }

    try {
      const s3DeleteResponse = await polly.synthesizeSpeech(params).promise();
      setAudioFile(s3DeleteResponse);
      setLoading(false);
      return s3DeleteResponse;
    } catch (error) {
      setError(error);
      return error;
    } finally {
      setLoading(false);
    }
  };
  return { deleteS3Object, audioFile, setAudioFile, loading, error };
};

export default useDeleteS3Object;
