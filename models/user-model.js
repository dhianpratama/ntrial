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
    location: String,
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

module.exports = mongoose.model('User', User);