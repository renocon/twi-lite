(function(window){

	var session,
		tweets = [],
		total = 0,
		printed = 0,
		words = [],
		onscreen = 0,
		socket;

	function reset(){
		$('#tweetArray').empty();
		onscreen = 0;
		$('#tweetResetButton').hide(200);
	}

	function streamOn(){
		socket = io.connect();
		reset();
		socket.on('new tweet', function(tweet){
				if(tweets.length>=100){
					tweets = tweets.splice(0,10);
					console.log('tweets lost homie :(');
				}
	            if(tweets.length<30)tweets.push(tweet);
	            else streamOff();
			  });
		setInterval(processTweet,150);
		console.log('stream connected');
	}	

	function streamOff(){
		
		$('#tweetResetButton').show(200);
		
	}

	function processTweet(){

		if(tweets.length>0 && onscreen<30){
			var tweet = tweets.pop();
			if(words)for(var x = 0; x<words.length;x++){
				if(tweet.text){
					if(tweet.text.toLowerCase().indexOf(words[x])>=0){
						if(tweet.meta)for(var x = 0;x<tweet.meta.length;x++){
							var link = '<a href="'+tweet.meta[x].url+'">'+tweet.meta[x].url+"</a>";
							tweet.text = tweet.text.replace(tweet.meta[x].url,link);
						}
						
						if(tweet.metah)for(var x = 0;x<tweet.metah.length;x++){
							var link = '<a href="https://twitter.com/hashtag/'+tweet.metah[x].text+'?src=hash">#'+tweet.metah[x].text+"</a>";
							tweet.text = tweet.text.replace('#'+tweet.metah[x].text,link);
						}

						
						$('#tweetArray').append('<tr style=”background: url('+tweet.banurl+
							') no-repeat 0 0;”><td><a href="https://twitter.com/'+tweet.scrnm+'"><img src="'
							+tweet.imgurl+'" height="70" ></a></td><td><a href="https://twitter.com/'
							+tweet.scrnm+'">'+tweet.scrnm+'</a><br>'+tweet.text+'</td></tr>');
						
						onscreen++;
						return;
					}
				} 

			}

			
		}else if(onscreen>=30){
			streamOff();
		}

	}	

	function getSessionData(){
		var request = $.ajax({
                type: 'GET',
                url: "/sessionData",
                
                success: function(data) {
                    session = data;
                    console.log(session);
                    if(data.name)$('#usrTitle').text('Hey '+session.name+'!');
                    
                    
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error :(');
                    console.log(jqXHR, textStatus, errorThrown);
                    request.abort();
                }
            });
        
        $.ajax(request);
	}	

	var getWords = function(){
		var request = $.ajax({
                type: 'GET',
                url: "/api/liteTrends",
                
                success: function(data) {
                    words = data;
                  
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error :(');
                    console.log(jqXHR, textStatus, errorThrown);
                    request.abort();
                }
            });
        
        $.ajax(request);
	};

	$(document).ready(function(){
		$('#tweetResetButton').click(function(){
			reset();
		});
		getSessionData();
		getWords();
		streamOn();
	});
}(this));