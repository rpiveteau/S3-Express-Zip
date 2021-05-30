import S3ExpressZip, {getS3ObjectsList, getS3ObjectStream} from '../src';
import {PassThrough} from 'stream';
import https from "https";
import {S3} from 'aws-sdk';

const stream = new PassThrough();

const configS3 = {
  endpoint: 'https://s3.fr-par.scw.cloud',
  region: 'fr-par',
  accessKeyId: 'ACCESS_KEY_ID',
  secretAccessKey: 'SECRET_ACCESS_KEY',
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
const s3 = new S3({
  endpoint: 'https://s3.fr-par.scw.cloud',
  accessKeyId: 'ACCESS_KEY_ID',
  secretAccessKey: 'SECRET_ACCESS_KEY',
});
s3.config.update(configS3);
const Bucket = 'BUCKET_NAME';
const Prefix = 'BUCKET_PREFIX';

getS3ObjectsList(s3, Bucket, Prefix).then((list: any) => {
  S3ExpressZip({res: stream})(list.map((f:any) => getS3ObjectStream(s3, f)), console.log);
});

