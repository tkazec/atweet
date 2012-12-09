"use strict";

var moment = require("moment");

module.exports = function (tweets) {
	var data = {
		count: {
			total: tweets.length,
			tweets: 0,
			retweets: 0,
			replies: 0,
			hashtags: 0
		},
		beginning: tweets[tweets.length - 1].created_at,
		timeline: [],
		words: {},
		hashtags: {},
		friends: {}
	};
	
	tweets.forEach(function (tweet) {
		var i = moment(tweet.created_at).diff(data.beginning, "days");
		
		var day = data.timeline[i] || {
			tweets: 0,
			retweets: 0,
			replies: 0
		};
		
		if (tweet.in_reply_to_user_id_str) {
			data.count.replies++;
			day.replies++;
			
			// tweet.in_reply_to_screen_name
		} else if (tweet.retweeted_status) {
			data.count.retweets++;
			day.retweets++;
			
			// tweet.retweeted_status.user.id_str
		} else {
			data.count.tweets++;
			day.tweets++;
			
			if (tweet.entities.hashtags.length) {
				data.count.hashtags++;
				
				tweet.entities.hashtags.forEach(function (hashtag) {
					data.hashtags[hashtag.text] = (data.hashtags[hashtag.text] || 0) + 1;
				});
			}
		}
		
		data.timeline[i] = day;
	});
	
	return data;
};