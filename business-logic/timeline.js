/**
 * Created by Dhian on 2/16/2016.
 */
var authConfig = require('../config/auth-config');

var config;
var Timeline = function (user) {
    var config;
    switch (user.source) {
        case 'facebook':
            config = {
                appId: authConfig.facebook.clientID,
                secret: authConfig.facebook.clientSecret,
                path: '/me/feed',
                accessToken: user.token,
                type: user.source
            }
            break;
        case 'twitter':
            config = {
                path: '/1.1/statuses/user_timeline.json?screen_name=' + user.username,
                clientId: authConfig.twitter.consumerKey,
                clientSecret: authConfig.twitter.consumerSecret,
                type: user.source
            }
            break;
    }
    this.config = config;
}

Timeline.prototype.getFeeds = function (cb) {
    var socialFeeds = require('./social-feed')(this.config);
    socialFeeds.getFeeds(function (feeds) {
        cb(feeds);
    });

};

module.exports = Timeline;
