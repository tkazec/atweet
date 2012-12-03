"use strict";

var fs = require("fs");

var ff = require("ff");
var Twit = require("twit");

var user = require("./gen/tkazec.json");

var T = new Twit(user.auth);

var getTweets = function (since, max, next) {
	var opts = {
		count: 200,
		trim_user: true
	};
	
	if (since) { opts.since_id = since; }
	if (max) { opts.max_id = max; }
	
	T.get("statuses/user_timeline", opts, next);
};

var f = ff(function () {
	var group = [];
	
	var pull = function (max) {
		getTweets(user.tweets.length && user.tweets[0].id_str, max, recurse());
	};
	
	var process = function (res) {
		// If we've already got our initial batch of tweets, the first tweet in
		// res is going to be a duplicate. Remove it.
		if (group.length) {
			res.shift();
		}
		
		// If res is empty, we can be pretty sure we've reached the end.
		if (!res.length) {
			return recurse.slotPlain()(group);
		}
		
		// Otherwise, continue on, making sure to support the recursion.
		recurse.next(pull);
		recurse.next(process);
		
		// And add the tweets to the group.
		group = group.concat(res);
		
		// Finally, recurse, passing along the max_id.
		recurse.slotPlain()(res[res.length - 1].id_str);
	};
	
	var recurse = ff(pull, process).cb(f());
}, function (res) {
	user.tweets = res.concat(user.tweets);
	
	fs.writeFile("gen/tkazec.json", JSON.stringify(user, null, "\t"), f(res.length));
}).success(function (tweets) {
	console.log("Wrote", tweets, "tweets.");
}).error(function (err) {
	console.log("Something bad happened...", err);
});