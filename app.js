var http = require('http');
var url = require('url');

var cache = {};
var diggs = [];
var count = 0;
var resp;

var onData = {
    vesna: function(data, params) {
        var match = data.match(/\<h1[^\>]+\>Тема:\s([^\<]+)\<\/h1\>[^\<]*\<p\>([^\<]+)\<\/p\>[^\<]*\<p\>([^\<]+)/);
        var thread = params.thread;
        if (match) {
            var result = {
                subject: match[1].replace(/«|»/g, ''),
                body: match[2].replace(/^\s|\n|\s$/g, '') + match[3].replace(/^\s|\n|\s$/g, '')
            }

            if (params.link) {
                result.body = result.body.replace(/\.\s/g, function(){ return Math.ceil(Math.random()*4)%4 === 1 ? diggs[count++].link : '. '; });
            }

            if (thread) {
                if (thread in cache) {
                    result.subject = cache[thread];
                } else {
                    cache[thread] = result.subject;
                }
            }
            resp.end(params.jsonp + '(' + JSON.stringify(result) + ')\n');
        } else {
            console.log("Parse error: ");
        }
    },
    digg: function(data) {
        var o = JSON.parse(data);
        o.diggs.map(function(a){ diggs.push({titel: a.item.title, link: a.item.link});});
        console.log('dig');
    }
};

var grabber = function(options, onData, params){
    http.get(options, function(prx) {
        var data = [];
        prx.setEncoding('utf8');
        prx.on('data', function (chunk) {
            data.push(chunk);
        });
        prx.on('end', function(){
            onData(data.join(''), params);
        })
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
};

var offset = 1;
var run = function() {
    grabber({host: 'services.digg.com', path: '/2.0/digg.getAll?count=100&offset=' + offset, port: 80}, onData.digg);
    setTimeout(function(){
        offset++;
        run();
    }, 20000)
}

run();

http.createServer(function (req, res) {
    resp = res;
    var params = url.parse(req.url, true);
    var jsonp = params.query.callback || params.query.jsonp || '';
    var thread = params.query.thread;
    var link = params.query.link;

    res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});

    grabber({
        host: 'vesna.yandex.ru',
        port: 80,
        path: '/marketing.xml'
    }, onData.vesna, {jsonp: jsonp, thread: thread, link: link});

    setTimeout(function() {res.end('');}, 100);

}).listen(4001, "127.0.0.1");
console.log('Server running at http://127.0.0.1:4001/');
