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
      AudioStream: ["Buffer"],
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
});

// import AWSMock from "aws-sdk-mock";
// import AWS from "aws-sdk";
// import { renderHook, act } from "@testing-library/react";
// import useTextToSpeech from "../../hooks/useTextToSpeech";

// describe("Test Delete S3 object", () => {
//   beforeEach(() => {
//     AWSMock.setSDKInstance(AWS);
//   });

//   afterEach(() => {
//     AWSMock.restore("Polly");
//   });

//   it("Should be successfully completed", async () => {
//     const successResult = { success: true };
//     AWSMock.mock("Polly", "synthesizeSpeech", (params, callback) => {
//       expect(params).toEqual({
//         OutputFormat: "mp3",
//         Text: "Test text",
//         VoiceId: "Salli",
//       });
//       return callback(null, successResult);
//     });

//     const paramsTest = "Test text";
//     const { result } = renderHook(() => useTextToSpeech());
//     const { convertTextToSpeech } = result.current;

//     await act(async () => {
//       const finalResponse = await convertTextToSpeech(paramsTest);
//       expect(finalResponse).toBe(successResult);
//     });
//   });

//   it("Should fail", async () => {
//     const failResult = { success: false };
//     AWSMock.mock("Polly", "synthesizeSpeech", (params, callback) => {
//       expect(params).toEqual({
//         OutputFormat: "mp3",
//         Text: "Test text",
//         VoiceId: "Salli",
//       });
//       return callback(failResult);
//     });

//     const paramsTest = "Test text";
//     const { result } = renderHook(() => useTextToSpeech());
//     const { convertTextToSpeech } = result.current;

//     await act(async () => {
//       const finalResponse = await convertTextToSpeech(paramsTest);
//       expect(finalResponse).toEqual(failResult);
//     });
//   });
// });
