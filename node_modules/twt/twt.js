#!/usr/bin/env node

var program = require("commander");
var version = require("./package.json").version;

var Entities = require('html-entities').AllHtmlEntities;
var entities = new Entities();

var Tweet = require("./modules/models/Tweet.js");
var User = require("./modules/models/User.js");

var API = require("./modules/helpers/API.js");

require("dotenv").load();
var api = new API(process.env);

var Colors = require("./modules/helpers/Colors.js");
var config = require("./config/logger.json");

var colors = new Colors(config);

var Logger = require("./modules/logger/Logger.js");
Logger.SET_COLORS(colors);

var TweetLogger = require("./modules/logger/TweetLogger.js");
TweetLogger.SET_COLORS(colors);

var UserLogger = require("./modules/logger/UserLogger.js");
UserLogger.SET_COLORS(colors);

var screen_name = process.env.TWT_SCREEN_NAME;

function _parse_options(program){
	var params = {}
	params.words = parseInt(program.words) || 12;
	params.limit = parseInt(program.limit) || 15
	params.open = program.open || false;
	params.replies = true;
	params.retweets = true;
	if(program.exclude){
		var excludes = _parse_exclude(program.exclude);
		params.replies = excludes.replies;
		params.retweets = excludes.retweets;
	}
	return params
}

function _check_flag(flag){
	if(flag === "rt" || flag === "retweets"){
		return "retweets"
	}else if(flag === "r" || flag === "replies"){
		return "replies";
	}
	return false;
}

function _parse_exclude(exclude){
	var obj = {retweets: true, replies: true};
	exclude = exclude.split(" ").join("");
	if(exclude.indexOf(",") > 0){
		var flags = exclude.split(",");
		for(var i = 0;i < flags.length;i++){
			var flag = _check_flag(flags[i])
			if(flag){
				obj[flag] = false;
			}
		}
	}else{
		var flag = _check_flag(exclude);
		if(flag){
			obj[flag] = false;
		}
	}
	return obj;
}

function _open_page(url){
  var exec = require('child_process').exec
  exec("open " + url);
}

if(screen_name.indexOf("@") === 0){
	screen_name = screen_name.substring(1, screen_name.length);
}

program
	.version(version)
	.usage('- cmdtwitter, a command line twitter client \n\n  $ twt {command} <argument> <options>')
  .option("-l, --limit <limit>", "limit results")
  .option("-w, --words <words>", "words per line")
  .option("-o, --open", "open specific page")
  .option("-e, --exclude <flags>", "exclude tweets, pass r|replies or/and rt|retweets, comma separated");
  //.option("-f, --filter <flags>", "filter tweets, pass r|replies or/and rt|retweets, comma separated");

program
	.command('home')
	.alias('h')
	.description('display your home timeline, default action')
	.action(home_timeline);

program
	.command('tweet <status>')
	.alias('t')
	.description('tweet a new status')
	.action(tweet);

program
	.command('mentions')
	.alias('m')
	.description('display your mentions')
	.action(mentions_timeline);

program
	.command('directmesssages')
	.alias('d')
	.description('display your direct messages')
	.action(direct_messages);

program
	.command('search <search_query>')
	.alias('s')
	.description('search tweets by query')
	.action(search);

program
	.command('list <list_name>')
	.alias('l')
	.description('display tweets in list')
	.action(list_timeline);

program
	.command('user <screen_name>')
	.alias('u')
	.description('display timeline of user')
	.action(user_timeline);

program
	.command('own')
	.alias('o')
	.description('display your timeline')
	.action(own_timeline);

program
	.command('follow <screen_name>')
	.alias('f')
	.description('follow or request to follow a user')
	.action(follow);

program
	.command('unfollow <screen_name>')
	.alias('uf')
	.description('unfollow a user')
	.action(unfollow);

program
	.command('whois <screen_name>')
	.alias('w')
	.description('display information on user')
	.action(whois);

program.parse(process.argv);

var params = {};

if(program.args && program.args.length === 0){
	home_timeline();
}

function tweet(status){
	params = _parse_options(program);
	api.tweet(status, params, result);
}

function search(query){
	params = _parse_options(program);
	api.search(query, params, result)
}

function home_timeline(){
	params = _parse_options(program);
	api.home_timeline(params, result);
}

function mentions_timeline(){
	params = _parse_options(program);
	api.mentions_timeline(params, result);
}

function direct_messages(){
	params = _parse_options(program);
	api.direct_messages(params, result);
}

function own_timeline(){
	params = _parse_options(program);
	user_timeline(screen_name);
}

function user_timeline(screen_name){
	params = _parse_options(program);
	api.user_timeline(screen_name, params, result)
}

function list_timeline(list_name){
	params = _parse_options(program);
	api.list_timeline(screen_name, list_name, params, result)
}

function follow(screen_name){
	params = _parse_options(program);
	api.follow(screen_name, params, result)
}

function unfollow(screen_name){
	params = _parse_options(program);
	api.unfollow(screen_name, params, result)
}

function whois(user){
	params = _parse_options(program);
	api.whois(user, params, whoisHandler);
}

function result(err, result){
	params = _parse_options(program);
	TweetLogger.SET_WORDS_PER_LINE(params.words);
	if(err){
		Logger.fail(err.message);
		return;
	}
	Logger.success(result.message);
	if(result.params){
		if(result.params.open){
			_open_page(result.url);
			return;
		}
	}
	if(result.data){
		var dm = result.dm || false;
		var data = result.data.reverse();
		for(var i = 0;i < data.length; i++){
			var tweet = new Tweet(data[i], screen_name, dm);
			tweet.display(entities, TweetLogger);
		}
	}
}

function whoisHandler(err, result){
	if(err){
		Logger.fail(err.message);
		return;
	}
	if(result.params){
		if(result.params.open){
			_open_page(result.url);
			return;
		}
	}
	Logger.divider();
	if(result.data){
		var user = new User(result.data, screen_name);
		user.display(entities, UserLogger, TweetLogger)
	}
	Logger.divider();
}
