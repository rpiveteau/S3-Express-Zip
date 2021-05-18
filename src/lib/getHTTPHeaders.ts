
export const getHTTPHeaders = (objects: any[], archiveName:string = `archive-${(new Date()).getTime()}.zip`) => {
  const totalSize = objects.reduce((acc, obj) => acc + obj.Size, 0);
  const fileNames = (objects.map((obj) => obj.Name));
  const fileNameSize = fileNames.join('').length
  const archiveSize = ((objects.length * (30 + 16 + 46) + 2 * fileNameSize + objects.length + 22) - objects.length) + totalSize;

  return {
    'Content-Length': `${archiveSize}`,
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename="${archiveName}"`
  }
}
