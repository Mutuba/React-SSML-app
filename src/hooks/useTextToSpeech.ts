import { useState, Dispatch, SetStateAction } from "react";
import AWS from "aws-sdk";

AWS.config.update({
  accessKeyId: process.env.REACT_APP_CLIENTID,
  secretAccessKey: process.env.REACT_APP_SECRETKEY,
  region: process.env.REACT_APP_REGION,
});

interface PollyAudioFile {
  AudioStream: { buffer: ArrayBuffer };
  ContentType: string;
  RequestCharacters: number;
}

interface PollyError {
  message: string;
  code: number;
}

interface UseTextToSpeech {
  loading: boolean;
  audioFile: PollyAudioFile | null;
  error: PollyError | null;
  setAudioFile: Dispatch<SetStateAction<PollyAudioFile | null>>;
  convertTextToSpeech: (text: string, ssml: boolean) => Promise<any>;
}

const useTextToSpeech = (): UseTextToSpeech => {
  const polly = new AWS.Polly();
  const [audioFile, setAudioFile] = useState<PollyAudioFile | null>(null);
  const [error, setError] = useState<PollyError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const convertTextToSpeech = async (
    text: string,
    ssml: boolean
  ): Promise<any> => {
    const params = {
      Text: text,
      OutputFormat: "mp3",
      VoiceId: "Salli",
    };

    if (ssml) {
      (params as { TextType?: string }).TextType = "ssml";
    }
    try {
      setLoading(true);
      const data = (await polly
        .synthesizeSpeech(params)
        .promise()) as PollyAudioFile;

      setLoading(false);
      setAudioFile(data);
      return data;
    } catch (error) {
      setLoading(false);
      setError(error as PollyError);

      return error as PollyError;
    }
  };

  return { loading, audioFile, error, setAudioFile, convertTextToSpeech };
};

export default useTextToSpeech;
