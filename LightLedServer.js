var net = require('net');
var http = require('http');
var five = require("johnny-five");
var fs = require('fs');
var path = require('path')


var board = new five.Board();

var HOST = '127.0.0.1';
var PORT = 6969;  // TCP listen PORT
var LedData = 0;  // how many LEDs should be turned on
var message = 1; // To http response

fs.readFile('LedStatus.html', function (err, html) {
    if (err) {
        throw err;
    }
// HTTP server
    http.createServer(function (req, res) {
        res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(message + html);
            res.end();
    }).listen(8888);
});

// TCP Server to
net.createServer(function (socket) {

    // connection was received
    console.log('\nA new connection was received from: ' + socket.remoteAddress + ':' + socket.remotePort);

    // handle incoming data - data event handler
    socket.on('data', function (data) {
        message = '[Client -> Server] A new msg was received: ' +  data + ' LEDs will be light out';
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
    led.blink(message*1000);

    this.on("exit", function() {
        led.off();
    });

});

