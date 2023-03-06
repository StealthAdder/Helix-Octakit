/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import exec from '../utils/exec.util';

const bumpVersion = async (base: string, fileName: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName, 'utf8', (err: any, data: any) => {
      if (err) return console.error('error', err);

      const parsedData = JSON.parse(data);

      const current_version = parsedData.version;
      const semVeri = current_version.split('.');
      const major = semVeri[0];
      const minor = semVeri[1];
      const patch = semVeri[2];

      let new_version;
      if (base === 'main') {
        new_version = `${major}.${Number(minor) + 1}.0`;
      } else {
        new_version = `${major}.${minor}.${Number(patch) + 1}`
      }

      parsedData.version = new_version;

      // console.log(parsedData);

      fs.writeFile(fileName, JSON.stringify(parsedData), async (err: any) => {
        if (err) return reject(err);

        await exec(`prettier --write --tab-width 2 ${fileName}`);
        console.log('success');
        resolve(parsedData);
      });
    });
  });
}

export default bumpVersion;