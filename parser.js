var qs = require('querystring');

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
    this.offset = 0;
    this._config = {
        host: 'services.digg.com',
        path: '/2.0/digg.getAll',
        port: 80,
        timeout: 3000
    };
}

digg.prototype = {
    config: function() {

        return this._config;
    },
    handle: function(data, callback) {
        var diggs = [];
        try {
            var o = JSON.parse(data);
        } catch(e) {
            callback(e);
        }
        o.diggs.forEach(function(a){
            diggs.push({title: a.item.title, link: a.item.link});
        });
        callback(null, diggs);
    },
    params: function(o) {
        var path = this.config.path;
        var parts = this.config.path.split('?');

        if (!o) {
            return parts[1] && qs.parse(parts[1]) || {};
        }

        var cur = this.params();
        for (var i in o) {
            cur[o] = o[i];
        }

        this.config.path = [parts[0], qs.stringify(cur)].join('?');
    }
};

module.exports = {
    vesna: vesna,
    digg: digg
};
