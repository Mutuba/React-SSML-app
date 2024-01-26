import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

const logo = { alt: "logo" };

jest.mock("../../src/assets/logo.png", () => "logo.png");

describe("Header", () => {
  test("renders logo image", () => {
    render(<Header />);
    const logoImage = screen.getByAltText(logo.alt);
    expect(logoImage).toBeInTheDocument();
    expect(logoImage.src).toContain("logo.png");
    expect(logoImage).toHaveAttribute("src", "logo.png");
  });
});
