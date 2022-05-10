function generateId() {
	return new Date().getTime().toString(16).slice(-6, -1);
}

module.exports = {
	generateId,
};
