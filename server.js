//all the required pieces
var express = require('express')  
, app = express()
, server = require('http').createServer(app)
, io = require('socket.io')(server);
var path = require('path');

//front page and it's scripts and styles
app.get('/', function (req, res) {
    res.sendFile(path.resolve('index.html'));
});
app.use('/style.css', express.static(__dirname + '/style.css'));
app.use('/client.js', express.static(__dirname + '/client.js'));

//chat features
var peopleOnline = 0;
io.on('connection', function(socket){
  socket.name = "Unknown" + Math.floor((Math.random() * 100) + 1);
  peopleOnline += 1;

    console.log(socket.name + " connected to chat!");
    io.emit('chat',socket.name + " connected to chat.");
    io.emit('online', peopleOnline);
     socket.emit('name', socket.name);

    	socket.on('chat', function(msg){
    	io.emit('chat', socket.name + ": " +msg);
      console.log(msg);
		});

		socket.on('changename', function(msg){
		io.emit('chat',socket.name + " disconnected.");
		socket.name = msg;
    socket.emit('name', socket.name);
		io.emit('chat',socket.name + " connected to chat.");
		});

   	socket.on('disconnect', function(){
    peopleOnline -= 1;
    io.emit('online', peopleOnline);
    console.log(socket.name + " disconnected.");
    io.emit('chat', socket.name + " disconnected.");
	});
});

//start server on port 8080
server.listen(process.env.OPENSHIFT_NODEJS_PORT || 8080, process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1", function(){
  console.log('listening on port 8080');
});

