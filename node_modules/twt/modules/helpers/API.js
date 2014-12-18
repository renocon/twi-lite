var Twit = require("Twit");

var TwitterExpandURL = require("twitter-expand-url");

function API(config){
	this.client = new Twit({
		consumer_key: config.TWT_CONSUMER_KEY,
		consumer_secret: config.TWT_CONSUMER_SECRET,
		access_token: config.TWT_ACCESS_TOKEN,
		access_token_secret: config.TWT_ACCESS_TOKEN_SECRET
	});
}

API.total_expand = 0;
API.expanded = 0;

function _process_data(data, cb){

	API.total_expand = data.length;

	for(var i = 0; i < data.length; i++){
		var expander = new TwitterExpandURL();
		expander.expand(i, data[i], {force: false}, function(err, id, results){
			if(err){
				return cb(err);
			}
			if(results && results.length > 0){
				for(var i = 0;i < results.length; i++){
					var result = results[i];
					data[id].text = data[id].text.replace(result.url, result.expanded_url);
				}
			}
			API.expanded ++;
			if(API.total_expand === API.expanded){
				return cb(null, data);
			}
		});
	}

}

function _parse_screen_name(screen_name){
	if(screen_name.indexOf("@") === 0){
		screen_name = screen_name.substring(1, screen_name.length)
	}
	return screen_name;
}

API.prototype.tweet = function(status, params, cb){
	if(status.length > 140){
		return cb(new Error("tweet is too long"));
	}
	this.client.post('statuses/update', {
		status: status
	}, function(err, data, response) {

		var message;

		if(err){
			message = "could not post tweet / " + err.message;
			return cb(new Error(message));
		}
		if(data){
			message = "tweet posted";
			return cb(null, {
				message: message,
				params: params
			});
		}
	});
}

API.prototype.follow = function(screen_name, params, cb){
	screen_name = _parse_screen_name(screen_name);
	this.client.post('friendships/create', {
		screen_name: screen_name
	}, function(err, data, response) {

		var message;

		if(err){
			message = "could not follow @" + screen_name + " / " + err.message
			if(err.statusCode === 403){
				message = "user @" + screen_name + " does not exist";
			}
			return cb(new Error(error));
		}

		if(data){
			message = "following " + screen_name;
			if(data.follow_request_sent){
				message = "request sent to @" + screen_name
			}
			return cb(null, {
				message: message,
				params: params
			});
		}

	});
}

API.prototype.unfollow = function(screen_name, params, cb){
	screen_name = _parse_screen_name(screen_name);
	this.client.post('friendships/destroy', {
		screen_name: screen_name
	}, function(err, data, response) {

		var message;

		if(err){
			message = "could not unfollow @" + screen_name +" / " + err.message
			return cb(new Error(message));
		}

		if(data){
			return cb(null, {
				message: "unfollowed @" + screen_name,
				params: params
			});
		}

	});
}

API.prototype.whois = function(screen_name, params, cb){
	screen_name = _parse_screen_name(screen_name);
	this.client.get('users/show', {
		screen_name: screen_name
	},(function(err, data, response) {

		var message;

		if(err){
			message = "could not get information on @" + screen_name + " / " + err.message
			if(err.statusCode === 404){
				message = "@" + screen_name + " does not exist";
			}
			return cb(new Error(message));
		}

		if(data){
			message = "displaying information on @" + screen_name;
			var url = "https://twitter.com/" + screen_name;
			return cb(null, {
				data: data,
				message: message,
				params: params,
				url: url
			});
		}

	}).bind(this));
}

API.prototype.search = function(query, params, cb){
	var flags = "";
	if(!params.retweets){
		flags += "+exclude:retweets";
	}
	if(!params.replies){
		flags += "+exclude:replies";
	}
	this.client.get('search/tweets', {
		q: query + flags,
		count: params.limit,
	},(function(err, data, response) {

		var message;

		if(err){
			message = "could not get tweets / " + err.message;
			return cb(new Error(message));
		}

		if(data){
			if(data.statuses.length === 0){
				message = "no tweets found for \"" + query + "\""
				return cb(new Error(message));
			}
			var message = "displaying " + params.limit + " latest search results for \"" + query + "\"";
			if(params.limit === 1){
				message = "displaying last search result for \"" + query + "\"";
			}
			var url = "https://twitter.com/search?f=realtime&q=" + encodeURIComponent(query + flags);
			_process_data.call(this, data.statuses, function(err, data){
				return cb(null, {
					data: data,
					message: message,
					params: params,
					url: url
				});
			});
		}

	}).bind(this));
}

