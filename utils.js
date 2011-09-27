module.exports = {
    random: function (from, to) {
        if (!to) {return from-0;}
        return Math.floor(Math.random() * (to - from + 1) + (from - 0));
    },
    extend: function (from, to) {
        for (var name in to) {
            if (to[name] !== undefined) {
                from[name] = to[name];
            }
        }
        return from;
    }
}
