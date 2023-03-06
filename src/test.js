/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const https = require('https');
const fs = require('fs');

(() => {
  var download = function (url, dest, cb) {
    var file = fs.createWriteStream(dest);
    https.get(url, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close(cb);
      });
    });
  }

  // 
  download('https://raw.githubusercontent.com/StealthAdder/git-version-test/main/package.json?token=A6HPZSP3RU33DLSY62KK7UDEAXBB3AVPNFXHG5DBNRWGC5DJN5XF62LEZYBBGFLXWFUW443UMFWGYYLUNFXW4X3UPFYGLN2JNZ2GKZ3SMF2GS33OJFXHG5DBNRWGC5DJN5XA', './text.txt', (cab) => {
    console.log(cab);
  });
})()