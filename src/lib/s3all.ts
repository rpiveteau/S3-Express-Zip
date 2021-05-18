import async from 'async';
import https from "https";

const zipstream = require('zip-stream');

const defaultZipOptions = {
  store: true
};

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

export default (s3: any, s3Options = {}, zipOptions = {}, files: any[], filename: any, cb: any, res: any) => {
  s3.config.update({...defaultS3Options, ...s3Options});
  const zip = zipstream({...defaultZipOptions, ...zipOptions});
  zip.pipe(res);

  const addFile = function(file: any, cb: any) {
    zip.entry(file.stream, { name: file.name }, cb);
  };

  async.forEachSeries(files, addFile, function(err) {
    if (err) return cb(err);
    zip.finalize();
    cb(null, zip.getBytesWritten());
  });
}
