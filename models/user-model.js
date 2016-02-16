/**
 * Created by Dhian on 2/11/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var authConfig = require('../config/auth-config');

var User = mongoose.Schema({
    id: String,
    username: String,
    password: String,
    token: String,
    displayName: String,
    firstName: String,
    lastName: String,
    gender: String,
    bio: String,
    location: {
        lat: Number,
        lon: Number
    },
    photo: String,
    source: { type: String, default: 'local' },
    isOnline: { type: Boolean, default: false },
    lastLoginTime: Date
});

User.methods.generateHash = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};

User.methods.getAccessToken = function(code, cb){
    FB.api('oauth/access_token', {
        client_id: authConfig.facebook.clientID,
        client_secret: authConfig.facebook.clientSecret,
        redirect_uri: authConfig.facebook.callbackURL,
        code: code
    }, function (res) {
        if(!res || res.error) {
            cb(res.error);
            return;
        }

        cb(null, res);
    });
}

module.exports = mongoose.model('User', User);