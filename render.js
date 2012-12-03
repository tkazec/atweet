"use strict";

var fs = require("fs");

var ff = require("ff");
var jade = require("jade");
var less = require("less");

var user = require("./gen/tkazec");

var f = ff(function () {
	less.render("@import 'stats';", {
		paths: [__dirname + "/static"],
		compress: true
	}, f());
}, function (css) {
	jade.renderFile(__dirname + "/static/stats.jade", {
		css: css,
		info: user.info
	}, f());
}, function (html) {
	fs.writeFile(__dirname + "/gen/stats.html", html, f());
}).cb(function (err) {
	console.log("All done!", err);
});