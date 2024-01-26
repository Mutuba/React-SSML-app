import AWS from "aws-sdk"; // Import AWS SDK
import useTextToSpeech from "../../hooks/useTextToSpeech";

jest.mock("aws-sdk");

test("calls AWS Polly with correct parameters", () => {
  jest.useFakeTimers(); // Use fake timers for better control

  const mockPolly = AWS.Polly.mockImplementation(() => ({
    synthesizeSpeech: jest.fn(),
  }));
  const { convertTextToSpeech } = useTextToSpeech();
  convertTextToSpeech("test text", false);

  jest.runAllTimers(); // Ensure timers are executed

  expect(mockPolly).toHaveBeenCalledWith({
    Text: "test text",
    OutputFormat: "mp3",
    VoiceId: "Salli",
  });
});
