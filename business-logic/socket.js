/**
 * Created by Dhian on 2/15/2016.
 */
var socketio = require('socket.io');
var ChatRoom = require('../models/chat-room-model');
var Chat = require('./chat');
var User = require('../models/user-model');
var Timeline = require('./timeline');
var Enumerable = require('linq');

var joinRooms = function (socket, user) {
    if (!user) return;
    var query = {
        'members.username': user.username
    };
    ChatRoom.find({$query: query, $orderby: {lastUpdateTime: -1}}, {}, function (err, items) {
        if (!err) {
            if (items == null) return;

            items.forEach(function (item, i) {
                socket.join(item._id);
            });
        }
    });
}

module.exports.listen = function (app) {
    var io = socketio.listen(app);

    var userSocketHash = {};

    var users = io.of('/')
    users.on('connection', function (socket) {
        console.log('user connected');

        // join rooms if there are any existing rooms
        socket.on('initialize', function (user) {
            socket.broadcast.emit('user online', user);
            joinRooms(socket, user);
            userSocketHash[user.id] = socket.id;
        });

        socket.on('join chat', function (chatRoom) {
            if (chatRoom != null)
                socket.join(chatRoom._id);
        });

        socket.on('message', function (messageModel) {
            var chatRoom = messageModel.chatRoom;
            if (!chatRoom) {
                var newChatRoom = new ChatRoom();
                newChatRoom.members = [messageModel.user, messageModel.targetUser];
                newChatRoom.messages = [{
                    user: messageModel.user,
                    timestamp: new Date(),
                    message: messageModel.message
                }]
                newChatRoom.lastUpdateTime = new Date();
                newChatRoom.save(function (err, data) {
                    socket.join(data._id);
                    var socketId = userSocketHash[messageModel.targetUser.id];
                    var otherSocket = io.sockets.connected[socketId];
                    if (typeof otherSocket != 'undefined' && otherSocket != null)
                        otherSocket.join(data._id);
                    //socket.broadcast.to(data._id).emit('message', data);
                    io.sockets.in(data._id).emit('message', data);
                });
            } else {
                var query = {
                    '_id': chatRoom._id
                };
                ChatRoom.findOne(query, function (err, data) {
                    var chatRoom = new ChatRoom(data);
                    chatRoom.isNew = false;
                    chatRoom.lastUpdateTime = new Date();
                    chatRoom.messages.push({
                        user: messageModel.user,
                        timestamp: new Date(),
                        message: messageModel.message
                    })
                    chatRoom.save(function (err, data) {
                        //socket.broadcast.to(data._id).emit('message', data);
                        io.sockets.in(data._id).emit('message', data);
                    });
                });
            }
        });

        socket.on('left chat', function (model) {
            var user = model.user;
            var room = model.roomId;
            socket.leave(roomId);
            var msg = user.displayName + 'left chat';
            io.sockets.in(room).emit('left chat', msg);
        });

        socket.on('refreshFeed', function (user) {
            if (typeof user === 'undefined' || user == null) return;
            var timeline = new Timeline(user);
            timeline.getFeeds(function (feeds) {
                socket.emit('feedUpdated', feeds);
            });
        });

        socket.on('disconnect', function () {
            console.log('user disconnect');
            var rooms = socket.adapter.rooms;
            for (var room in rooms) {
                if (rooms.hasOwnProperty(room)) {
                    socket.leave(room);
                }
            }

            var userIds = [];
            for (var userId in userSocketHash) {
                if (userSocketHash[userId] == socket.id)
                    userIds.push(userId);
            }

            var query = {
                id: {$in: userIds}
            }
            User.find(query, function (err, users) {
                users.forEach(function (user, i) {
                    user.isOnline = false;
                    user.save();
                    socket.broadcast.emit('user offline', user);
                })
            });


        });
    })

    return io;
}