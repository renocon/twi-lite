function Tweet(obj, my_screen_name, dm){
	this.obj = obj;
	this.dm = dm || false;
	this.my_screen_name = my_screen_name || "";
}

Tweet.prototype.display = function(entities, Logger){
	if(this.dm){
		this.obj.user = {};
		this.obj.user.screen_name = this.obj.sender.screen_name;
	}
	Logger.screen_name(this.obj.user.screen_name, this.my_screen_name);
	Logger.content(entities.decode(this.obj.text), this.my_screen_name);
	if(!this.dm){
		Logger.stats(this.obj.retweet_count, this.obj.favorite_count);
	}
	Logger.date(this.obj.created_at);
	Logger.divider();
}

module.exports = Tweet;
