const https = require('https');

const DICT_ALT_12_URL =
  'https://raw.githubusercontent.com/en-wl/wordlist/master/alt12dicts/2of4brif.txt';

module.exports = {
  requestDict,
};

function requestDict(url = DICT_ALT_12_URL) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject('Error status code:' + res.statusCode);
      }
      let text = '';
      res.on('data', (chunk) => {
        text += chunk.toString();
      });
      res.on('end', () => {
        resolve(text);
      });
    });
    request.on('error', () => reject('Some errr'));
    request.end();
  });
}
