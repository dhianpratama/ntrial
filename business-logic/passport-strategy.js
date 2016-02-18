/**
 * Created by Dhian on 2/13/2016.
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;

// load up the user model
var User = require('../models/user-model');
var configAuth = require('../config/auth-config');


module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (user, done) {
        User.findOne({'id': user.id}, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            process.nextTick(function () {
                var query = {
                    'username': username
                };

                User.findOne(query, function (err, user) {
                    if (err) {
                        req.errorInfo = err;
                        return done(err);
                    }

                    if (user) {
                        req.user = false;
                        return done(null, false);
                    } else {
                        var newUser = new User();
                        newUser.username = username;
                        newUser.password = newUser.generateHash(password);
                        newUser.displayName = req.body.displayName;
                        newUser.photo = '/web/img/default-avatar.jpg'
                        newUser.id = username;

                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            req.user = newUser;
                            return done(null, newUser);
                        })
                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true
            },
            function (req, username, password, done) {
                var query = {
                    'username': username
                };
                User.findOne(query, function (err, user) {
                    if (err) {
                        req.errorInfo = err;
                        return done(err);
                    }

                    if (!user) {
                        req.user = false;
                        return done(null, false);
                    }

                    if (!user.validPassword(password)) {
                        req.user = false;
                        return done(null, false);
                    }

                    user.isOnline = true;
                    user.lastLoginTime = new Date();
                    user.save(function (err, data) {
                        if (!err) {
                            req.user = data;
                            return done(null, data);
                        }
                    });
                });
            })
    );


    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebook.clientID,
            clientSecret: configAuth.facebook.clientSecret,
            callbackURL: configAuth.facebook.callbackURL,
            profileFields: configAuth.facebook.profileFields
        },

        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({'id': profile.id}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    var userModel = user != null ? user : new User();
                    // set all of the facebook information in our user model
                    userModel.id = profile.id; // set the users facebook id
                    userModel.displayName = profile.displayName;
                    userModel.token = token; // we will save the token that facebook provides to the user
                    userModel.firstName = profile._json.first_name;
                    userModel.lastName = profile._json.last_name;
                    userModel.source = profile.provider;
                    userModel.photo = profile.photos[0].value;
                    userModel.gender = profile.gender;
                    userModel.bio = profile._json.bio;
                    userModel.location = profile._json.location.name;
                    userModel.isOnline = true;
                    userModel.username = !profile.username ? userModel.firstName : profile.username;
                    userModel.save(function (err, data) {
                        if (err)
                            throw err;
                        return done(null, data);
                    });

                });
            });
        }));

    passport.use(new TwitterStrategy({
            consumerKey: configAuth.twitter.consumerKey,
            consumerSecret: configAuth.twitter.consumerSecret,
            callbackURL: configAuth.twitter.callbackURL

        },
        function (token, tokenSecret, profile, done) {

            // make the code asynchronous
            // User.findOne won't fire until we have all our data back from Twitter
            process.nextTick(function () {

                User.findOne({'id': profile.id}, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    var userModel = user != null ? user : new User();
                    userModel.id = profile.id;
                    userModel.displayName = profile.displayName;
                    userModel.token = token;
                    userModel.source = profile.provider;
                    userModel.photo = profile.photos[0].value;
                    userModel.isOnline = true;
                    userModel.username = profile.username
                    userModel.save(function (err, data) {
                        if (err)
                            throw err;
                        return done(null, data);
                    });
                });
            });
        }));

}
;