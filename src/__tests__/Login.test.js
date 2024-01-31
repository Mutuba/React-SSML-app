// src/tests/Login.test.js

import React from "react";

import { render, screen } from "@testing-library/react";

import Login from "../components/Login";

jest.spyOn(React, "useEffect").mockImplementation((f) => f());

test("displays welcome message after successful login", () => {
  render(<Login />);

  const welcomeMessage = screen.getByText("Welcome, User!");

  expect(welcomeMessage).toBeInTheDocument();
});
