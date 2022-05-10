const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();

const { generateId } = require("../mess");
const { loadJSON, saveJSON } = require("../json_manip");

// users folder
const users = "private/users";

// Register a new user
module.exports = async (req, res) => {
	// Get the user's data
	const { email, password } = req.body;

	// create user id and path
	const id = generateId();
	const path = `${users}/${id}.json`;

	// check if id already exists
	const existId = fs.existsSync(path);

	let existEmail;

	// if id not exists, check if email already exists
	if (!existId) {
		// get all users
		const users_list = fs.readdirSync(users);

		existEmail = users_list.some(user => {
			const user_path = `${users}/${user}`;
			const user_data = loadJSON(user_path);
			return user_data.email === email;
		});

		// if email already exists, return error
		if (existEmail) {
			res.status(400).send("Email already exists");
			return;
		} else {
			// if email not exists, create user
			const user = {
				id,
				email,
				nickname: "",
				password: await bcrypt.hash(password, 10),
				conversations: [],
				messages: [],
			};

			// save user
			saveJSON(path, user);

			// send success message
			res.status(200).send("User created");
		}
	} else {
		res.status(400).send("Id already exists");
		return;
	}
};
