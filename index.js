// run `node index.js` in the terminal

console.log(`Write answers to csv!`);

const fsPromises = require('fs').promises;

const requester = require('./request_dict');
const indexer = require('./indexer');
const createIndexedDict = indexer.createIndexedDict;
const { findConnectors } = require('./connectors');
const { Trie } = require('./trie');

requester
  .requestDict()
  .then((res) => {
    const trie = new Trie();
    const indexed = createIndexedDict(res);
    for (const key in indexed) {
      trie.insert(key);
    }
    const connectors = findConnectors(indexed);

    let answers = [];
    let index = 0;
    for (const ok of connectors[0]) {
      // console.log(index, indexed[ok]);
      // answers += indexed[ok].join('|');
      answers.push(indexed[ok]);
      console.log(index, answers);
      ++index;
    }
    answers = Array.prototype.concat.apply([], answers);
    answers = answers
      .filter((item, index, list) => list.indexOf(item) === index)
      .join('|');
    console.log(answers);

    const data = answers;

    fsPromises
      .writeFile('games.csv', answers)
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
