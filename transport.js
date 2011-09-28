var http = require('http');
var url = require('url');
var utils = require('./utils.js');
var Promise = require('./promise.js');
var exec = require('child_process').exec

var server = function(controller, provider) {

    http.createServer(function (req, res) {
        var params = url.parse(req.url, true);
        var query = params.query;
        var jsonp = query.callback || query.jsonp;

        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});

        controller(query, provider, function(err, data){
            if (err) {
                res.end(err.message);
            } else {
                var result = JSON.stringify(data);
                if (jsonp) {
                    result = jsonp + '(' + result + ')';
                }
                res.end(result);
            }
        });

    }).listen(4001, "127.0.0.1");

    console.log('Server running at http://127.0.0.1:4001/');
};

var mailer = function(controller, provider, params) {

    var send = function(data, promise) {
        var from = params.from[utils.random(0, params.from.length-1)];
        var cmd = 'echo  "' + data.body + '" | mail -s "' + data.subject + '" ' + params.to + ' -- -f ' + from;
        exec(cmd, function(err, stdout, stderr){
            if (err) {
                promise.resolve();
                return console.log(err.message);
            }
            if (stderr) {
                console.log(stderr);
            }

            console.log('Sent from ' + from + ' to ' + params.to);

            promise.resolve();
        });
    }

    Promise.iterate(function(){
        var sending = new Promise();
        controller(params.message, provider, function(err, data){
            if (err) {
                sending.resolve();
                console.log(err.message);
                return;
            }

            send(data, sending);
        });
        return sending;
    }, 1);
};

module.exports = {
    server: server,
    mailer: mailer
};
