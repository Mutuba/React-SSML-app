import { renderHook, act, waitFor } from "@testing-library/react";
import useTextToSpeech from "../../hooks/useTextToSpeech";
import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";

describe("useTextToSpeech", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("Polly");
  });

  test("synthesizes speech successfully", async () => {
    const successResult = {
      ContentType: "audio/mpeg",
      RequestCharacters: 6,
      AudioStream: Buffer.from("Mutuba"),
    };

    AWSMock.mock("Polly", "synthesizeSpeech", (params, callback) => {
      expect(params).toEqual({
        OutputFormat: "mp3",
        Text: "Test text",
        VoiceId: "Salli",
      });
      return callback(successResult);
    });

    const { result } = renderHook(() => useTextToSpeech());
    const { convertTextToSpeech } = result.current;

    await act(async () => {
      await convertTextToSpeech("Test text", false);
    });

    // await waitFor(() => {
    //   expect(result.current.audioFile).toBe(successResult);
    // });

    // expect(audioFile).toBe(successResult);

    // expect(audioFile).toBe({});
  });
});
