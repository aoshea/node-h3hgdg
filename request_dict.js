const fs = require('fs');
const path = require('path');
const DICT_FILE = '3of6game.txt';

module.exports = {
	requestDict
};

function requestDict() {
	return new Promise((resolve, reject) => {
		fs.readFile(path.join(__dirname, DICT_FILE), 'utf8', (err, data) => {
			if (err) {
				reject('Error loading file:' + err);
			}
			resolve(data);
		});
	});
}
