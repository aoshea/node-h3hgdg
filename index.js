// run `node index.js` in the terminal

console.log(`!Hello Node.js v${process.versions.node}!`);

const requester = require('./request_dict');
const indexer = require('./indexer');
const createIndexedDict = indexer.createIndexedDict;
const { Trie } = require('./trie');

requester
  .requestDict()
  .then((res) => {
    const trie = new Trie();
    const indexed = createIndexedDict(res);
    for (const key in indexed) {
      trie.insert(key);
    }
    // console.log('then res', res);
    console.log('resolved', trie);
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
