export function createIndexedDict(dict, splitter = '\n') {
  const x = {};
  const lines = dict.split(splitter);
  for (const line of lines) {
    const sanitized = line.replace(/[-\n\r]+/g, '');
    const sorted_index = sanitized.split('').sort().join('');
    if (x[sorted_index]) {
      x[sorted_index].push(sanitized);
    } else {
      x[sorted_index] = [sanitized];
    }
  }
  return x;
}

export function truncateIndexedDict(indexed, min: number, max: number) {
  const x = {};
  for (const entry of Object.entries(indexed)) {
    const [key, value] = entry;
    if (key.length >= min && key.length <= max) {
      x[key] = value;
    }
  }
  return x;
}

export function removeCharAtIndex(x: string, index: number) {
  return x.slice(0, index).concat(x.slice(index + 1));
}

export function getRemovedCharList(x: string) {
  const result = [];
  const len = x.length;
  for (let i = 0; i < len; ++i) {
    result.push(removeCharAtIndex(x, i));
  }
  return result.filter((el, index, arr) => arr.indexOf(el) === index);
}
