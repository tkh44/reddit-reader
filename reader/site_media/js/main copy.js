YUI().use("jsonp", "transition", function (Y){
	//http://www.reddit.com/r/all.json?limit=4&jsonp=?
	url = "http://yuilibrary.com/gallery/api/random?callback={callback}",
		outputDiv = Y.one("#post"),
		//gallery;
		
	gallery = new Y.JSONPRequest(url, {
		on: {
			success: function (response){
				var module = response.modules[0],
					author = module.owner;
				if (!author.rank){
					author.rank = "user";
				}
                module.authorHTML = Y.Lang.sub(this.authorTemplate, author);

                outputDiv.setContent(Y.Lang.sub(this.moduleTemplate, module));

                // Add some flare to the poll interval by showing a "time left"
                // indicator via the header's border
                Y.one("#post h4")
                    .setStyle("borderRightWidth", "100px")
                    .transition({
                        borderRightWidth: 0,
                        duration: 7
                    }, function () {
                        if (gallery.polling) {
                            gallery.send();
                        }
                    });
            },

            failure: function () {
                gallery.polling = false;
                outputDiv.setContent(this.failureTemplate);

                // Wire up the Try again button
                outputDiv.one("button").on("click", function () {
                    gallery.send();
                });
            }
        }
    });


    gallery.moduleTemplate =
        '<h4><a href="{url}">{title}</a></h4>' +
        '<p class="author">{authorHTML}</p>' +
        '<div>{summary}</div>';

    gallery.authorTemplate =
        '<img src="{icon}" height="30" width="30">' +
        ' {fullname} <span class="rank">({rank})</span>';

    gallery.failureTemplate =
        '<p class="error">Ack, I couldn\'t reach the Gallery web service!</p>' +
        '<button>Try again</button>';

    gallery.polling = false;


    // Click the button to send the JSONP request
    Y.one("#start").on("click", function (e) {
        if (!gallery.polling) {
            gallery.polling = true;
            gallery.send();
        }
    });

    Y.one("#stop").on("click", function (e) {
        gallery.polling = false;
    });

});
