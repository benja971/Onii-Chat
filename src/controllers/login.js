const fs = require("fs");
const bcrypt = require("bcrypt");
require("dotenv").config();

const { loadJSON } = require("../json_manip");

/**
 *
 * @param {Request} req
 * @param {Response} res
 *
 * req.body.email - user email
 * req.body.password - user password
 *
 * @returns {Boolean} - true if user exists and password is correct
 *
 * function that ask a user email and password and returns true if user exists and password is correct
 */
module.exports = function login(req, res) {
	const { email, password } = req.body;

	// get the user list
	const user_list = fs.readdirSync("private/users");

	// check if the user exists
	const user_exists = user_list.some(async file => {
		const user = loadJSON(`private/users/${file}`);

		const same_email = user.email === email;
		const same_password = await bcrypt.compareSync(password, user.password);

		return same_email && same_password;
	});

	// if not, return and send an error
	if (!user_exists) {
		res.status(404).send("User not found");
		return;
	}

	res.status(200).send("Connected");
};
