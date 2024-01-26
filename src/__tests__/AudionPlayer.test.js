import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AudioPlayer from "../components/AudioPlayer";

describe("AudioPlayer", () => {
  jest.mock("../hooks/useTextToSpeech.js");

  test("renders player controls, progress bar, and time info", () => {
    render(<AudioPlayer />);
    expect(screen.getByRole("button")).toBeInTheDocument(); // Play button
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByText("00:00/00:00")).toBeInTheDocument();
  });
  test("calls useTextToSpeech on play click", () => {
    const mockConvertTextToSpeech = jest.fn();
    useTextToSpeech.mockReturnValue({
      convertTextToSpeech: mockConvertTextToSpeech,
    });
    render(<AudioPlayer />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockConvertTextToSpeech).toHaveBeenCalled();
  });
});
