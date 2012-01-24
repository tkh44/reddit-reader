YUI().use("jsonp", "transition", "substitute", function (Y){
	//Accept custom callback name and send subreddit with send
	function prepareJSONPUrl(url, proxy, subreddit){
		return Y.Lang.sub(url, {
			callback: proxy,
			subreddit: subreddit || "all"
		});
	}
	function fixHTML(string){
		return string.replace(/\&amp;/g,'&').replace(/\&lt;/g,'<').replace(/\&gt;/g,'>');
	}
	function handleJSONP(response){
		Y.each(response.data.children, function(post, rank){
			var template = Y.one('#linkPostTemplate').getContent();
			//We need a different template for self posts
			if(post.data.is_self === true){
				template = Y.one('#selfPostTemplate').getContent();
				Y.one("#post-container").append(Y.substitute(template, post.data));
				var self_text = fixHTML(post.data.selftext_html);
				Y.one("#" + post.data.id + "_html").insert(self_text);
				return false;
			}	
			Y.one("#post-container").append(Y.substitute(template, post.data));
			return false;
		});
	}
	
	//http://www.reddit.com/r/all.json?limit=4&jsonp=?
	var url = 
		"http://www.reddit.com/r/{ subreddit }.json?limit=100&jsonp={callback}",
		subreddit = Y.one("#subreddit"),
		selected = Y.one("#selected-subreddit"),
		reddit,
		reader;
		
	reddit = new Y.JSONPRequest(url, {
		format: prepareJSONPUrl,
		on:{
			success: handleJSONP
		}
	});
	
	reader = function(){
		function initialize(){
			reddit.send("all");
			Y.one("#subreddit-form").on("submit", function(e){
				e.preventDefault();
				Y.one("#post-container").setContent('');
				reddit.send(subreddit.get("value"));
				selected.setContent('<h2>' + subreddit.get("value") + '</h2>');
			});
		}
		return {
			initialize: initialize
		};
	}();
	Y.on("domready", function(){
		var reader_el = reader.initialize();
	});
	//
});
