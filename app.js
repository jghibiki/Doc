var express = require("express");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8000);

app.use(express.static("./app"))

io.on('connection', function (socket) {
  var i = 0;
  socket.emit('s2c', i++);
  socket.on('c2s', function (data) {
    console.log(data);
    setTimeout(function(){
		socket.emit('s2c', i++);
	}, 1000);
  });
});