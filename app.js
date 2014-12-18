'use strict';

/*
 * Express Dependencies
 */
var express     = require('express'),
    app         = express(),
    port        = 3000,
    ipS         = '127.0.0.1', 
    bodyParser  = require('body-parser'),
    session     = require('express-session'),
    http 	    = require('http').Server(app),
    io 		    = require('socket.io')(http),
    Twitter     = require('twit'),
    config 	    = require('./config.json'),
    twitter     = new Twitter(config),
    mysql       = require('mysql'),
    crypto      = require('crypto'),
    sessData,
    connection;


connection = mysql.createConnection({
	host: "localhost",
	user: "tweetydb",
	password: "tweetydb",
	database: "tweetydb"
});


app.use(express.static(__dirname + '/app'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret:"comp3550",saveUninitialized: true,resave: true }));
var stream = twitter.stream('statuses/sample', {language: 'en'});

function setUpListeners(socket){

}

function checkAuth(req, res, next){
	if(!req.session.user){ //If user not set in the session we not logged in
		//Display appropriate error along with appropriate error code
		res.send("nok");
        //res.redirect("/index.html");
	}else{
		//We are logged in so we run the next operation (which is what we defined in the method call)
		next();
	}
}

function stripTweet(oTweet,callback){
    var sTweet = {
        text    : oTweet.text,
        scrnm   : oTweet.user.screen_name,
        udesc   : oTweet.user.description, 
        imgurl  : oTweet.user.profile_image_url,
        meta    : oTweet.entities.urls,
        metah   : oTweet.entities.hashtags
    };
    
    
    return sTweet;
}



function addTweetToDB(tweet){
    	var sql = "INSERT INTO `tweeters` (`scr_name` ,`desc`,`img_url` ,`ban_url`) VALUES ('" + 
            escape(tweet.scrnm) + "', '"+ escape(tweet.udesc) +
            "' , '"+escape(tweet.imgurl)+"', '"+escape(tweet.banurl)+"');";

	    connection.query(sql, function(err, result){
            if (err){
                console.log("Tweeter exists or not inserted: "+ err);
                return;
            }
            console.log("Inserted a new tweeter with id: " + result.insertId);
	        });
    
            sql = "select `id` from `tweeters` where `scr_name`='"+escape(tweet.scrnm)+"'";
            connection.query(sql, function(err, res){
                if (err){
                    console.log("Tweeter not found or error: "+ err);
                    return;
                }
                var id = res[0].id;
                sql = "INSERT INTO `tweets` (`text` ,`timestamp_ms`,`userid`) VALUES ('" + 
                escape(tweet.text) + "', "+ tweet.time +
                " , "+id+");";
                connection.query(sql, function(err, resu){
                    if (err){
                        console.log("Tweet exists or error: "+ err);
                        return;
                    }
                    console.log("Inserted tweet with id: " + resu.insertId);
                    });
            });
}

connection.connect(function(err){
	if (err){
		console.log("Error Connecting to the EBDB: "+err.stack);
		return;
	}
	console.log("Successfully connected to the database");


});



//In order to minimise API usage, we only start stream from twitter when user connected
stream.on('tweet', function(tweet){
    //When Stream is received from twitter
    if(tweet.text[0] ==='R' && tweet.text[1] === 'T')return;
    if(tweet.user.lang!=='en')return;


    //if(!tweet.verified)return;
        tweet = stripTweet(tweet, null);
        io.emit('new tweet' ,tweet); //Send to client via a push

});


app.get("/profile",checkAuth,function(req,res){
    res.redirect("/profile.html");
});

app.get('/home',checkAuth,function(req,res){res.redirect('/home.html');});

app.get('/login',checkAuth,function(req,res){
    res.send('ok');
    });

app.post('/login', function (req, res) {
	// We read the username and password from the body
	//Typically we will submit via a form, which will encapsulate the data in the body of the POST request
	var post = req.body;
	//console.log(req.body);
    var password = crypto.createHash('sha1').update(post.password).digest('hex');
    var query ='SELECT * FROM `users` where `email`="'+post.email+'"';

    connection.query(query,function(err,row){

        if (err) {
            console.log(err);
            res.redirect('/index.html?li=0');
        
        
        
        
        } else  if (row){
            
            if(row[0].password === password){
                req.session.user = {userid: row[0].id, email: row[0].email, name: row[0].name};
                
                //We attempt to save to ensure that the session is retained
                setTimeout(function(){req.session.save(function(err){
                    if(!err){ // Successfully saved the session
                        console.log("session saved");
                        
                        console.log(req.session.user);
                        res.redirect('/home'); // We direct to the appropriate page
                    }else{
                        //If we are unable to save the session then server error has occured. We inform them both with status code and appropriate message
                        console.log(err);
                        res.status(500).send("unable to create session");
                    }
                });},1000);
                
            }else res.redirect('/index.html?li=0');
        }

    });

	
    	
});

