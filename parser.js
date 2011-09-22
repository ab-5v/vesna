var qs = require('querystring');

// vesna.yandex.ru
var vesna = function() {
    this.types = ['subject', 'body'];
    this.config = {
        host: 'vesna.yandex.ru',
        port: 80,
        path: '/marketing.xml'
    };
}
vesna.prototype = {
    handler: function(data) {
        var match = data.match(/\<h1[^\>]+\>Тема:\s([^\<]+)\<\/h1\>[^\<]*\<p\>([^\<]+)\<\/p\>[^\<]*\<p\>([^\<]+)/);
        var thread = params.thread;
        if (match) {
            return [{
                subject: match[1].replace(/«|»/g, ''),
                body: match[2].replace(/^\s|\n|\s$/g, '') + match[3].replace(/^\s|\n|\s$/g, '')
            }]
        } else {
            console.log("Parse error: ");
        }
    }
};

// digg.com
var digg = function() {
    this.types = ['links'];
    this.config = {
        host: 'services.digg.com',
        path: '/2.0/digg.getAll',
        port: 80
    };
}

digg.prototype = {
    handler: function(data) {
        var digs = {};
        var o = JSON.parse(data);
        o.diggs.forEach(function(a){
            diggs.push({title: a.item.title, link: a.item.link});
        });
        return diggs;
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
