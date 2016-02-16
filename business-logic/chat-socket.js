/**
 * Created by Dhian on 2/14/2016.
 */
var ChatRoom = require('../models/chat-room-model');
var Chat = require('../business-logic/chat');

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

module.exports = function (socket) {
    console.log('a user connected');

    // join rooms if there are any existing rooms
    socket.on('initialize', function (user) {
        joinRooms(socket, user);
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
                socket.broadcast.to(data._id).emit('message', data);
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
                    socket.broadcast.to(data._id).emit('message', data);
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

    socket.on('disconnect', function () {
        var rooms = socket.adapter.rooms;
        for (var room in rooms) {
            if (rooms.hasOwnProperty(room)) {
                socket.leave(room);
            }
        }

        //rooms.forEach(function(room, i){
        //    socket.leave(room);
        //});
        console.log('user disconnected');
    });
}