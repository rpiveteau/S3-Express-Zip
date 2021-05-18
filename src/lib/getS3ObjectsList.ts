export const getS3ObjectsList = async (s3: any, Bucket: string, Prefix: string, rewriteFileName: (filename: string, prefix: string) => string = filename => filename) => new Promise<{Key: string; Size: number; Bucket: string;}[]|any[]>(resolve => {
  return s3.listObjects({Bucket, Prefix}, (err: any, data: any) => {
    if (err)
      return resolve([err])
    resolve(data.Contents?.map((f: any) => ({Key: f.Key, Size: f.Size, Bucket, Name: rewriteFileName(f.Key, Prefix)})));
  })
})
