/**
 * Created by Dhian on 2/11/2016.
 */
var express = require('express');
var router = express.Router();
var jsonWithContext = require('../helper/json-helper');
var User = require('../models/user-model');
var operationInfo = require('../helper/operation-info');

router.post('/Save', function (req, res) {
    var saveModel = req.body.userModel;
    var newUser = new User(saveModel);
    if (typeof saveModel._id === 'undefined' || typeof saveModel._id == null)
        newUser.isNew = true;
    else
        newUser.isNew = false;
    newUser.save(function (err, data) {
        if (err) {
            throw err;
        }
        res.json(jsonWithContext(operationInfo.success(data)));
    });
});

router.post('/Delete', function (req, res) {
    User.remove({
        _id: req.body._id
    }, function (err) {
        if (err)
            res.send(err);
        res.json(jsonWithContext(operationInfo.success()));
    });
});

router.post('/GetAll', function (req, res) {
    User.find({$query: {}, $orderby: {'lastloginTime': -1}}, {}, function (err, items) {
        res.json(jsonWithContext(items));
    });
});

router.post('/GetAllExceptMe', function (req, res) {
    if(req.user) {
        var query = {
            'username': {
                $ne: req.user.username
            }
        }
        User.find({$query: query, $orderby: {'lastloginTime': -1}}, {}, function (err, items) {
            res.json(jsonWithContext(items));
        });
    } else {
        res.json(jsonWithContext([]))
    }
});

router.post('/GetCurrentUser', function (req, res) {
    res.json(jsonWithContext(req.user));
});


module.exports = router;