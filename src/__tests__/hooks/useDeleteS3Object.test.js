import AWSMock from "aws-sdk-mock";
import AWS from "aws-sdk";
import { renderHook, act } from "@testing-library/react";
import useDeleteS3Object from "../../hooks/useDeleteS3Object";

describe("Test Delete S3 object", () => {
  beforeEach(() => {
    AWSMock.setSDKInstance(AWS);
  });

  afterEach(() => {
    AWSMock.restore("S3");
  });

  it("Should be successfully completed", async () => {
    const successResult = { success: true };
    AWSMock.mock("S3", "deleteObject", (params, callback) => {
      expect(params).toEqual({ Bucket: "test", Key: "test" });
      return callback(null, successResult);
    });

    const paramsTest = { Bucket: "test", Key: "test" };

    const { result } = renderHook(() => useDeleteS3Object());
    const { deleteS3Object } = result.current;

    await act(async () => {
      const finalResponse = await deleteS3Object(paramsTest);
      expect(finalResponse).toBe(successResult);
    });
  });

  it("Should fail", async () => {
    const failResult = { success: false };
    AWSMock.mock("S3", "deleteObject", (params, callback) => {
      expect(params).toEqual({ Bucket: "test", Key: "test" });
      return callback(failResult);
    });

    const paramsTest = { Bucket: "test", Key: "test" };
    const { result } = renderHook(() => useDeleteS3Object());
    const { deleteS3Object } = result.current;

    await act(async () => {
      const finalResponse = await deleteS3Object(paramsTest);
      expect(finalResponse).toEqual(failResult);
    });
  });
});
