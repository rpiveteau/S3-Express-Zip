import S3ExpressZip, {getS3ObjectsList, getS3ObjectStream} from '../src';
import {PassThrough} from 'stream';
import https from "https";
import {S3} from 'aws-sdk';

const stream = new PassThrough();

const configS3 = {
  endpoint: 'https://s3.fr-par.scw.cloud',
  region: 'fr-par',
  accessKeyId: 'SCW0VPRSQ09VSR2HFJ0K',
  secretAccessKey: '7632e27b-7eac-44ba-84dc-c6fdaf125417',
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
  accessKeyId: 'SCW0VPRSQ09VSR2HFJ0K',
  secretAccessKey: '7632e27b-7eac-44ba-84dc-c6fdaf125417',
});
s3.config.update(configS3);
const Bucket = 'testroro';
const Prefix = 'justone';


getS3ObjectsList(s3, Bucket, Prefix).then((list: any) => {
  console.log(list)
  S3ExpressZip({res: stream})(list.map((f:any) => getS3ObjectStream(s3, f)), console.log);
});

