var DataProvider = require('./data_provider.js');
var provider = new DataProvider();

var cache = {};

var random = function (from, to) {
    if (!to) {return from-0;}
    return Math.floor(Math.random() * (to - from + 1) + (from - 0));
}

var extend = function (from, to) {
    for (var name in to) {
        if (to[name] !== undefined) {
            from[name] = to[name];
        }
    }
    return from;
}

module.exports = function(options, callback) {
    var body, offset, link, attach;
    var res = {};
    var o = extend({
        body: '1',
        subject: '1',
        link: '0',
        attach: '0'
    }, options);

    if (o.body === '1') {
        res.body = provider.pop('body');
    }

    if (o.subject === '1') {
        if (o.thread) {
            if (o.thread in cache) {
                res.subject = cache[o.thread];
            } else {
                res.subject = cache[o.thread] = provider.pop('subject');
            }
        } else {
            res.subject = provider.pop('subject');
        }
    }

    link = random.apply(null, o.link.split('_'));

    if (link) {
        body = [res.body || ''];
        while (link--) {
            body.push('\n' + provider.pop('link'));
        }
        res.body = body.join('');
    }

    attach = random.apply(null, o.attach.split('_'));
    if (attach) {
        res.attach = [];
        while (attach--) {
            res.attach.push(provider.pop('attach'));
        }
    }

    callback(null, res);
};
