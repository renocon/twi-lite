(function(window){
	var session;

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

function push(a,b,c,el){
    a.push(c[el].text);
    b.push(c[el].count);
}
	function cinit(){

		var ajaxR = $.ajax({
			type: 'GET',
			url: "/api/popular/0/20",
			success: function(data) {
				var cats = [],
				vals = [];

				for(var x = 0;x<data.length;x++){
					push(cats,vals,data,x);
				} 
            //console.log(cats);
            $('#chart').highcharts({

            	title: {
            		text: 'Trending Topics on Twi-Lite',
            x: -20 //center
        },
        subtitle: {
        	text: 'Source: Twi-Lite Analytics',
        	x: -20
        },
        xAxis: {
            //lineColor:'#8AE390',
            categories: cats ,
            title:{ text:'Trends'},
            
            labels:{
                //format: '',
                //categories:cats,
                //enabled:true,
                useHTML: true,
                rotation: -30
            }


        },
        yAxis: {
        	title: {
        		text: 'Followers'
        	},
        	plotLines: [{
        		value: 0,
        		width: 1,
        		color: '#8AE390'
        	}]
        },
        tooltip: {
        	valueSuffix: ' Followers'
        },
        legend: {
        	layout: 'vertical',
        	align: 'right',
        	verticalAlign: 'middle',
        	borderWidth: 0
        },
        series: [{
        	name: 'Trending',
        	data: vals,
        	color: '#8AE390'
        }],
        chart:{
        	events:{
        		click: function(e) {
        			console.log(e);
        		}
        	}
        }

    });   
},
error: function(jqXHR, textStatus, errorThrown) {}
});
$.ajax(ajaxR);

}

$(document).ready(function(){
	getSessionData();
	cinit();
	console.log('page js loaded');
});


}(this));