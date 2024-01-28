import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { renderHook, act } from "@testing-library/react";
import useDeleteS3Object from "../../hooks/useDeleteS3Object";

describe("Test Delete S3 object", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("Polly");
  });

  it("Should be successfully completed", async () => {
    const successResult = { success: true };
    AWSMock.mock("Polly", "synthesizeSpeech", (params, callback) => {
      expect(params).toEqual({
        OutputFormat: "mp3",
        Text: "Test text",
        VoiceId: "Salli",
      });
      return callback(null, successResult);
    });

    const paramsTest = "Test text";
    const { result } = renderHook(() => useDeleteS3Object());
    const { deleteS3Object } = result.current;

    await act(async () => {
      const finalResponse = await deleteS3Object(paramsTest);
      expect(finalResponse).toBe(successResult);
    });
  });

  it("Should fail", async () => {
    const failResult = { success: false };
    AWSMock.mock("Polly", "synthesizeSpeech", (params, callback) => {
      expect(params).toEqual({
        OutputFormat: "mp3",
        Text: "Test text",
        VoiceId: "Salli",
      });
      return callback(failResult);
    });

    const paramsTest = "Test text";
    const { result } = renderHook(() => useDeleteS3Object());
    const { deleteS3Object } = result.current;

    await act(async () => {
      const finalResponse = await deleteS3Object(paramsTest);
      expect(finalResponse).toEqual(failResult);
    });
  });
});
