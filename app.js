// Dependencies
var express = require('express')
  , app = module.exports = express.createServer()
  , routes = require('./routes')
  , io = require('socket.io').listen(app)
  , mu = require('mu2')
  , util = require('util')
  , config = require('./config').config
  , twitter = require('ntwitter')
  ;

// Configurations
app.configure(function(){
  mu.root = __dirname + '/views';
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);

// Twitter
var twit = new twitter({
  consumer_key: config.twitter.consumer_key,
  consumer_secret: config.twitter.consumer_secret,
  access_token_key: config.twitter.access_token_key,
  access_token_secret: config.twitter.access_token_secret
});

// Twilio


// Socket.io
io.on('connection', function(socket){
  // Initialize Twitter user-stream
  twit.stream('user', function(stream) {
    // on new data
    stream.on('data', function (data) {  
      console.log(data);   
      // send to client
      socket.emit('newTweet', data);
    });
    // end protocol
    stream.on('end', function (response) {
      console.log('end');
      stream.destroy;
    });
    // destroy protocol
    stream.on('destroy', function (response) {
      console.log('destroy');
      stream.destroySilent;
    });
  });

  // send text message
  socket.on('isIPO', function(data){
    console.log('isipo');
  });

});

// Run app
var port = process.env.PORT || config.environment.port;
app.listen(port);
console.log('Server Running');