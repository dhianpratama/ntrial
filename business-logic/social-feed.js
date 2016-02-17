/**
 * Created by Dhian on 2/16/2016.
 */
var OAuth2 = require('oauth').OAuth2,
    Facebook = require('facebook-node-sdk'),
    http = require('http'),
    https = require('https'),
    flickr = require('fickr');

module.exports = function (config) {
    obj = {}

    var getTwitterFeeds = function (cb) {
        var feeds = {};
        var oauth2 = new OAuth2(config.clientId, config.clientSecret, 'https://api.twitter.com/', null, 'oauth2/token', null);
        var twitterRequestOptions;
        oauth2.getOAuthAccessToken('', {'grant_type': 'client_credentials'}, function (e, access_token) {
            twitterRequestOptions = {
                hostname: 'api.twitter.com',
                path: config.path,
                headers: {
                    Authorization: 'Bearer ' + access_token
                }
            };
            https.get(twitterRequestOptions, function (result) {
                var buffer = '';
                result.setEncoding('utf8');
                result.on('data', function (data) {
                    buffer += data;
                });
                result.on('end', function () {
                    try {
                        feeds.data = JSON.parse(buffer);
                    } catch (err) {
                        feeds = err;
                    }
                    cb(feeds);
                });
            });
        });
    }

    var getFacebookFeeds = function (cb) {
        var facebook = new Facebook({
            appID: config.appId,
            secret: config.secret
        }).setAccessToken(config.accessToken);
        facebook.api(config.path, function (err, data) {
            cb(data);
        });
    }

    obj.getFeeds = function (cb) {
        switch (config.type){
            case "facebook":
                getFacebookFeeds(cb)
                break;
            case "twitter":
                getTwitterFeeds(cb)
                break;
        }
    }
    return obj;
}
