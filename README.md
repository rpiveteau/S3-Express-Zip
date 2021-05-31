# S3-Express-Zip
```typescript
import S3ExpressZip, {getS3ObjectsList, getS3ObjectStream, getHTTPHeaders} from 's3-express-zip';
import {PassThrough} from 'stream';
import https from "https";
import {S3} from 'aws-sdk';

const configS3 = {
    endpoint: 'BUCKET_ENDPOINT',
    region: 'BUCKET_REGION',
    accessKeyId: 'ACCESS_KEY_ID',
    secretAccessKey: 'SECRET_ACCESS_KEY'
};

const s3 = new S3({
    endpoint: 'BUCKET_ENDPOINT',
    accessKeyId: 'ACCESS_KEY_ID',
    secretAccessKey: 'SECRET_ACCESS_KEY',
});

s3.config.update(configS3);
const Bucket = 'BUCKET_NAME';
const Prefix = 'BUCKET_PREFIX';

function cb(error: any, data: any) {
    console.log(
      '-----------------',
      `|ZIP CB ${error ? 'ERROR' : 'SUCCES'}|`,
      error || `${data}o archived`,
      `|END CB ${error ? 'ERROR' : 'SUCCES'}|`,
      '-----------------',
    )
}
/**
  res should be a writable stream
*/
async function downloadFromS3KeepingPrefix(req, res) {
    // Default archive name:
    const archiveName = `archive-${(new Date()).getTime()}.zip`;
    // Retrieving objects from Bucket
    const objects = await getS3ObjectsList(s3, Bucket, Prefix);
    // Getting headers for HTTP Response if needed
    const headers: {[key: string]: string} = getHTTPHeaders(objectsList, archiveName);
    // Setting headers for HTTP Response if needed
    (Object.keys(headers))
      .forEach((headerKey: string) => res.setHeader(headerKey, headers[headerKey]));
  
    // Finally send stream archive to client (or any writable stream)  
    S3ExpressZip({res})(objects.map((f:any) => getS3ObjectStream(s3, f)), cb)
}

/**
  res should be a writable stream
*/
async function downloadFromS3RemovingPrefix(req, res) {
    // Default archive name:
    const archiveName = `archive-${(new Date()).getTime()}.zip`;
    /**
      Retrieving objects from Bucket
      You can remove prefix from filename in archive, or filter the objects..
      If you use the Content-Length property header, 
      you have to remove Prefix from filename before getting httpHeaders
      else, the Content-Length will missmatch and HTTP Request fail
    */
    const objects = (await getS3ObjectsList(s3, Bucket, Prefix))
        .map((obj: any) => ({
            ...obj,
            Name: obj.Key.split(`${Prefix}/`).join('')
        }));
    // Getting headers for HTTP Response if needed
    const headers: {[key: string]: string} = getHTTPHeaders(objectsList, archiveName);
    // Setting headers for HTTP Response if needed
    (Object.keys(headers))
      .forEach((headerKey: string) => res.setHeader(headerKey, headers[headerKey]));

    // Finally send stream archive to client (or any writable stream)
    S3ExpressZip({res})(objects.map((f:any) => getS3ObjectStream(s3, f)), cb)
}

```





