const express = require("express");

const register = require("./controllers/register");

// Route function called by both http and https servers
module.exports = function route(app) {
	// Global
	app.use("/", express.static("public"));

	// API
	app.post("/api/register", register);

	// 404
	app.get("*", (req, res) => {
		res.status(404).sendFile("404.html", { root: __dirname });
	});
};
