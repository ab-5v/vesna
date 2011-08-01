var http = require('http');
var url = require('url');

http.createServer(function (req, res) {

    var params = url.parse(req.url, true);
    var jsonp = params.query.callback || params.query.jsonp || '';

    res.writeHead(200, {'Content-Type': 'application/javascript; charset=utf-8'});
    var options = {
        host: 'vesna.yandex.ru',
        port: 80,
        path: '/marketing.xml'
    };

    http.get(options, function(prx) {
        var data = [];
        prx.setEncoding('utf8');
        prx.on('data', function (chunk) {
            data.push(chunk);
        });
        prx.on('end', function(){
            var match = data.join('').match(/\<h1[^\>]+\>Тема:\s([^\<]+)\<\/h1\>[^\<]*\<p\>([^\<]+)/);
            if (match) {
                var result = {
                    subject: match[1].replace(/«|»/g, ''),
                    body: match[2].replace(/^\s|\n|\s$/g, '')
                }
                res.end(jsonp + '(' + JSON.stringify(result) + ')\n');
            } else {
                console.log("Parse error: " + chunk);
            }
        })
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });

    setTimeout(function(){
        res.end(jsonp + '({"subject":"Эксклюзивный клиентский спрос в XXI веке","body":"Отсюда естественно следует, что экспертиза выполненного проекта недостаточно развивает охват аудитории, не считаясь с затратами. Искусство медиапланирования, безусловно, наиболее полно усиливает фирменный анализ зарубежного опыта, не считаясь с затратами. Фактор коммуникации, как принято считать, транслирует межличностный план размещения, опираясь на опыт западных коллег. Охват аудитории, согласно Ф.Котлеру, основан на тщательном анализе. Ценовая стратегия инновационна."})');
    }, 100);

}).listen(4001, "127.0.0.1");
console.log('Server running at http://127.0.0.1:4001/');
