var Promise = require('./promise.js');
var utils = require('./utils.js');
var DataProvider = require('./data_provider.js');
var provider = new DataProvider();

var cache = {};

var random = utils.random;

var extend = utils.extend;

module.exports = function(options, callback) {
    var body, offset, link, attach, pBody, pLink;
    var res = {};
    var o = extend({
        body: '1',
        subject: '1',
        link: '0',
        attach: '0'
    }, options);
    var errs = [];
    var promises = [];
    var pop = function(type) {
        var promise = provider.pop(type, function(err, data){
            if (err) {
                errs.push(err);
            }
            res[type] = data;
        });

        promises.push(promise);
        return promise;
    };


    if (o.body === '1') {
        pBody = pop('body');
    }

    if (o.subject === '1') {
        if (o.thread) {
            if (o.thread in cache) {
                res.subject = cache[o.thread];
            } else {
                Promise.when(pop('subject')).then(function(){
                    if (res.subject) {
                        cache[o.thread] = res.subject;
                    }
                });
            }
        } else {
            pop('subject');
        }
    }

    link = random.apply(null, o.link.split('_'));

    if (link) {
        pLink = new Promise();
        promises.push(pLink);

        Promise.when(pBody).then(function(){
            var pLinks = [];
            res.link = [];
            while (link--) {
                pLinks.push(provider.pop('link', function(err, data){
                    if (err) {
                        errs.push(err);
                    }
                    res['link'].push(data);
                }));
            }

            Promise.when(pLinks).then(function(){
                res.body = [res.body ? res.body : ''].concat(res['link']).join('\n');
                pLink.resolve();
            });
        });
    }

    /**
    attach = random.apply(null, o.attach.split('_'));
    if (attach) {
        res.attach = [];
        while (attach--) {
            res.attach.push(provider.pop('attach'));
        }
    }
    */

    Promise.when(promises).then(function(){
        if (errs.length) {
            var err = {message: errs.map(function(a){ return a.message;}).join(' and ')};
            return callback(err);
        }
        callback(null, res);
    });
};
