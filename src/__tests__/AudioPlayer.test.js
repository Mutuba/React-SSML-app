import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AudioPlayer from "../components/AudioPlayer";
global.fetch = jest.fn();

describe("AudioPlayer", () => {
  // jest.mock("../../hooks/useTextToSpeech.js");

  test("renders player controls, progress bar, and time info", async () => {
    const resolvedData = {
      articles: {
        title: "UNRWA Hamas attack claims: UK becomes latest country to pause",
      },

      title: "Aryna Sabalenka beats Zheng Qinwen for Australian Open women’s ",
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
  });
});