API.prototype.home_timeline = function(params, cb){
	this.client.get('statuses/home_timeline', {
		count: params.limit,
		exclude_replies: !params.replies,
		include_rts: params.retweets
	}, (function(err, data, response) {

		var message;

		if(err){
			message = "could not get home timeline / " + err.message;
			return cb(new Error(message));
		}

		if(data){
			message = "displaying " + params.limit + " latest tweets on your timeline";
			if(params.limit === 1){
				message = "displaying last tweet on your timeline";
			}
			var url = "https://twitter.com";
			_process_data.call(this, data, function(err, data){
				return cb(null, {
					data: data,
					message: message,
					url: url
				});
			});
		}

	}).bind(this));
}

API.prototype.mentions_timeline = function(params, cb){
	this.client.get('statuses/mentions_timeline', {
		count: params.limit
	}, (function(err, data, response) {

		var message;

		if(err){
			message = "could not get mentions / " + err.message;
			return cb(new Error(message));
		}

		if(data){
			message = "displaying " + params.limit + " latest mentions";
			if(params.limit === 1){
				message = "displaying last mention";
			}
			var url = "https://twitter.com/mentions";
			_process_data.call(this, data, function(err, data){
				return cb(null, {
					data: data,
					message: message,
					params: params,
					url: url
				});
			});
		}

	}).bind(this));
}

API.prototype.list_timeline = function(screen_name, list_name, params, cb){
	screen_name = _parse_screen_name(screen_name);
	this.client.get('lists/statuses', {
		owner_screen_name: screen_name,
		slug: list_name,
		count: params.limit,
		exclude_replies: !params.replies,
		include_rts: params.retweets
	}, (function(err, data, response) {

		var message;

		if(err){
			message = "could not get list \"" +  list_name + "\" / " + err.message
			if(err.statusCode === 404){
				message = "list \"" + list_name + "\" does not exist";
			}
			return cb(new Error(message));
		}

		if(data){
			message = "displaying " + params.limit + " latest tweets in \"" + list_name + "\" list";
			if(params.limit === 1){
				message = "displaying last tweet in \"" + list_name + "\" list";
			}
			var url = "https://twitter.com/" + screen_name + "/lists/" + list_name;
			_process_data.call(this, data, function(err, data){
				return cb(null, {
					data: data,
					message: message,
					params: params,
					url: url
				});
			});
		}

	}).bind(this));
}

API.prototype.direct_messages = function(params, cb){
	this.client.get('direct_messages', {
		count: params.limit
	}, (function(err, data, response) {

		var message;

		if(err){
			message = "could not get mentions / " + err.message;
			return cb(new Error(message));
		}

		if(data){
			vmessage ="displaying " + params.limit + " latest direct messages";
			if(params.limit === 1){
				message = "displaying last direct message";
			}
			var url = "https://twitter.com/messages";
			_process_data.call(this, data, function(err, data){
				return cb(null, {
					data: data,
					message: message,
					dm: true,
					params: params,
					url: url
				});
			});
		}

	}).bind(this));
}

API.prototype.user_timeline = function(screen_name, params, cb){
	params.limit = params.limit || 15;
	screen_name = _parse_screen_name(screen_name);
	this.client.get('statuses/user_timeline', {
		screen_name: screen_name,
		count: params.limit,
		exclude_replies: !params.replies,
		include_rts: params.retweets
	}, (function(err, data, response) {

		var message;

		if(err){
			message = "could not get tweets of user @" + screen_name + " / " + err.message
			if(err.statusCode === 404){
				message = "@" + screen_name + " does not exist";
			}else if(err.statusCode === 401){
				message = "@" + screen_name + "'s tweets are protected";
			}
			return cb(new Error(message));
		}

		if(data){
			message = "displaying last " + params.limit + " tweets by @" + screen_name;
			if(params.limit === 1){
				message = "displaying last tweet by @" + screen_name;
			}
			if(data.length === 0){
				return cb(new Error("@" + screen_name + " has no tweets"));
			}
			var url = "https://twitter.com/" + screen_name;
			if(params.replies){
				url += "/with_replies";
			}
			_process_data.call(this, data, function(err, data){
				return cb(null, {
					data: data,
					message: message,
					params: params,
					url: url
				});
			});
		}

	}).bind(this));
}

module.exports = API;
