const { loadJSON } = require("../json_manip");

/**
 * @param {Request} req
 * @param {Response} res
 *
 * @returns {user} - user object
 *
 * function that ask a user id and returns the user object
 */
function getUser(req, res) {
	const { id } = req.query;

	// get the user from files
	const user = loadJSON(`private/users/${id}.json`);

	// check if user exists
	if (!user) {
		res.status(404).send("User not found");
		return;
	}

	res.status(200).json(user);
}
