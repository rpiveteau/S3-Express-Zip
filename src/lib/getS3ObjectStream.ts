export const getS3ObjectStream = (s3: any, object: {Bucket: string; Key: string; Name?: any, [key: string]: any}) => ({
  stream: s3.getObject({Bucket: object.Bucket, Key: object.Key}).createReadStream(),
  name: object.Name || object.Key
});
