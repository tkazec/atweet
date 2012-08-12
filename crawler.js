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
	var opts = {
		count: 200,
		trim_user: true,
		include_rts: true,
		include_entities: true
	};
	
	if (since) { opts.since_id = since; }
	if (max) { opts.max_id = max; }
	
	T.get("statuses/user_timeline", opts, next);
};

var f = ff(function () {
	var since;
	var max;
	
	getTweets(since, max, f());
}, function (res) {
	tkazec.tweets = Array.prototype.concat.apply(tkazec.tweets, res);
	
	fs.writeFile("tkazec.json", JSON.stringify(tkazec, null, "\t"), f(res.length));
}).success(function (tweets) {
	console.log("Wrote", tweets, "tweets.");
}).error(function (err) {
	console.log(err);
});