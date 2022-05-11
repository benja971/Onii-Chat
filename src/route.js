const express = require("express");

const { test, sendMail } = require("./controllers/register");

// Route function called by both http and https servers
module.exports = function route(app) {
	// Global
	app.use("/", express.static("public"));

	// API
	app.get("/api/verifyEmail", test);

	app.post("/api/sendEmail", sendMail);

	// 404
	app.get("*", (req, res) => {
		res.status(404).sendFile("404.html", { root: __dirname });
	});
};
