var express = require('express');
var path = require('path');

module.exports = function (app) {

    function isAuthenticated(req, res, next) {
        if (typeof req.user != 'undefined' &&
            req.user != null &&
            req.user.authenticated)
            return next();
        res.sendFile(path.join(__dirname + '/../web/login.html'));
    }

    // application -------------------------------------------------------------
    app.get('/', function (req, res) {
        //isAuthenticated(req, res);
        res.sendFile(path.join(__dirname + '/../web/index.html'));
    });
    app.use('/login', function (req, res) {
        res.sendFile(path.join(__dirname + '/../web/login.html'));
    });

};