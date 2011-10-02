var assert = require('assert');
var P = require('../promise.js');


module.exports = {
    "when then": function() {
        var p1 = new P();
        var p2 = new P();
        var p3 = new P();
        var p4 = new P();

        P.when(p1, [p2, undefined, p4], p3).then(function(){
            var ok = p1.resolved === p2.resolved === p3.resolved === p4.resolved;
            assert.ok(ok);
        });

        p2.resolve();
        process.nextTick(function(){
            p3.resolve();
            setTimeout(function(){
        p1.resolve();
                p4.resolve();
            }, 200);
        })
    },
    "iterate": function() {
        var n = 10;
        var ref = n;
        var count = 0;
        var res = [];

        var it = function() {
            var c = count++;
            res.push(c);
            process.nextTick(function(){
                res.push(c);
            });
        };
        while (n--) {
            it();
        }

        process.nextTick(function(){
            var ok = res.reduce(function(a, b){ return a >= b ? ref : b;}) !== ref;
            assert.ok(ok);
        });
    }
}
