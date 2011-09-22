var parsers = require('./parser.js');
var grabber = require('./grabber.js');

var data_provider = function() {
    var that = this;
    that.parsers = {};

    for (var name in parsers) {
        var parser = new parsers[name];
        parser.types.forEach(function(a){
            that.parsers[a] = parser;
        });
    }
};

data_provide.prototype = {
    pop: function(type, callback) {
    }
};

module.exports = data_provider;
