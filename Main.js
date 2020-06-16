const express = require("express");
const app = express();
const path = require("path");
const mysql = require("mysql");
const session = require("express-session");
const Router = require("./Router");
const MySQLStore = require("express-mysql-session")(session);

app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "",
	database: "react",
});
db.connect(function (err) {
	if (err) {
		throw err;
		return false;
	}
});

const sessionStore = new MySQLStore(
	{
		expiration: (1800000),
		endConnectionOnClose: false,
	},
	db
);
app.use(
	session({
		key: "yheyeryery4364ye4y43",
		secret: "yeryeryijpeoryjoeriyeryeryerye",
		store: sessionStore,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: (1800000), httpOnly: false },
	})
);

new Router(app, db);

app.get("/", function (req, res) {
	res.sendFile(path.join(__dirname, "build", "index.html"));
});
app.listen(3000);
