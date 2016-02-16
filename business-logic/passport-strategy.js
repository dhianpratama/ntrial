/**
 * Created by Dhian on 2/13/2016.
 */

var FacebookStrategy = require('passport-facebook').Strategy;
var LocalStrategy= require('passport-local').Strategy;

// load up the user model
var User = require('../models/user-model');

// load the auth variables
var configAuth = require('../config/auth-config');

module.exports = function (passport) {

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findOne({'id': id.id}, function (err, user) {
            done(err, user);
        });
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

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
                        if(!err) {
                            req.user = data;
                            return done(null, data);
                        }
                    });
                });
            })
    );

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
    passport.use(new FacebookStrategy({

            // pull in our app id and secret from our auth.js file
            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL
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

                    var userModel = new User();

                    // set all of the facebook information in our user model
                    userModel.id = profile.id; // set the users facebook id
                    userModel.displayName = profile.displayName;
                    userModel.token = token; // we will save the token that facebook provides to the user
                    userModel.firstName = profile.name.givenName;
                    userModel.lastName = profile.name.familyName;
                    userModel.source = profile.provider;

                    if (user) {
                        userModel.isNew = false;
                    } else {
                        userModel.isNew = true;
                    }
                    // save our user to the database
                    userModel.save(function (err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, userModel);
                    });

                });
            });

        }));

}
;