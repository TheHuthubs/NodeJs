var net = require('net');
var http = require('http');
var five = require("johnny-five");

var board = new five.Board();

var HOST = '127.0.0.1';
var PORT = 6969;  // TCP listen PORT
var LedData = 0;  // how many LEDs should be turned on
var message; // To http response

// HTTP server
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(message);
    res.end();

}).listen(8888);

// TCP Server to
net.createServer(function (socket) {

    // connection was received
    console.log('\nA new connection was received from: ' + socket.remoteAddress + ':' + socket.remotePort);

    // handle incoming data - data event handler
    socket.on('data', function (data) {
        message = "[Client -> Server] A new msg was received:" +  data + "LEDs will be light out";
        console.log(message);
        LedData = data;
        socket.write(data)
    });

    // close event handler
    socket.on('close', function (data) {
        console.log('closed ' + socket.remoteAddress + ':' + socket.remoteport);
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST +':'+ PORT);

board.on("ready", function() {
    console.log("Ready ya hothubbbb!");
    var led = new five.Led(13);
    console.log("light:" + LedData);
    led.blink(5000);

    this.on("exit", function() {
        led.off();
    });

});

