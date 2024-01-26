import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Section from "../components/Section";

describe("Section", () => {
  test("should render", () => {
    render(
      <Section
        text="Sample text"
        setText={() => {}}
        ssml={false}
        setSSML={() => {}}
      />
    );
    const textInput = screen.getByRole("textbox");
    const checkbox = screen.getByRole("checkbox");
    expect(textInput).toBeInTheDocument();
    expect(checkbox).toBeInTheDocument();
  });

  test("updates text state on input change", () => {
    const setTextMock = jest.fn();
    render(
      <Section
        text="Sample text"
        setText={setTextMock}
        ssml={false}
        setSSML={() => {}}
      />
    );
    const textInput = screen.getByRole("textbox");
    fireEvent.change(textInput, { target: { value: "New text" } });
    expect(setTextMock).toHaveBeenCalledWith("New text");
  });

  test("updates ssml state on checkbox switch", () => {
    const setSSMLMock = jest.fn();
    render(
      <Section
        text="Sample text"
        setText={() => {}}
        ssml={false}
        setSSML={setSSMLMock}
      />
    );
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);
    expect(setSSMLMock).toHaveBeenCalledWith(true);
  });

  test("Updates ssml state to true if initially false", () => {
    const setSSMLMock = jest.fn();

    render(
      <Section
        ssml={false}
        setText={() => {}}
        setSSML={setSSMLMock}
        text="Sample text"
      />
    );
    const checkbox = screen.getByRole("checkbox");
    userEvent.click(checkbox);
    expect(setSSMLMock).toHaveBeenCalledWith(true);
  });

  test("Updates ssml state to false if initially true", () => {
    const setSSMLMock = jest.fn();

    render(
      <Section
        ssml={true}
        setText={() => {}}
        setSSML={setSSMLMock}
        text="Sample text"
      />
    );
    const checkbox = screen.getByRole("checkbox");
    userEvent.click(checkbox);
    expect(setSSMLMock).toHaveBeenCalledWith(false);
  });
});
