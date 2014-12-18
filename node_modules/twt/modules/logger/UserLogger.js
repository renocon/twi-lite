var moment = require("moment");

var Logger = require("./Logger.js");

function UserLogger(){

}

Logger.WORDS_PER_LINE = 12;

UserLogger.SET_COLORS = function(COLORS){
	UserLogger.COLORS = COLORS;
	Logger.SET_COLORS(COLORS);
};

UserLogger.divider = Logger.divider;
UserLogger.content = Logger.content;
UserLogger.log = Logger.log;

UserLogger.status = function(following, follow_request_sent){
	var status = "not following";
	var statusUserLogger;
	if(follow_request_sent){
		status = "requested";
		statusUserLogger = UserLogger.COLORS.REQUESTED;
	}else if(following){
		status = "following";
		statusUserLogger = UserLogger.COLORS.FOLLOWING;
	}else{
		status = "not following";
		statusUserLogger = UserLogger.COLORS.NOT_FOLLOWING;
	}
	status = status.toUpperCase();
	UserLogger.log(statusUserLogger(" " + status + " "));
}

UserLogger.screen_name = function(screen_name, verified, my_screen_name){
	var ver = " ";
	if(verified){
		ver =" ✔";
	}
	if(screen_name === my_screen_name){
		UserLogger.log(UserLogger.COLORS.MY_SCREEN_NAME(" @" + screen_name + " ") + ver);
	}else{
		UserLogger.log(UserLogger.COLORS.SCREEN_NAME(" @" + screen_name + " ") + ver);
	}
};

UserLogger.last_tweet = function(){
	Logger.log(UserLogger.COLORS.LAST_TWEET(" Last Tweet: ") + "\n");
}

UserLogger.stats = function(statuses_count, followers_count, friends_count){
	UserLogger.log(UserLogger.COLORS.STATS(" " + statuses_count + " ") + " tweets, "
		+ UserLogger.COLORS.STATS(" " + followers_count + " ") + " followers, following " + UserLogger.COLORS.STATS(" " + friends_count + " "));
}

UserLogger.location = function(location){
	if(location){
		UserLogger.log("from " + location);
	}
}

UserLogger.registered = function(date){
	date = new Date(date);
	Logger.log("registered at " + UserLogger.COLORS.DATE(moment(date).format('MMMM Do YYYY, HH:mm:ss')));
}

module.exports = UserLogger;
