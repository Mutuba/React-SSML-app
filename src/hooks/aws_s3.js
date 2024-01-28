const AWS = require("aws-sdk");

function s3Service(configService) {
  const s3 = new AWS.S3({
    accessKeyId: configService.get(""),
    secretAccessKey: configService.get(""),
    region: configService.get(""),
  });
  const bucket = configService.get("");

  async function upload(name, contentType, buffer) {
    const params = { Bucket: bucket, Key: "key", Body: buffer };
    const upload = await s3.upload(params).promise();
    return upload;
  }

  return { upload };
}

module.exports = s3Service;
