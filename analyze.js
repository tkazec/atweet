"use strict";

var moment = require("moment");

module.exports = function (tweets) {
	var beginning = moment(tweets[tweets.length - 1].created_at);
	var timeline = [];
	
	tweets.forEach(function (tweet) {
		var i = moment(tweet.created_at).diff(beginning, 'days');
		timeline[i] = (timeline[i] || 0) + 1;
	});
	
	return {
		count: tweets.length,
		beginning: beginning,
		timeline: timeline
	};
};