app.get('/logout', function (req, res) {
	delete req.session.user;
	res.redirect('/');
});

app.get('/trending', checkAuth,function (req, res) {
    res.redirect('/trending.html');
});

app.get('/lite', checkAuth,function (req, res) {
    res.redirect('/lite.html');
});

app.get('/register', function(req, res){
    res.redirect('register.html');
    });

app.post('/register', function(req, res){
    var post = req.body;
    var password = post.password;
    password = crypto.createHash('sha1').update(password).digest('hex');
    var query = 'insert into `users` (`email`,`password`,`name`)values("'+post.email+'","'+password+'","'+post.name+'")';

    connection.query(query, function(err, result){
        if (err){
            console.log("Error occured "+ err);
            return;
        }
        console.log("Inserted record with id" + result.insertId);
    });

    res.redirect('index.html?s=1');
    });

app.get("/api/test",function(req, res){
    res.send("hello world");
    });

app.get("/api/tweets",checkAuth,function(req, res){
    
    });

function addUserRel(user,grp){
    var sql = "insert into `user_prefs` values ('"+user+"','"+grp+"')";
    connection.query(sql,function(err,res){
        if(err){
            console.log("user rel error");
            console.log(err);
            return;
        }
        console.log(user+" "+ grp+' rel added');
    });
}

app.post("/api/word",function(req,res){
    var word = req.body.qword;
    console.log(req.session);
    console.log(word);
    var grp = 0;
        if(word){
            console.log('searching for rep of: ' +word);
            var sql = 'select * from `relations` where `word`="'+word+'" and `rep`=1';
            connection.query(sql,function(err,resp){
                if(err){
                    console.log(err);
                    res.json(grp);
                    }
                if(resp.length!==0){
                    console.log('resource already exists');
                    var relid = resp[0].grp;
                    addUserRel(req.session.user.userid, relid);
                    res.json(grp);
                }
                else {

                    var sql = "select MAX(`grp`) as `id` from  `relations`";
                    connection.query(sql,function(err, resp){
                        if(err){
                            console.log('unable to retrieve group number\n'+err);
                            res.json(grp);
                            }
                        console.log(resp[0].id);
                        grp = 1 + resp[0].id
                        console.log("grp: "+grp)
       
                        var sql = 'insert into `relations` values("'+word+'","'+grp+'",1)';
                        connection.query(sql,function(err,resp){
                            if(err){
                                console.log('unable insert word because of error or pair already exists');
                                res.json(0);
                            }
                            console.log(grp+' inserted: '+word);
                            addUserRel(req.session.user['userid'], grp);
                            res.json(grp);
                            });
                        });

                    
                }    
                
          
                });
            

    }
});

function forEach(array, callback){
    if(array){
        for(var x = 0; x< array.length;x++) callback(array[x]);
        }
    }

app.post("/api/removeInterest",checkAuth,function(req,res){
    
    var sql = 'SELECT `grp` FROM `relations` WHERE word="'+req.body.qword+'" and rep=1';
    connection.query(sql,function(err,resp){
        if(err){
            console.log('error: '+err);
            res.status(500).send("nok");
        }

        var rem = 'delete from `user_prefs` where `grpid`='+resp[0].grp+' and   `userid`='+req.session.user.userid;
        connection.query(rem,function(){
            if(err){
            console.log('error: '+err);
            res.status(500).send("nok");
            }

        });
    });


    console.log(req.body.qword+ " removed");
    res.status(200).send("ok");
});    

