(function(window){
    'use strict';
    var loggedIn = false;
    //var colorThief = new ColorThief();
    //var image = new Image();
    //image.src = 'https://pbs.twimg.com/profile_banners/1043870192/1394262403';
    //image.crossOrigin = "anonymous";
    //console.log(colorThief.getColor(image));
    
    
    
 
    function defineElements(){
        
         //$('#testZone').hide();
        }
    
    function isLoggedIn(){
        var request = $.ajax({
                type: 'GET',
                url: "/login",
                //dataType: 'json',
                success: function(data) {
                    console.log(data);
                    //callback(null);
                    $('#loginArea').empty();
                    if(data==='nok'){
                        loggedIn = false;
                        $('#loginArea').append(
                            "<div id='loginArea'>"+
                                "<form id='loginForm' role='form' method='post' action='login'>"+
                                    "<div class='form-group'>"+
                                        "<label for='email'>Email address</label>"+
                                        "<input type='email' class='form-control' id='email' name='email' placeholder='Enter email'>"+
                                        "</div>"+
                                    "<div class='form-group'>"+
                                        "<label for='password'>Password</label>"+
                                        "<input type='password' class='form-control' id='password' name = 'password' placeholder='Password'>"+
                                    "</div>"+
                                    "<button type='submit' class='btn btn-default'>Login</button><a href='/register'><button type='button' class='btn btn-default'>Register</button></a>"+
                            "</form>"+
                            "</div>");
                    }else if(data==='ok'){
                        loggedIn = true;
                        $('#loginArea').append(
                            "<div id='loginArea'>"+
                                "<form id='loginForm' role='form' method='get' action='logout'>"+
                                    "<button type='submit' class='btn btn-default'>Logout</button>"+
                                "</form>"+
                            "</div>");
                        
                        //defineElements();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log('error :(');
                    console.log(jqXHR, textStatus, errorThrown);
                    //$('#procnotif').text("Word not found :(");
                    request.abort();
                }
            });
        
        $.ajax(request);
        
        }
    
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    
    //var table = false;
    
    function getNews(varName,target,msg,aim){
        var news = getParameterByName(varName);

        if(varName === "s"){
            if(news === aim){
                $('#'+target).show();
                $("#"+target).text(msg);
                //table = true;
            }//else $("#"+target).hide();
        }else if(varName === "li"){
            if(news === aim){
                $('#'+target).show();
                $("#"+target).text(msg);
                //table = true;
            }//else 
        }else $("#"+target).hide();
    }
    
    $(document).ready(function(){
        
        //isLoggedIn();
        $("#procnotif").hide();
        getNews('s','procnotif',"You're all registered!!! You can log in now. :)","1");
        getNews('li','procnotif','Invalid Login Credentials',"0");
        getNews('li','procnotif','Login to view content',"1");
        
        //$("#testZone")
        console.log('page js loaded');
		});


}(this));