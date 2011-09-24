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

data_provider.prototype = {
    pop: function(type, callback) {
        return type;
    }
};

module.exports = data_provider;
