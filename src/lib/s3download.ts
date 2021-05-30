import https from "https";

const defaultS3Options = {
  httpOptions: {
    timeout: 60_000 * 60 * 24,
    agent: new https.Agent({
      timeout: 60_000 * 60 * 24,
      maxTotalSockets: 100,
      maxSockets: 1,
    })
  },
  correctClockSkew: true
};

export default async (  {s3, s3Options, Bucket, Prefix}:
                  {s3: any; s3Options: any; Bucket: string; Prefix: string}
                  = {s3: {}, s3Options: {}, Bucket: '', Prefix: ''}
                ) => {
  s3.config.update({...defaultS3Options, s3Options});
  const objects = (await getObjectsList(s3, Bucket, Prefix))
}

const getObjectsList = async (s3: any, Bucket: string, Prefix: string) => new Promise<{Key: string; Size: number; Bucket: string;}[]|any[]>(resolve => {
  return s3.listObjects({Bucket, Prefix}, (err: any, data: any) => {
    if (err)
      return resolve([err])
    resolve(data.Contents?.map((f: any) => ({Key: f.Key, Size: f.Size, Bucket})));
  })
})
const getStream = (s3: any, object: {Bucket: string; Key: string;}) => s3.getObject(object).createReadStream()

export {
  getStream,
  getObjectsList
}
