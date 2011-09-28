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
    var timeout;

    var req = http.get(options, function(prx) {
        prx.setEncoding('utf8');
        prx.on('data', function (chunk) {
            data.push(chunk);
        });
        prx.on('end', function(){
            clearTimeout(timeout);
            callback(null, data.join(''));
        })
    });

    req.on('error', function(e) {
        clearTimeout(timeout);
        callback(e);
    });

    timeout = setTimeout(function(){
        req.abort();
        callback({message: 'timeout of ' + (options.timeout || 300) + ' reached'});
    }, options.timeout || 300);
};
