var Logger = require("./Logger.js");

function TrendsLogger(){

}

TrendsLogger.SET_COLORS = function(COLORS){
	TrendsLogger.COLORS = COLORS;
	Logger.SET_COLORS(COLORS);
};

TrendsLogger.divider = Logger.divider;
TrendsLogger.log = Logger.log;

module.exports = TrendsLogger;
