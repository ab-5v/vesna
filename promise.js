var Promise = function() {
    this.resolved = false;
    this.waiters = [];
}

Promise.prototype = {
    _add: function(cb) {
        if (this.resolved) {
            cb();
        } else {
            this.waiters.push(cb);
        }
    },
    resolve: function() {
        this.resolved = true;
        while (this.waiters.length) {
            this.waiters.shift()();
        }
    }
}

Promise.when = function() {
    var promises = Array.prototype.slice.call(arguments)
        // flatten
        .reduce(function(a, b){
            if (b instanceof Array) {
                a = a.concat(b);
            } else {
                a.push(b);
            }
            return a;
        }, [])
        // filtering
        .filter(function(a){
            return 'resolved' in a;
        });

    return {
        then: function(callback) {
            var unresolved = promises.length;
            if (unresolved === 0) {
                callback();
            } else {
                var onresolve = function() {
                    unresolved--;
                    if (unresolved === 0) {
                        callback();
                    }
                }

                promises.forEach(function(p){
                    p._add(onresolve);
                });
            }
        }
    }
};

module.exports = Promise;
