import { renderHook, act } from "@testing-library/react";
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
      AudioStream: Buffer.from("mocked audio"),
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
      const response = await convertTextToSpeech("Test text", false);
      expect(response).toBe(successResult);
    });
  });

  test("useTextToSpeech handles error when synthesizing speech", async () => {
    const failResult = new Error("Speech synthesis failed");

    AWSMock.mock("Polly", "synthesizeSpeech", (params, callback) => {
      expect(params).toEqual({
        OutputFormat: "mp3",
        Text: "Test text",
        VoiceId: "Salli",
      });
      return callback(failResult);
    });
    const { result } = renderHook(() => useTextToSpeech());
    const { convertTextToSpeech, loading } = result.current;

    await act(async () => {
      const response = await convertTextToSpeech("Test text", false);
      expect(response).toBe(failResult);
    });

    expect(loading).toBeFalsy();
  });
});
