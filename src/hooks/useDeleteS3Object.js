import AWS from "aws-sdk";

const useDeleteS3Object = () => {
  const deleteS3Object = async (bucketParams) => {
    const s3 = new AWS.S3();

    try {
      const s3DeleteResponse = await s3.deleteObject(bucketParams).promise();
      return s3DeleteResponse;
    } catch (error) {
      return error;
    }
  };
  return { deleteS3Object };
};

export default useDeleteS3Object;
