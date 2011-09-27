var http = require('http');
var url = require('url');
var utils = require('./utils.js');
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
    controller(params.message, provider, function(err, data){
            console.log(arguments);
        var cmd = 'echo  "' + data.body + '" | mail -s "' + data.subject + '" foginat8@yandex.ru -- -f ' + params.from[0];
        console.log(cmd);
        exec(cmd, function (error, stdout, stderr) {
            console.log(arguments);
        });
    });
};

module.exports = {
    server: server,
    mailer: mailer
};
