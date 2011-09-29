var Promise = require('./promise.js');
var utils = require('./utils.js');

var cache = {};

var random = utils.random;

var extend = utils.extend;

module.exports = function(options, provider, callback) {
    var body, offset, link, thread, attach, pBody, pLink, pVideo, pAttach;
    var res = {};
    var o = extend({
        body: '1',
        subject: '1',
        link: '0',
        video: '0',
        attach: '0',
        thread: '0'
    }, options);
    var errs = [];
    var promises = [];
    var pop = function(type) {
        var promise = provider.pop(type, function(err, data){
            if (err) {
                errs.push(err);
            }
            if (!res[type]) {
                res[type] = data;
            } else {
                res[type] = [res[type]].concat(data).join('\n');
            }
        });

        promises.push(promise);
        return promise;
    };


    if (o.body === '1') {
        pBody = pop('body');
    }

    if (o.subject === '1') {
        thread = random.apply(null, o.thread.split('_'));
        if (thread) {
            if (thread in cache) {
                res.subject = cache[thread];
            } else {
                Promise.when(pop('subject')).then(function(){
                    if (res.subject) {
                        cache[thread] = res.subject;
                    }
                });
            }
        } else {
            pop('subject');
        }
    }

    link = random.apply(null, o.link.split('_'));

    if (link) {
        pLink = Promise.iterate(function(){
            return provider.pop('link', function(err, data){
                if (err) {
                    errs.push(err);
                }
                if (!res['link']) {
                    res['link'] = [];
                }
                res['link'].push(data);
            });
        }, link);

        Promise.when(pLink).then(function(){
            res.body = [res.body ? res.body : ''].concat(res['link']).join('\n');
        })

        promises.push(pLink);
    }

    video = random.apply(null, o.video.split('_'));
    if (video) {
        pVideo = Promise.iterate(function(){
            return provider.pop('video', function(err, data){
                if (err) {
                    errs.push(err);
                }
                if (!res['video']) {
                    res['video'] = [];
                }
                res['video'].push(data);
            });
        }, video);

        Promise.when(pVideo).then(function(){
            res.body = [res.body ? res.body : ''].concat(res['video']).join('\n');
        })

        promises.push(pVideo);
    }

    attach = random.apply(null, o.attach.split('_'));
    if (attach) {
        pAttach = Promise.iterate(function(){
            return provider.pop('attach', function(err, data){
                if (err) {
                    errs.push(err);
                }
                if (!res['attach']) {
                    res['attach'] = [];
                }
                res['attach'].push(data);
            });
        }, attach);

        promises.push(pAttach);
    }

    Promise.when(promises).then(function(){
        if (errs.length) {
            var err = {message: errs.map(function(a){ return a.message;}).join(' and ')};
            return callback(err);
        }
        callback(null, res);
    });
};
