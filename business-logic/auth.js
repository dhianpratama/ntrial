/**
 * Created by Dhian on 2/12/2016.
 */
/**
 * Created by Dhian on 2/11/2016.
 */
var express = require('express');
var router = express.Router();
var jsonWithContext = require('../helper/json-helper');
var User = require('../models/user-model');
var operationInfo = require('../helper/operation-info');
var FB = require('facebook-node');
FB.setApiVersion("v2.2");
var authConfig = require('../config/auth-config');

module.exports = function (passport) {
    router.post('/isLogin', function (req, res) {
        var authenticated = req.isAuthenticated();
        res.json(jsonWithContext(authenticated));
    });

    router.post('/logout', function (req, res) {
        req.logout();
        res.json(jsonWithContext(true))
    });

    router.get('/facebook', passport.authenticate('facebook', {scope: 'email'}));

// handle the callback after facebook has authenticated the user
    router.get('/facebook/callback',passport.authenticate('facebook', {
        successRedirect: '/',
        failureRedirect: '/'
    }));

    router.post('/signup', passport.authenticate('local-signup'), function (req, res) {
        if (req.errorInfo)
            res.json(jsonWithContext(operationInfo.fail(req.errorInfo)));

        res.json(jsonWithContext(operationInfo.success(req.user)));
    });

    router.post('/login', passport.authenticate('local-login'), function(req, res){
        if (req.errorInfo)
            res.json(jsonWithContext(operationInfo.fail(req.errorInfo)));

        res.json(jsonWithContext(operationInfo.success(req.user)));
    });

    return router;
};