var express = require("express");
var LZ = require("lz-string");
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(80);
app.use(express.static(__dirname+'/public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('rtcbegin', function(data) {
	var addr = socket.request.connection.remoteAddress;
	console.log('new connection from ' + addr);
	console.info(data);
  });
  socket.on('message', function(data) {
	console.log('got a message');
	console.info(data);
  });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});
