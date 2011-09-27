var fs = require('fs');

var transport = require('./transport.js');
var controller = require('./controller.js');
var DataProvider = require('./data_provider.js');
var provider = new DataProvider();

if (process.argv.length === 2) {
    transport.server(controller, provider);
} else if (process.argv.length === 3){
    var cfgFile = process.argv.pop();
    fs.readFile(cfgFile, 'utf8', function(err, data){
        var params = JSON.parse(data);
        transport.mailer(controller, provider, params);
    });
}
