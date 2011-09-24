var DataProvider = require('./data_provider.js');
var provider = new DataProvider();

var cache = {};

var random = function (from, to) {
    if (!to) {return from-0;}
    return Math.floor(Math.random() * (to - from + 1) + (from - 0));
}
var defaults = {
    body: true,
    subject: true,
    link: '0',
    attach: '0'
}

module.exports = function(options, callback) {
    var body, offset, link, attach;
    var res = {};
    var o = defaults;

    if (o.body) {
        res.body = provider.pop('body');
    }

    if (o.subject) {
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
        if (o.body) {
            body = res.body.split('. ');
            offset = Math.floor(body.length / link);
            for (var i = 0, l = link.length; l--;) {
                body.splice(i + offset, 0, '. ' + provider.pop('link') + ' ');
            }
        } else {
            body = [];
            while (link--) {
                body.push(provider.pop('link'));
            }
        }
        res.body = body.join('');
    }

    attach = random.apply(null, o.attach.split('_'));
    if (attach) {
        res.attach = [];
        while (attach--) {
            res.attach.push(provider.pop('link'));
        }
    }

    callback(null, res);
};