app.post("/api/wordGroup", function(req,res){
   
     console.log(req.body);   
    var list = req.body['word[]'];
    var grp = req.body['val'];
    var lead = req.body['rep'];
    if(grp<1)res.send('invalid grp');
    console.log(list);
    if(list){
            
            var sql = "select MAX(`grp`) as `id` from  `relations`";
            connection.query(sql,function(err, resp){
                if(err){
                   console.log('unable to retrieve group number\n'+err);
                   return;
                   }
               console.log(resp[0].id);
               var grp = resp[0].id
                console.log("grp: "+grp);
                
                forEach(list,function(el){
                   var sql = 'insert into `relations` values("'+el+'","'+grp+'",0)';
                    connection.query(sql,function(err,resp){
                        if(err){
                        console.log('unable insert word because of error or pair already exists');
                        return;
                        }
                        console.log(grp+' inserted: '+el);
                        });
                    });
                });
            res.send('0');
        }else{
            console.log('nada de listo');
            res.status(200);
        }
    });

function getMyData(req,appString){
    var lists=[];
    var sql = 'select distinct(`grpid`) as grp from `user_prefs` where `userid`='+req.session.user.userid;
    connection.query(sql,function(err,rows){
                    if(err){
                        console.log('prefs error: '+err);
                        return;
                    }
                    
                    forEach(rows,function(el){
                        var query = 'select distinct(`word`) as word from `relations` where `grp`='+el.grp+appString;
                        connection.query(query, function(err,results){
                            if(err){
                                console.log('groups error: '+err);
                                return;
                            }
                            
                            var list = [];
                            for(var x = 0; x< results.length;x++){
                                var lc = results[x].word.toLowerCase();
                               
                                lists.push(lc);
                                
                            }
                           
                        });
                    });
                });
    //console.log(req);
    return lists;
}

app.get("/sessionData",checkAuth,function(req,res){
    if(req.session.user)res.json(req.session.user);
    else res.status(500);
});

app.get("/myData",checkAuth,function(req,res){
    var r = getMyData(req,'');
    setTimeout(function(){
        
        res.json(r);
    },200);
});

app.get("/myInterests",checkAuth,function(req,res){
    var r = getMyData(req,' and `rep`=1 order by `word` asc');
    setTimeout(function(){
        res.json(r);
    },200);
});

function dofunc(fun,x){
    fun(x);
}

app.get("/api/popular/:offset/:limit",function(req,res){
    var offset = req.params['offset'] || 0,
        limit = req.params['limit'] || 20;
    var results;    

    //SELECT `grpid`, COUNT(`grpid`) as `count` FROM `user_prefs` GROUP BY `grpid` order by `count` desc limit 0,20
    var query = 'SELECT `grpid` as `grp`, COUNT(`grpid`) as `count` FROM `user_prefs` where `userid`>0 GROUP BY `grpid` order by `count` desc limit '+offset+','+limit;
    connection.query(query,function(error,response){
        if(error){
            console.log('some error: '+error);
            return;
            }

            var result = [];
            var x = -1;
            while(x < response.length-1){
                x++;
                
                    var y = x;
                   
                    var sql = "select `word` from `relations` where  `rep`=1 and `grp`="+response[y]['grp'];
                    dofunc(function(varX){
                        connection.query(sql,function(e,r){
                        if(e){
                            console.log('some error: '+e);
                            return;
                            }
                         

                        response[varX]['text'] = r[0]['word'];
                        
                        });
                    },x);
                
            }

            setTimeout(function(){res.json(response)},200);
    });
});

app.get("/api/liteTrends",function(req,res){
    var query = 'SELECT `grpid` as `grp`, COUNT(`grpid`) as `count` FROM `user_prefs` where `userid`>0 GROUP BY `grpid` order by `count` desc limit 0,20';
    var result = [];
    connection.query(query,function(error,response){
        if(error){
            console.log('some error: '+error);
            return;
            }

            
            var x = -1;
            while(x < response.length-1){
                x++;
                
                  
                    var sql = "select `word` from `relations` where `grp`="+response[x]['grp'];
                    dofunc(function(varX){
                        connection.query(sql,function(e,r){
                        if(e){
                            console.log('some error: '+e);
                            return;
                            }
                          

                        for(var y = 0; y<r.length;y++){
                            
                            result.push(r[y]['word']);
                            }
                        });
                    },x);
                
            }

            setTimeout(function(){res.json(result)},40);
});

});

app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1' || ip === '50.116.19.217' || ip===ipS) return true; // trusted IPs. loopback is self, 2nd ip is related word api IP
  else return false;
});

app.put("/profile/:username",checkAuth,function(req,res){
    console.log(req);
});

//app.listen(port);
http.listen(port, ipS,function(){
   console.log("Listening on http://"+ipS+":"+port);
});


console.log('Express started on port ' + port);





