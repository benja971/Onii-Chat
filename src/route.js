const express = require("express");

const { test, sendMail } = require("./controllers/register");
const login = require("./controllers/login");
const { getUser, getContacts, getMessages } = require("./controllers/gets");

// Route function called by both http and https servers
module.exports = function route(app) {
	// Global
	app.use("/", express.static("public"));

	// API
	app.get("/api/verifyEmail", test);

	app.post("/api/sendEmail", sendMail);

	app.post("/api/login", login);

	app.get("/api/user", getUser);

	app.get("/api/getContacts", getContacts);

	app.get("/api/getMessages", getMessages);

	// 404
	app.get("*", (req, res) => {
		res.status(404).sendFile("404.html", { root: __dirname });
	});
};
