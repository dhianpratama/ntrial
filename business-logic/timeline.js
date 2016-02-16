/**
 * Created by Dhian on 2/16/2016.
 */
var config;
var Timeline = function (user) {
    var config;
    switch (user.source) {
        case 'facebook':
            config = {
                appId: '214640925552429',
                secret: 'c9591e659c9a325a6e5c692fe22859ac',
                path: '/me/feed',
                accessToken: user.token,
                type: user.source
            }
            break;
    }
    this.config = config;
}

Timeline.prototype.getFeeds = function (cb) {
    var socialFeeds = require('./social-feed')(this.config);
    socialFeeds.getFeeds(function(feeds){
        cb(feeds);
    });

};

module.exports = Timeline;
