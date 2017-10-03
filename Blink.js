var five = require("johnny-five");

var board = new five.Board();

board.on("ready", function() {
    console.log("Ready ya hothubbbb!");
    var led = new five.Led(13);
    led.blink(250);
});
