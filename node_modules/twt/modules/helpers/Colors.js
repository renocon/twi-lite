var chalk = require("chalk");
var defaults = require("../../config/chalk_defaults.json");

function Colors(config){
	_config_logger.call(this, config);
}

function _config_logger(config){
	for(var i = 0;i < config.colors.length;i++){
		var color = config.colors[i];
		var list = [];
		for(var property in color.style){
			var style = _loadStyle(property, color.style[property]);
			if(style){
				list.push(style);
			}
    }
    this[color.id.toUpperCase()] = eval("chalk." + list.join("."));
	}
}

function _loadStyle(property, content){
	switch(property){
		case "background-color":
			return _return_background_color(content);
		break;
		case "color":
			return _return_color(content);
		break;
		case "style":
			return _return_style(content);
		break;
	}
}

function _return_style(style){
	for(var i = 0;i < defaults.styles.length;i++){
		if(defaults.styles[i].toLowerCase() === style.toLowerCase()){
			return style;
		}
	}
	return false;
}

function _return_color(color){
	for(var i = 0;i < defaults.colors.length;i++){
		if(defaults.colors[i].toLowerCase() === color.toLowerCase()){
			return color;
		}
	}
	return false;
}

function _return_background_color(background_color){
	for(var i = 0;i < defaults.background_colors.length;i++){
		if(defaults.background_colors[i].toLowerCase() === background_color.toLowerCase()){
			var color = defaults.background_colors[i];
			color = "bg" + color.charAt(0).toUpperCase() + color.slice(1, color.length);
			return color;
		}
	}
	return false;
}

module.exports = Colors;
