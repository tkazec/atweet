"use strict";

var fs = require("fs");

var ff = require("ff");
var Twit = require("twit");

var tkazec = require("./tkazec.json");

var T = new Twit(tkazec.auth);

/*T.get("account/totals", function (err, res) {
	res.updates;
});*/

var getTweets = function (since, max, next) {
	T.get("statuses/user_timeline", {
		since_id: since,
		max_id: max,
		count: 200,
		trim_user: true,
		include_rts: true,
		include_entities: true
	}, next);
};

var f = ff(function () {
	var since;
	var max;
	var group = f.group();
	
	getTweets(since, max, ff());
}, function (res) {
	var tweets = Array.prototype.concat.apply(tkazec.tweets, res);
	
	fs.writeFile("tkazec.json", tweets, f(tweets.length));
}).cb(function (err, tweets) {
	console.log("Wrote", tweets.length, "tweets.", err);
});