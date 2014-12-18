    (function(window){

        var session,
        words = [],
        interests=[],
        inc = 0;
        function forEach(array, callback){
            if(array){
                for(var x = 0; x< array.length;x++) callback(array[x]);
            }
    }

    var getWordCaller = (function(){
        var word = $('#qword').val();
       
        if(!word || word.length<3)return;
        console.log('button clicked - ' + word);
        getWord(word, function(data){
            $.post("/api/word",{qword: word, val:1},function(code,res){
                
                    addInterestButton(word,inc++);
                    console.log(word +' submitted!');
                    console.log(res);
                    if(res===0){
                       console.log('no need to make group');
                       return;
                   }
                   var temp = [];
                   var lead = word;

                   word = temp;

                   console.log(data);
                   if(data){
                    if(data.noun){
                        if(data.noun.syn) forEach(data.noun.syn,function(el){word.push(el);});
                        if(data.noun.rel) forEach(data.noun.rel,function(el){word.push(el);});
                        if(data.noun.sim) forEach(data.noun.sim,function(el){word.push(el);});
                    }
                    if(data.verb){
                        if(data.verb.syn) forEach(data.verb.syn,function(el){word.push(el);});
                        if(data.verb.rel) forEach(data.verb.rel,function(el){word.push(el);});
                        if(data.verb.sim) forEach(data.verb.sim,function(el){word.push(el);});
                    }
                    if(data.adjective){
                        if(data.adjective.syn) forEach(data.adjective.syn,function(el){word.push(el);});
                        if(data.adjective.rel) forEach(data.adjective.rel,function(el){word.push(el);});
                        if(data.adjective.sim) forEach(data.adjective.sim,function(el){word.push(el);});
                    }

                }
                console.log("client log: "+ lead);

                $('#procnotif').text('Interests Updated!');

                $.post("/api/wordGroup",{word:word,val:res,rep:lead},function(code,res){
                    console.log('New Word Group!!');
                });
            });
});
});

    function getWord(word, callback){


     var request = $.ajax({
         type: 'GET',
         url: "http://words.bighugelabs.com/api/2/195725a4b480dd0e9ac0cb42750d76e1/"+word+"/json",
         dataType: 'json',
         success: function(data) {
                       
                       callback(data);
                   },
                   error: function(jqXHR, textStatus, errorThrown) {

                     callback(word);
                 }
             });

     $.ajax(request);

 }
 function addWordLookup(){
    $('#sendWordBtn').click(getWordCaller); 
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



function addInterestButton(el,x){
    var string = '<button class="btn btn-default col-md-4" id="i'+x+'">&#x2717; ' + el +'</button>';
    $('#interests').append(string);
    $('#i'+x).click(function(){
      var word =  $('#i'+x).text(); 
      interests.push(el);
      console.log('post word: '+ el)
    $.post("/api/removeInterest",{qword: el},function(code,res){
                
                $('#procnotif').text('Success! '+el +' gone... :(');    
                $('#i'+x).remove();
                });
    
    });
}

function addInterestButtons(){
    var request = $.ajax({
        type: 'GET',
        url: "/myInterests",
        success: function(data) {
            for(inc = 0;inc<data.length;inc++){
                addInterestButton(data[inc],inc);
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error :(');
                console.log(jqXHR, textStatus, errorThrown);
                request.abort();
            }
        });

    $.ajax(request);

}

$(document).ready(function(){

   addWordLookup();
   getSessionData();
   addInterestButtons();

     console.log('page js loaded');
 });
}(this));