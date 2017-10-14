var app = require('http')//.createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var url = require('url');
var SerialPort = require('serialport');
var net = require('net');

var HOST = '127.0.0.1';
var PORT = 6969;  // TCP listen PORT
var message="";

// initialize serialport to the arduino board using COM3
var arduinoSerialPort = new SerialPort("COM3", {
        baudRate: 115200
        });


    /**
     * helper function to load any app file required by client.html
     * @param  { String } pathname: path of the file requested to the nodejs server
     * @param  { Object } res: http://nodejs.org/api/http.html#http_class_http_serverresponse
     */
    fs.readFile('LedStatus.html', function (err, html) {
        if (err) {
            throw err;
        }
// HTTP server
        app.createServer(function (req, res) {
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
        message = '[Client -> Server] A new message was received: Led number ' +  data + ' will be light out';
        console.log(message);
        //LedData = data;
        socket.write(data);
        arduinoSerialPort.write(data);

    });
    // close event handler
    socket.on('close', function (data) {
        console.log('closed ' + socket.remoteAddress + ':' + socket.remoteport);
    });

}).listen(PORT, HOST);

// just some debug listeners
arduinoSerialPort.on('close', function(err) {
    console.log('Port closed!');
});

arduinoSerialPort.on('error', function(err) {
    console.error('error', err);
});

arduinoSerialPort.on('open', function() {
    console.log('Arduino board connected!');
});