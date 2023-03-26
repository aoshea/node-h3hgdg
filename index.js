// run `node index.js` in the terminal

console.log(`Write answers to csv!`);

const fsPromises = require('fs').promises;

const requester = require('./request_dict');
const indexer = require('./indexer');
const createIndexedDict = indexer.createIndexedDict;
const { findConnectors } = require('./connectors');
const { Trie } = require('./trie');

function initWordsets(wordsets) {
  const ordered = wordsets.slice(0, 1);
  for (let i = 1; i < wordsets.length; ++i) {
    const x = wordsets[i];
    let prev = ordered[i - 1];
    const chars = x.split('');
    for (let j = 0; j < chars.length; ++j) {
      const ch = chars[j];
      if (prev.indexOf(ch) === -1) {
        prev = prev + ch;
      }
    }
    ordered.push(prev);
  }
  return ordered;
}

requester
  .requestDict()
  .then((res) => {
    const trie = new Trie();
    const indexed = createIndexedDict(res);
    for (const key in indexed) {
      trie.insert(key);
    }
    const connectors = findConnectors(indexed);

    let data = '';
    let count = 0;

    for (let i = 0; i < connectors.length; ++i) {
      ++count;
      let answers = [];
      let wordsets = [];
      const connx = connectors[i];
      for (const ok of connx) {
        answers.push(indexed[ok]);
        wordsets.push(ok);
      }
      answers = Array.prototype.concat.apply([], answers);
      answers = answers
        .filter((item, index, list) => list.indexOf(item) === index)
        .join('|');
      wordsets = initWordsets(
        wordsets.filter((item, index, list) => list.indexOf(item) === index)
      ).join('|');

      data += wordsets + ',' + answers + '\n';
    }

    fsPromises
      .writeFile('games.csv', data)
      .then((res) => {
        console.log('done writing', res);
      })
      .catch((err) => {
        console.error('error writing', err);
      });
  })
  .catch((err) => {
    console.log('catch err', err);
  });

/*
import { createIndexedDict } from './indexer';
import { requestDict } from './request_dict';
import { findConnectors } from './connectors';

const test_dict =
  'rip ripe prim prime impure premium mire umpire obelisk generators exhibitionist ab pi';
const indexed = createIndexedDict(test_dict, ' ');
for (const key in indexed) {
  trie.insert(key);
}
// console.log(findConnectors(indexed));

requestDict(function (res) {
  const indexed = createIndexedDict(res);
  for (const key in indexed) {
    trie.insert(key);
  }
  const connectors = findConnectors(indexed);
  console.log(connectors.length);
  for (const ok of connectors[0]) {
    console.log(indexed[ok]);
  }
});
*/
