var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
}

var path = require('path');
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Server running ...');

// app.use('/public', express.static(path.join(__dirname, '/public')));

app.get('/', function(req, res) {

    if (connections.length === 0) {
        app.use('/', express.static(path.join(__dirname)));
        res.sendFile(__dirname + '/index.html');
    }
    else if(connections.length > 0) {
        app.use('/public', express.static(path.join(__dirname, '/public')));
        res.sendFile(__dirname + '/animationPage.html');
    }
});

// app.use('/docs/resources/styles', express.static(path.join(__dirname, '/docs/resources/styles')));
// app.use("/docs/resources/styles", express.static( __dirname + '/docs/resources/styles'));

io.sockets.on('connection', function(socket) {
    connections.push(socket);


    // socket.id = Math.floor(Date.now() * Math.random());
    // socket.on('data', function(data) {
    //     socket.write('ID: ' + socket.id);
    // });
    console.log('Socket ID is: %s', socket.id);

    console.log('One Connected: %s sockets connected', connections.length);
    // io.to(connections[0]).emit('send message', {msg: 'Hello'});

    //Disconnect
    socket.on('disconnect', function(socket) {
        connections.splice(connections.indexOf(socket), 1);
        console.log('One Disconnected: %s sockets connected', connections.length);
        if(connections.length === 1){
            localStorage.removeItem("stringJSON");
            console.log("localStorage cleared");
        }
    });

    // socket.on('send message', function(){
    //     // io.sockets.emit('new message', {msg: data});
    //     ;
    // });

    socket.on('begin animation', function (data) {
        console.log("Users after animation started " + connections.length);
        io.sockets.emit('begin animation', data.animator);
        io.to(connections[0].id).emit('send message', data.animator.diagram.content[0].content[0].from.toString());
    })



});