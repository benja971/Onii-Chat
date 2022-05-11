const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");
require("dotenv").config();

const { saveJSON, loadJSON } = require("../json_manip");
const { generateId } = require("../mess");

async function test(req, res) {
	const { token } = req.query;

	// verify the token
	const decoded = await jwt.verify(token, process.env.JWT_SECRET);

	// check if token was valid
	if (!decoded) {
		res.status(498).send("Token not valid");
		return;
	}

	// first get all user files
	const users_list = fs.readdirSync("private/users");

	// then check if email already exists in the files
	const exists = users_list.some(user => {
		const user_path = `private/users/${user}`;
		const user_data = loadJSON(user_path);

		return user_data.email === decoded.email || user_data.id === decoded.id;
	});

	// if user already exists, send error message
	if (exists) {
		res.status(409).send("Email or id already exists");
		return;
	}

	// create the user's path
	const path = `private/users/${decoded.id}.json`;

	// create the user
	const user = {
		id: decoded.id,
		email: decoded.email,
		nickname: "",
		password: decoded.password,
		conversations: [],
		contacts: [],
	};

	// save the user
	saveJSON(path, user);

	// if user was created, send success message else send error message
	if (fs.existsSync(path)) res.status(201).send("User created");
	else res.status(500).send("User not created");
}

async function sendMail(req, res) {
	const { email, password } = req.body;

	// generate an user id
	const id = generateId();

	// first get all user files
	const users_list = fs.readdirSync("private/users");

	// then check if email already exists in the files
	const exists = users_list.some(user => {
		const user_path = `private/users/${user}`;
		const user_data = loadJSON(user_path);

		return user_data.email === email || user_data.id === id;
	});

	// if user already exists, send error message
	if (exists) {
		res.status(409).send("Email or id already exists");
		return;
	}

	// create a nodemailer transporter
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true,
		auth: {
			user: "benja.niddam@gmail.com",
			pass: "P2fVWj<i3mW]47]",
		},
	});

	// secure the password
	const hash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

	// create a token
	const token = jwt.sign({ id, email, password: hash }, process.env.JWT_SECRET, { expiresIn: "1d" });

	// create the mail
	const mailOptions = {
		from: "benja.niddam@gmail.com",
		to: email,
		subject: "Sending Email using Node.js",
		html: `<p>Hello, click on the following link to validate your email.</p><br>
                <a href="http://localhost/api/verifyEmail?token=${token}">Validate Email</a>
        </p>`,
	};

	// send the mail
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			res.send({ error });
		} else {
			res.send("Email sent: " + info.response);
		}
	});
}

module.exports = {
	test,
	sendMail,
};
