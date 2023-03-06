import https from 'https';
import fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getFile = async (url: string | any, dest: string, cb: any) => {
  const file = fs.createWriteStream(dest);
  https.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(cb);
    });
  });
};

export default getFile;