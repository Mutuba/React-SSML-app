import { renderHook, waitFor } from "@testing-library/react";

import useFetchedData from "../../hooks/useFetchedData";

global.fetch = jest.fn();

describe("useFetchedData", () => {
  it("should return the initial values for data, error and loading", async () => {
    const { result } = renderHook(() => useFetchedData());
    const { data, error, loading } = result.current;
    await waitFor(() => {
      expect(data).toBe(null);
    });

    await waitFor(() => {
      expect(error).toBe(null);
    });

    await waitFor(() => {
      expect(loading).toBe(true);
    });
  });
});

describe("when data is fetched successfully", () => {
  let mockedData;

  beforeEach(() => {
    mockedData = [
      {
        body: "mocked body",
        id: 1,
        title: "mock title",
        userId: 1,
      },
    ];

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockedData),
    });
  });

  it("should return data", async () => {
    const { result } = renderHook(() => useFetchedData());

    await waitFor(() =>
      expect(result.current).toEqual({
        data: mockedData,
        error: null,
        loading: false,
      })
    );
  });
});

describe("the loading property", () => {
  it("should initially return true and then false", async () => {
    const { result } = renderHook(() => useFetchedData());
    const { loading } = result.current;

    expect(loading).toBe(true);

    await waitFor(() => {
      const { loading } = result.current;

      expect(loading).toBe(false);
    });
  });
});

describe("when data is not fetched successfully", () => {
  const mockedError = new Error("mocked error");

  beforeEach(() => {
    fetch.mockRejectedValue(mockedError);
  });

  it("should return the Error", async () => {
    const { result } = renderHook(() => useFetchedData());

    await waitFor(() => {
      const { error } = result.current;
      expect(error).toBe(mockedError);
    });
  });
});
