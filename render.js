"use strict";

var fs = require("fs");

var ff = require("ff");
var jade = require("jade");
var less = require("less");

var analyze = require("./analyze");

var user = require("./gen/tkazec");

var f = ff(function () {
	less.render("@import 'stats';", {
		paths: [__dirname + "/static"],
		compress: true
	}, f());
	
	fs.readFile(__dirname + "/static/d3.js", "utf8", f());
	fs.readFile(__dirname + "/static/stats.js", "utf8", f());
}, function (css, d3, js) {
	jade.renderFile(__dirname + "/static/stats.jade", {
		css: css,
		js: d3 + js,
		info: user.info,
		data: analyze(user.tweets)
	}, f());
}, function (html) {
	fs.writeFile(__dirname + "/gen/stats.html", html, f());
}).cb(function (err) {
	console.log("All done!", err);
});