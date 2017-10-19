var app = require('http')//.createServer(handler);
var io = require('socket.io').listen(app);
var fs = require('fs');
var url = require('url');
var SerialPort = require('serialport');
var net = require('net');

var PropertiesReader = require('properties-reader');
var properties = PropertiesReader('./file.properties');

var tcpPort = properties.get('tcp.port');
var tcpHost = properties.get('http.port');
var httpPort = properties.get('http.port');
var arduinoPort = properties.get('arduino.port');

var message="";

// initialize serialport to the arduino board using arduino serial port
var arduinoSerialPort = new SerialPort(arduinoPort, {
        baudRate: 115200
        });


    /**
     * helper function to load any app file required by LedStatus.html
     * @param  { String } pathname: path of the file requested to the nodejs server
     * @param  { Object } res: http://nodejs.org/api/http.html#http_class_http_serverresponse
     */
    fs.readFile('LedStatus.html', function (err, html) {
        if (err) {
            console.log(err);
            res.writeHead(500);
            return res.end('Error loading client.html');
        }
// HTTP server
        app.createServer(function (req, res) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
            currentHtml = html;
        }).listen(httpPort);

    });

// TCP Server
net.createServer(function (socket) {

    // connection was received
    console.log('\nA new connection was received from: ' + socket.remoteAddress + ':' + socket.remotePort);

    // handle incoming data - data event handler
    socket.on('data', function (data) {
        message = '[Client -> Server] A new message was received: Led number ' +  data + ' will be light out';
        console.log(message);
        socket.write(data);
        arduinoSerialPort.write(data);

    });

    // close event handler
    socket.on('close', function (data) {
        console.log('closed ' + socket.remoteAddress + ':' + socket.remoteport);
    });

}).listen(tcpPort, tcpHost);


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