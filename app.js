var http = require('http');
var url = require('url');

var transport = require('./transport.js');
var controller = require('./controller.js');

if (process.argv.length === 2) {
    transport.server(controller);
} else {
    //
}
