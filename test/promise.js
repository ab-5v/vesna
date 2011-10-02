var assert = require('assert');
var utils = require('../utils.js');
var P = require('../promise.js');

var iterate = function() {
    var n = 10;
    var count = 0;
    var res = [];

    var it = function() {
        var c = count++;
        res.push(c);
        process.nextTick(function(){
            var t = utils.random(1000, 10000);
            var r = [];
            while (t--) {
                r.push(utils.random(1001, 10001));
                res.push(c);
            }
        });
    };
    while (n--) {
        it();
    }
    console.log(res);

    console.log(res.reduce(function(a, b){ return a >= b ? n : b;}) !== n);
}

//iterate();

var random = function() {
    var n = 10;
    var res = {};
    while (n--) {
        var r = utils.random(0.5,3);
        if (!res[r]) {
            res[r] = 1;
        } else {
            res[r] = res[r] + 1;
        }
    }
    console.log(res);
}


module.exports = {
    "when then": function() {
        assert.ok(false);
    },
    "promise": function() {
        assert.ok(true);
    }
}
