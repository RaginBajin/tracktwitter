// wait for page load
$(document).ready(function(){

	// connect socket
	var socket = io.connect('http://localhost:3000');
	var count = 0;
	// receive new tweet

	socket.on('newTweet', function(data){
		
		var author = data.user.screen_name;

		// update dom
		if(isIPO(data.text)){
			// send to the server that it's an "ipo"
			socket.emit('isIPO', data);
			// increment ipo count
			count++
			// change text
			$("#tweet-author").html('<a href="https://twitter.com/' + author + '">@' + author + '</a>');
			$("#tweet-content").html("<b>" + data.text + "</b>");
		} else {
			// change text
			$("#tweet-author").html('<a href="https://twitter.com/' + author + '">@' + author + '</a>');
			$("#tweet-content").html(data.text);
		}
		
		$("#counter").html(count);
	});


	/**
	 * Determines if the tweet includes references to IPO
	 *
	 * @param (String) tweet message
	 * @return (boolean) true if includes IPO
	 */
	function isIPO(tweet){
		var regex = /ipo/i;
		if(null != tweet.match(regex)){
			return true;
		}
		return false;
	}


});