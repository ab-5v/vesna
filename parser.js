var qs = require('querystring');
var utils = require('./utils.js');
var exec = require('child_process').exec

// vesna.yandex.ru
var vesna = function() {
    this.types = ['subject', 'body'];
    this._config = {
        host: 'vesna.yandex.ru',
        port: 80,
        path: '/marketing.xml'
    };
}
vesna.prototype = {
    config: function() {
        return this._config;
    },
    handle: function(data, callback) {
        var match = data.match(/\<h1[^\>]+\>Тема:\s([^\<]+)\<\/h1\>[^\<]*\<p\>([^\<]+)\<\/p\>[^\<]*\<p\>([^\<]+)/);
        if (match) {
            callback(null, [{
                subject: match[1].replace(/«|»/g, ''),
                body: match[2].replace(/^\s|\n|\s$/g, '') + match[3].replace(/^\s|\n|\s$/g, '')
            }]);
        } else {
            callback({message: "Parse error"});
        }
    }
};

// digg.com
var digg = function() {
    this.types = ['link'];
    this.offset = 1;
    this._config = {
        host: 'services.digg.com',
        path: '/2.0/digg.getAll',
        port: 80,
        timeout: 3000
    };
}

digg.prototype = {
    config: function() {
        this.params({offset: this.offset+=10});
        return this._config;
    },
    handle: function(data, callback) {
        var diggs = [];
        try {
            var o = JSON.parse(data);
        } catch(e) {
            console.log(e);
        }
        if (!o) {
            return callback({message: 'Parse error'});
        }

        o.diggs.forEach(function(a){
            diggs.push({title: a.item.title, link: a.item.link});
        });
        callback(null, diggs);
    },
    params: function(o) {
        var path = this._config.path;
        var parts = path.split('?');

        if (!o) {
            return parts[1] && qs.parse(parts[1]) || {};
        }

        var cur = this.params();
        for (var i in o) {
            cur[i] = o[i];
        }

        this._config.path = [parts[0], qs.stringify(cur)].join('?');
    }
};

// youtube.com
var youtube = function() {
    this.types = ['video'];
    this._config = {
        host: 'gdata.youtube.com',
        path: '/feeds/api/videos?alt=json',
        port: 80,
        timeout: 3000
    };
}

youtube.prototype = {
    config: function() {
        return this._config;
    },
    handle: function(data, callback) {
        var videos = [];
        try {
            var o = JSON.parse(data);
        } catch(e) {
            console.log(e);
        }
        if (!o) {
            return callback({message: 'Parse error'});
        }

        o.feed.entry.forEach(function(a){
            var link = a.link.filter(function(l){return l.rel === 'alternate';})[0];
            videos.push({video: link.href});
        });
        callback(null, videos);
    },
    params: function(o) {
        var path = this._config.path;
        var parts = path.split('?');

        if (!o) {
            return parts[1] && qs.parse(parts[1]) || {};
        }

        var cur = this.params();
        for (var i in o) {
            cur[i] = o[i];
        }

        this._config.path = [parts[0], qs.stringify(cur)].join('?');
    }
};

// youtube.com
var attach = function() {
    this.types = ['attach'];
    this._config = null;
}

attach.prototype = {
    config: function() {
        return this._config;
    },
    handle: function(data, callback) {
        exec('find /tmp/attach -type f', function(err, out){
            callback(err, out.split('\n')
                .filter(function(a){return a;})
                .sort(function(){return utils.random(-1,1);})
                .map(function(a){return {attach: a};})
            );
        });

    }
};
module.exports = {
    vesna: vesna,
    digg: digg,
    youtube: youtube,
    attach: attach
};
