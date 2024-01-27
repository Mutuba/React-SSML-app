import { renderHook, act } from "@testing-library/react";
import useTextToSpeech from "../../hooks/useTextToSpeech";

import AWS from "aws-sdk-mock";

AWS.mock("Polly", "synthesizeSpeech", (params, callback) => {
  callback(params, {
    AudioStream: Buffer.from("mocked audio stream"),
  });
});

describe("useTextToSpeech", () => {
  test("useTextToSpeech synthesizes speech successfully", async () => {
    const { result } = renderHook(() => useTextToSpeech());
    const { convertTextToSpeech, error, loading } = result.current;
    await act(async () => {
      await convertTextToSpeech("Test text", false);
    });
    expect(error).toBeNull();
    expect(loading).toBeFalsy();
    expect(result.current.audioFile).not.toBeNull();
  });
});
