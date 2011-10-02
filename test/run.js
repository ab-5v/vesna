var fs = require('fs');
var tester = {
    tests: {},
    add: function(tests){
        for (var test in tests) {
            this.tests[test] = tests[test];
        }
    },
    output: function(passed, text) {
        var prefix = passed ?
            [ '\033[32m', 'PASS', '\033[39m' ].join('') :
            [ '\033[31m', 'FAIL', '\033[39m' ].join('');

        console.log(prefix + ': ' + text);
    },
    run: function() {
        for (var test in this.tests) {

            try {
                this.tests[test]();
                this.output(true, test);
            } catch(e) {
                this.output(false, test);
            }
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
