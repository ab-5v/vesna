var provider = new require('./data_provider.js');

var cache = {};

var probability = function(p) {
    var n = 1/p;
    return  Math.ceil(Math.random() * n) % n === 1;
}

module.exports = function(params, callback) {
    var links = !!params.links;
    var thread = !!params.thread;
    var attach = !!params.attach;

    var body = provider.pop('body');
    var subject = provider.pop('subject');

    if (links) {
        body = body.replace(/\.\s/g, function() {
            return probability(0.25) ? provider.pop('link') : '. ';
        });
    }

    if (thread) {
        if (thread in cache) {
            subject = cache[thread];
        } else {
            cache[thread] = subject;
        }
    }

    callback(params.jsonp + '(' + JSON.stringify(result) + ')\n');
};
