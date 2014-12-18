(function(window){
    'use strict';
    var loggedIn = false;


    
    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    

    
    function getNews(varName,target,msg,aim){
        var news = getParameterByName(varName);

        if(varName === "s"){
            if(news === aim){
                $('#'+target).show();
                $("#"+target).text(msg);
                
            }
        }else if(varName === "li"){
            if(news === aim){
                $('#'+target).show();
                $("#"+target).text(msg);
                
            }
        }else $("#"+target).hide();
    }
    
    $(document).ready(function(){
        
       
        $("#procnotif").hide();
        getNews('s','procnotif',"You're all registered!!! You can log in now. :)","1");
        getNews('li','procnotif','Invalid Login Credentials',"0");
        getNews('li','procnotif','Login to view content',"1");
        
        
        console.log('page js loaded');
		});


}(this));