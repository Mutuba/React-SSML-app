import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AudioPlayer from "../components/AudioPlayer";
global.fetch = jest.fn();

describe("AudioPlayer", () => {
  test("renders player controls, progress bar, and time info", async () => {
    const resolvedData = {
      articles: [
        {
          title:
            "UNRWA Hamas attack claims: UK becomes latest country to pause",
        },
      ],
    };

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(resolvedData),
    });

    render(<AudioPlayer />);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Load More Content" })
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Clear Text" })
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).not.toHaveValue("");
    });

    await waitFor(() => {
      expect(screen.getByRole("textbox")).toHaveValue(
        resolvedData.articles.title
      );
    });
  });

  //   test("calls useTextToSpeech on play click", () => {
  //   const mockConvertTextToSpeech = jest.fn();
  //   useTextToSpeech.mockReturnValue({
  //     convertTextToSpeech: mockConvertTextToSpeech,
  //   });
  //   render(<AudioPlayer />);
  //   fireEvent.click(screen.getByRole("button"));
  //   expect(mockConvertTextToSpeech).toHaveBeenCalled();
  // });
});
