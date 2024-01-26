import AWS from "aws-sdk";
import useTextToSpeech from "../../hooks/useTextToSpeech";

jest.mock("aws-sdk");

test("calls AWS Polly with correct parameters", () => {
  jest.useFakeTimers();

  const mockPolly = AWS.Polly.mockImplementation(() => ({
    synthesizeSpeech: jest.fn(),
  }));
  const { convertTextToSpeech } = useTextToSpeech();
  convertTextToSpeech("test text", false);

  jest.runAllTimers();

  expect(mockPolly).toHaveBeenCalledWith({
    Text: "test text",
    OutputFormat: "mp3",
    VoiceId: "Salli",
  });
});
