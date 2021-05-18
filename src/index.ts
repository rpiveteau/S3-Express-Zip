import async from 'async';
import {WriteStream} from 'fs';

const zipstream = require('zip-stream');
const defaultZipOptions = {
  store: true
};

export default ({res, zipOptions}: { res: WriteStream|any; zipOptions?: {[key: string]: any} }) => {
  if (!res) {
    throw new Error('Missing witable stream in entry');
  }

  const zip = zipstream({...defaultZipOptions, ...zipOptions});
  zip.pipe(res);

  return (files: any[], cb: (error?: any, data?: any) => void = function(){}) => {
    if (!files) {
      throw new Error('Missing files to zip');
    }
    cb = cb || function (){}

    console.log("--------------------",files,"--------------------")

    const addFile = function(file: any, cb: any) {
      console.log('Adding file ....')
      zip.entry(file.stream, { name: file.name }, cb);
    };

    async.forEachSeries(files, addFile, function(err) {
      if (err)
        return cb(err);
      zip.finalize();
      cb(null, zip.getBytesWritten());
    });
  }
}

export {
  getS3ObjectsList,
  getHTTPHeaders,
  getS3ObjectStream
} from './lib';
