const { getRemovedCharList, truncateIndexedDict } = require('./indexer');
const MAX_LEN = 8;
const MIN_LEN = 3;

module.exports = {
  findConnectors,
};

function indexer(str, splitter = ' ', min = MIN_LEN, max = MAX_LEN) {
  const hashmap = {};
  const lines = str
    .split(splitter)
    .filter((x) => x.length >= min && x.length <= max);
  for (const line of lines) {
    const sanitized_line = line.replace(/[-\n\r]+/g, '');
    const sorted_line = sanitized_line.split('').sort().join('');
    if (hashmap[sorted_line]) {
      hashmap[sorted_line].push(sanitized_line);
    } else {
      hashmap[sorted_line] = [sanitized_line];
    }
  }
  return hashmap;
}

const INPUT =
  'prime impure premium prim mire rip umpire pi absolutely empire cheese';
const SPLITTER = ' ';

const indexed_dict = indexer(INPUT, SPLITTER, MIN_LEN, MAX_LEN);
const starters = Object.keys(indexed_dict).filter((x) => x.length === MAX_LEN);

const result = [];

function toNode(x, parent) {
  return {
    parent: parent,
    value: x,
    children: [],
    is_complete: x.length === 3,
  };
}

function findConnectors(indexed) {
  // so, filter out anything longer than max
  const truncated = truncateIndexedDict(indexed, MIN_LEN, MAX_LEN);
  // then pop off all max words
  const starters = Object.keys(truncated).filter((x) => x.length === MAX_LEN);
  // exclude 
  const result = [];

  for (const x of starters) {
    let node = toNode(x);
    node.children.push(...getRemovedCharList(x).map((x) => toNode(x, node)));

    const q = [...node.children];

    let curr = null;
    while (q.length > 0) {
      curr = q.pop();
      if (indexed[curr.value]) {
        if (curr.value.length > MIN_LEN) {
          const new_nodes = getRemovedCharList(curr.value).map((x) =>
            toNode(x, curr)
          );
          curr.children.push(...new_nodes);
          q.push(...new_nodes);
        } else {
          let printer = curr;
          let set = [curr.value];
          while (printer) {
            set.push(printer.value);
            printer = printer.parent;
          }
          result.push(set);
        }
      }
    }
  }

  return result;
}
