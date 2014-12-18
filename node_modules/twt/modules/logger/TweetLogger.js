var moment = require("moment");

var Logger = require("./Logger.js");

function TweetLogger(){

}

TweetLogger.SET_WORDS_PER_LINE = function(WORDS_PER_LINE){
	Logger.WORDS_PER_LINE = WORDS_PER_LINE;
};

TweetLogger.SET_COLORS = function(COLORS){
	TweetLogger.COLORS = COLORS;
	Logger.SET_COLORS(COLORS);
};

TweetLogger.divider = Logger.divider;
TweetLogger.content = Logger.content;
TweetLogger.log = Logger.log;

TweetLogger.stats = function(retweet_count, favorite_count){
	var rts = "";
	var favs = "";
	var concat = "";
	if(retweet_count === 0 && favorite_count === 0){
		return;
	}
	if(retweet_count > 0){
		if(retweet_count === 1){
			rts = TweetLogger.COLORS.STATS(" " + retweet_count + " ") +  " retweet";
		}else{
			rts = TweetLogger.COLORS.STATS(" " + retweet_count + " ") +  " retweets";
		}
	}
	if(favorite_count > 0){
		if(retweet_count > 0){
			concat = ", "
		}
		if(favorite_count === 1){
			favs = TweetLogger.COLORS.STATS(" " + favorite_count + " ") + " favorite";
		}else{
			favs = TweetLogger.COLORS.STATS(" " + favorite_count + " ") + " favorites";
		}
	}
	TweetLogger.log(rts + "" + concat + "" + favs);
}

TweetLogger.date = function(date){
	date = new Date(date);
	Logger.log(TweetLogger.COLORS.DATE(moment(date).format('MMMM Do YYYY, HH:mm:ss')));
}

TweetLogger.screen_name = function(screen_name, my_screen_name){
	if(screen_name === my_screen_name){
		Logger.log(TweetLogger.COLORS.MY_SCREEN_NAME(" @" + screen_name + " "));
	}else{
		Logger.log(TweetLogger.COLORS.SCREEN_NAME(" @" + screen_name + " "));
	}
}

module.exports = TweetLogger;
