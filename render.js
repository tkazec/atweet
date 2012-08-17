"use strict";

var fs = require("fs");

var ff = require("ff");
var jade = require("jade");

var analyze = require("./analyze");
var user = require("./gen/tkazec");

var f = ff(function () {
	jade.renderFile("stats.jade", analyze(user), f());
}, function (html) {
	fs.writeFile("gen/stats.html", html, f());
}).cb(function (err) {
	console.log("All done!", err);
});