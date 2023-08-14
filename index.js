// run `node index.js` in the terminal
console.log('Word generator');
console.log('Fetching dictionary...');

const fsPromises = require('fs').promises;

const requester = require('./request_dict');
const indexer = require('./indexer');
const createIndexedDict = indexer.createIndexedDict;
const { findConnectors } = require('./connectors');
const { Trie } = require('./trie');

function initWordsets(wordsets) {
	const ordered = wordsets.slice(0, 1);
	for (let i = 1; i < wordsets.length; ++i) {
		const chars = wordsets[i].split('');
		const prevChars = ordered[i - 1].split('');

		let node;
		let charIndex;
		let result = '';
		while (chars.length > 0) {
			let charToAdd;
			if (prevChars.length > 0) {
				node = prevChars.shift();
				charIndex = chars.indexOf(node);
				if (charIndex === -1) {
					throw new Error('All prev chars must exist in current chars');
				}
				charToAdd = chars.splice(charIndex, 1)[0];
			} else {
				charToAdd = chars.shift();
			}
			result = result + charToAdd;
		}

		ordered.push(result);
	}
	return ordered;
}

const INPUT =
	'prime impure premium prim mire rip umpire pi absolutely empire cheese dim mid dime idem deism dimes missed misused surmised';
requester
	.requestDict()
	.then(res => {
		console.log('Succesfully fetched dictionary');
		console.log('Generating csv...');

		const trie = new Trie();
		const indexed = createIndexedDict(res);
		for (const key in indexed) {
			trie.insert(key);
		}
		const connectors = findConnectors(indexed);

		let data = '';
		let count = 0;

		const endWords = {};
		for (let i = 0; i < connectors.length; ++i) {
			const connx = connectors[i];
			const key = connx[connx.length - 1];
			endWords[key] = 0;
		}

		const dataSet = new Map();

		for (let i = 0; i < connectors.length; ++i) {
			++count;
			let answers = [];
			let wordsets = [];
			const connx = connectors[i];
			const key = connx[connx.length - 1];
			for (const ok of connx) {
				answers.push(indexed[ok]);
				wordsets.push(ok);
			}
			answers = Array.prototype.concat.apply([], answers);
			answers = answers.filter((item, index, list) => list.indexOf(item) === index);

			wordsets = initWordsets(
				wordsets.filter((item, index, list) => list.indexOf(item) === index)
			).join('|');

			if (answers.length > endWords[key]) {
				endWords[key] = answers.length;
				dataSet.set(key, wordsets + ',' + answers.join('|'));
			}
		}

		let kk = 0;

		console.log('No of sets found: ' + dataSet.size);
		const randomIndex = Math.floor(Math.random() * dataSet.size);

		for (const value of dataSet.values()) {
			data += value + '\n';
			++kk;
			if (kk === randomIndex) {
				console.log('Random set: ' + value);
			}
		}
		console.log(kk, randomIndex);

		fsPromises
			.writeFile('games.csv', data)
			.then(() => {
				console.log('CSV file complete.');
			})
			.catch(err => {
				console.error('Error writing to CSV file', err);
			});
	})
	.catch(err => {
		console.error('Error fetcing dictionary', err);
	});
