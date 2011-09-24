var parsers = require('./parser.js');
var grabber = require('./grabber.js');
var Promise = require('./promise.js');

var data_provider = function() {
    var that = this;
    that.parsers = {};

    for (var name in parsers) {
        var parser = new parsers[name];
        parser.types.forEach(function(a){
            that.parsers[a] = {
                parser: parser,
                cache: []
            }
        });
    }
};

data_provider.prototype = {
    pop: function(type, callback) {
        var that = this;
        var parser = this.parsers[type] && this.parsers[type].parser;
        if (!parser) {
            return callback({message: 'no parser for type ' + parser});
        }
        var cache = this.parsers[type].cache;
        var promise = new Promise();

        if (cache.length) {
            callback(null, cache.shift());
            promise.resolve();
        } else {
            grabber(parser.config, function(err, data){
                if (err) {
                    promise.resolve();
                    return callback(err);
                }

                parser.handle(data, function(err, data){
                    if (err) {
                        promise.resolve();
                        return callback(err);
                    }
                    var done = false;

                    data.forEach(function(item){
                        for (var i in item) {
                            if (!done && i === type) {
                                done = true;
                                callback(null, item[i]);
                                promise.resolve();
                            } else if (i in that.parsers) {
                                that.parsers[i].cache.push(item[i]);
                            }
                        }
                    });

                    if (!done) {
                        promise.resolve();
                        return callback({message: 'cant get result'});
                    }
                });
            });
        }

        return promise;
    }
};

module.exports = data_provider;
