/**
 * Created by Dhian on 2/11/2016.
 */
var express = require('express');
var router = express.Router();

module.exports = function(passport){
    router.use('/user', require('../business-logic/user'));
    router.use('/auth', require('../business-logic/auth')(passport));
    router.use('/chat', require('../business-logic/chat'));
    return router
};
