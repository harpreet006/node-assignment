var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
<<<<<<< HEAD
   res.sendfile('broad.html');
=======
   res.sendfile('bread.html');
>>>>>>> 1538df8b796b416173d88a0a9272523ec567bafd
});

var clients = 0;
io.on('connection', function(socket) {
   clients++;
<<<<<<< HEAD
   io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
   socket.on('disconnect', function () {
      clients--;
      io.sockets.emit('broadcast',{ description: clients + ' clients connected!'});
=======
   socket.emit('newclientconnect',{ description: 'Hey, welcome!'});
   socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
   socket.on('disconnect', function () {
      clients--;
      socket.broadcast.emit('newclientconnect',{ description: clients + ' clients connected!'})
>>>>>>> 1538df8b796b416173d88a0a9272523ec567bafd
   });
});

http.listen(3000, function() {
   console.log('listening on localhost:3000');
});