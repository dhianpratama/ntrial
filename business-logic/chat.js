/**
 * Created by Dhian on 2/14/2016.
 */
var express = require('express');
var router = express.Router();
var jsonWithContext = require('../helper/json-helper');
var ChatRoom = require('../models/chat-room-model');
var operationInfo = require('../helper/operation-info');


router.post('/GetUserChatRooms', function (req, res) {
    var user = req.user;
    var query = {
        'members.displayName': user.displayName
    };
    ChatRoom.find({$query: query, $orderby: {lastUpdateTime: -1}}, {}, function (err, items) {
        if(err)
            throw (err);

        res.json(jsonWithContext(items));
    });
});

router.post('/GetChatRoom', function (req, res) {
    var user = req.user;
    var targetUser = req.body.targetUser;
    var listUsers = [user.username, targetUser.username];
    var query = {
        'members.username': { $all: listUsers }
    };
    ChatRoom.findOne(query, function (err, item) {
        if(err)
            throw (err);

        res.json(jsonWithContext(item));
    });
});

module.exports = router;