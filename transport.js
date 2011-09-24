var http = require('http');
var url = require('url');

var server = function(controller) {

    http.createServer(function (req, res) {
        var params = url.parse(req.url, true);
        var jsonp = params.query.callback || params.query.jsonp || '';
        var thread = params.query.thread;
        var link = params.query.link;

        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});

        controller({}, function(err, data){
            var result = JSON.stringify(data);
            if (jsonp) {
                result = jsonp + '(' + result + ')';
            }
            res.end(result);
        });

    }).listen(4001, "127.0.0.1");

    console.log('Server running at http://127.0.0.1:4001/');
};

var mailer = function(params) {

};

module.exports = {
    server: server,
    mailer: mailer
};
