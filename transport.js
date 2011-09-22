var server = function(callback) {

    http.createServer(function (req, res) {
        var params = url.parse(req.url, true);
        var jsonp = params.query.callback || params.query.jsonp || '';
        var thread = params.query.thread;
        var link = params.query.link;

        res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});

        callback(null, params, function(data){
            res.end(data);
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
