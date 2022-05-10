const fs = require("fs");

function loadJSON(path) {
	// return object if file exists
	if (fs.existsSync(path)) return require(`../${path}`);
}

function saveJSON(path, obj) {
	// write file
	fs.writeFileSync(path, JSON.stringify(obj, "\n", 4));
}

function editJSON(path, callback) {
	// read file
	const obj = loadJSON(path);

	// call the callback function
	callback(obj);

	// write file
	saveJSON(path, obj);
}

module.exports = {
	loadJSON,
	saveJSON,
	editJSON,
};
