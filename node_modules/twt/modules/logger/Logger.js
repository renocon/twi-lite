function Logger(){

}

Logger.log = function(message, addspaces){
	addspaces = addspaces || false;
	if(addspaces){
		message = " " + message + " ";
	}
	console.log(message);
}

Logger.SET_COLORS = function(COLORS){
	Logger.COLORS = COLORS;
}

Logger.content = function(content, my_screen_name){
	content = content.replace(/#(\S*)/g, Logger.COLORS.HASHTAG("#$1"));
	content = content.replace(/@(\S*)/g, function(match){
		if(match === "@"){
			return match;
		}
		//check if mention screen_name
		if(match === "@" + my_screen_name + ""){
			return Logger.COLORS.MY_SCREEN_NAME(" " + match + " ");
		}else{
			return Logger.COLORS.MENTION(match);
		}
	});
	content = content.replace(/(\b(https?):\/\/[-A-Z0-9+&amp;@#\/%?=~_|!:,.;]*[-A-Z0-9+&amp;@#\/%=~_|])/ig, Logger.COLORS.URL("$1"));
	var words = content.split(" ");
	var line = "";
	if(Logger.WORDS_PER_LINE){
		for(var i = 1;i <= words.length;i++){
			line += words[i-1] + " ";
			if(i % Logger.WORDS_PER_LINE === 0 && i !== 0){
				Logger.log(line);
				line = "";
			}else if(i === words.length){
				Logger.log(line);
			}
		}
	}else{
		Logger.log(content);
	}
}

Logger.divider = function(character){
	if(character){
		Logger.log(" " + character + " ");
		return;
	}
	Logger.log(" ");
}

Logger.fail = function(message){
	Logger.log("\n" + Logger.COLORS.FAIL(" " + message + " ") + "\n");
}

Logger.success = function(message){
	Logger.log("\n" + Logger.COLORS.SUCCESS(" " + message + " ") + "\n");
}

module.exports = Logger;
