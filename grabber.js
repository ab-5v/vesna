var http = require('http');

/**
{
    host: 'vesna.yandex.ru',
    port: 80,
    path: '/marketing.xml'
}
*/
module.exports = function(options, callback){
    var data = [];

    var req = http.get(options, function(prx) {
        prx.setEncoding('utf8');
        prx.on('data', function (chunk) {
            data.push(chunk);
        });
        prx.on('end', function(){
            callback(null, data.join(''));
        })
    });

    req.on('error', function(e) {
        console.log("Got error: " + e.message);
        callback(e);
    });

    setTimeout(function(){
        req.abort();
        callback({message: 'timeout of ' + (options.timeout || 100) + ' reached'});
    }, options.timeout || 100);
};
