YUI().use("jsonp", "transition", "substitute", function (Y){
	
	
	function prepareJSONPUrl(url, proxy, subreddit){
		return Y.Lang.sub(url, {
			callback: proxy,
			subreddit: subreddit || "all"
		});
	}
	
	function handleJSONP(response){
		for(var i = 0; i < response.data.children.length; i++){
			if (response.data.children[i].data.is_self === true){
				var template = reader.postSelfTemplate;
			}
			else{
				var template = reader.postLinkTemplate;
			}
			Y.one("#post-container").append(Y.substitute(template, response.data.children[i].data));
		}
		
	}
	
	//http://www.reddit.com/r/all.json?limit=4&jsonp=?
	var url = "http://www.reddit.com/r/{ subreddit }.json?limit=100&jsonp={callback}",
		subreddit = Y.one("#subreddit"),
		selected = Y.one("#selected-subreddit"),
		outputDiv = Y.one("#post"),
		reader;
		
		
	reader = new Y.JSONPRequest(url, {
		format: prepareJSONPUrl,
		on:{
			success: handleJSONP
		}
	});
	
	reader.postLinkTemplate = 
		'<div class="span16 post">'+
		'<div class="row">'+
		'<div class="span1">'+
		'<h4 class="score">{score}</h4>'+
		'</div>'+
		'<div class="span14">'+
		'<h4 class="title"><a href="{url}" target="_blank">{title}</a></h4>'+
		'<div class="row">'+
		'<div class="span14 detail">'+
		'</div>'+
		'</div>'+	
		'</div>'+
		// '<div class="span1 vote">'+
		// '<a href="up">Up</a>'+
		// '<a href="down">Down</a>'+
		// '</div>'+
		'</div>'+
		'</div>';
		//'<h4><a href="{ url }">{ title }</a></h4>';
	reader.postSelfTemplate = 
		'<div class="span16 post">'+
		'<div class="row">'+
		'<div class="span1">'+
		'<h4 class="score">{score}</h4>'+
		'</div>'+
		'<div class="span14">'+
		'<h4 class="title"><a href="{url}" target="_blank">{title}</a></h4>'+
		'<div class="row">'+
		'<div class="span14 detail">'+
		'<p>{selftext}</p>'+
		'</div>'+
		'</div>'+	
		'</div>'+
		// '<div class="span1 vote">'+
		// '<a href="up">Up</a>'+
		// '<a href="down">Down</a>'+
		// '</div>'+
		'</div>'+
		'</div>';
	
	Y.one("#subreddit-form").on("submit", function(e){
		reader.send(subreddit.get("value"));
		selected.setContent('<h2>' + subreddit.get("value") + '</h2>');
	});
});
