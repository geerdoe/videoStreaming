var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(3000);

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

var sockets = [];
var usersNameBySocket = [];
io.sockets.on('connection', function (socket) {
  sockets.push(socket);
  socket.emit('news', { hello: 'world' });
  socket.on('chat', function (data) {
    //console.log('function param: '+ JSON.stringify(data));
    console.log('socket session id: '+this.id);
    sendMessage(usersNameBySocket[this.id], data.msg);
  });
  socket.on('usrname', function(data) {
    //console.log ('user name: '+ data.name);
    usersNameBySocket[socket.id] = data.name;
  });
});


function sendMessage(name, msg) {
  //console.log("sendMessage called: " + name + msg);
  sockets.forEach(function(socket) {
    socket.emit('chat', {name: name,  msg: msg });
    //console.log("envia: "+ msg);
  });
}

function doSend() {
  //sendMessage();
  setTimeout(doSend, 10 * 1000);
}

//when your program starts, do stuff right away.
//doSend();
