var fs = require('fs');
var tester = {
    tests: {
        common: {}
    },
    add: function(tests, module){
        var existing = this.tests;

        if (typeof module !== 'string') {
            module = 'common';
        }

        if (!this.tests[module]) {
            this.tests[module] = {};
        }

        Object.keys(tests).forEach(function(name){
            existing[module][name] = tests[name];
        });
    },
    output: function(passed, text) {
        var prefix = passed ?
            [ '\033[32m', 'PASS', '\033[39m' ].join('') :
            [ '\033[31m', 'FAIL', '\033[39m' ].join('');

        console.log(prefix + ': ' + text);
    },
    run: function() {
        var that = this;
        var existing = that.tests;
        var total = 0;
        var success = 0;

        Object.keys(existing).forEach(function(module){
            var tests = existing[module];
            var keys = Object.keys(tests);
            if (!keys.length) {
                return;
            }

            var moduleTotal = 0;
            var moduleSuccess = 0;
            var pass = true;

            console.log('\nRunning test in [' + module + ']:');

            keys.forEach(function(key){
                total++;
                moduleTotal++;

                try {
                    tests[key]();
                } catch(e) {
                    pass = false;
                }

                if (pass) {
                    success++;
                    moduleSuccess++;
                }

                that.output(pass, key);
            });

            if (moduleTotal === moduleSuccess) {
                that.output(true, 'module ' + module);
            } else {
                that.output(false, (moduleTotal - moduleSuccess) + '/' + moduleTotal + ' of module ' + module);
            }
        });

        console.log('\n');
        if (total === success) {
            that.output(true, 'all tests');
        } else {
            that.output(false, (total - success) + '/' + total + ' of tests');
        }
    }
}

if (process.argv.length === 2) {
    fs.readdir(__dirname, function(err, data){
        if (err) {
            return console.log(err);
        }

        data
            .filter(function(fn){return __dirname + '/' + fn != __filename;})
            .forEach(function(fn){
                tester.add(require(__dirname + '/' + fn), fn);
            });

        tester.run();
    });
}
