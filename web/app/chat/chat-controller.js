angular.module('Jiggie-Test').controller('ChatCtrl', function ($rootScope, $scope, $modal, $timeout, SessionService, UserService, ChatRoomService, SocketService) {

    $rootScope.waitInitialized(function () {
        //SocketService.initialize();

        var user = SessionService.get();

        $scope.target = null;
        $scope.onUserClick = function (user) {
            $scope.target = user;
            $scope.targetUser = user;
            $scope.targetGroup = null;
            getChatHistories(user);
        };

        $scope.onUserClickGroup = function (group) {
            $scope.target = group;
            $scope.targetGroup = group;
            $scope.targetUser = null;
            getGroupChatHistories(group);
        };

        $scope.users = [];
        $scope.getUsers = function () {
            var json = UserService.GetAllExceptMe(function () {
                $scope.users = json.data;
                if ($scope.users != null && $scope.users.length > 0) {
                    $scope.onUserClick($scope.users[0]);
                }
            });
        };
        $scope.getUsers();

        $scope.groups = [];
        $scope.getGroups = function () {
            var json = ChatRoomService.GetGroups(function () {
                $scope.groups = json.data;
            });
        };
        $scope.getGroups();

        $scope.targetUser = null;

        $scope.chatRoom = null;
        var getChatHistories = function (targetUser, callback) {
            var json = ChatRoomService.GetChatRoom({
                targetUser: targetUser
            }, function () {
                $scope.chatRoom = json.data;
            });
        };

        var getGroupChatHistories = function (targetGroup) {
            var json = ChatRoomService.GetGroupChatRoom({
                targetGroup: targetGroup
            }, function () {
                $scope.chatRoom = json.data;
            });
        };

        $scope.model = {
            message: null
        };
        $scope.onSendMessage = function () {
            if ($scope.model.message != null && $scope.model.message != '') {
                var isGroup = $scope.target.isGroup;
                var model = {
                    chatRoom: $scope.chatRoom,
                    user: user,
                    targetUser: JSON.parse(angular.toJson($scope.targetUser)),
                    message: $scope.model.message,
                    isGroup: isGroup
                }
                socket.emit('message', model);
            }
            $scope.model.message = null;
        };


        socket.on('message', function (chatRoom) {
            $scope.chatRoom = chatRoom;
            $scope.$apply();
        });

        socket.on('user online', function (user) {
            angular.forEach($scope.users, function (u, i) {
                if (u.id == user.id) {
                    u.isOnline = true;
                }
            });
            $scope.$apply();
        });

        socket.on('user offline', function (user) {
            angular.forEach($scope.users, function (u, i) {
                if (u.id == user.id) {
                    u.isOnline = false;
                }
            });
            $scope.$apply();
        });

        socket.on('group chat created', function (group) {
            $scope.getGroups();
        })

        $scope.displayDate = function (date) {
            return moment(date).calendar();
        };

        $scope.buildModel = function (messages) {
            var newListMessage = [];
            angular.forEach(messages, function (m, i) {
                if (m.user.username === user.username)
                    m['isMe'] = true;

                newListMessage.push(m);
            });
            return newListMessage;
        };

        $scope.onKeyPress = function (event) {
            if (event.charCode == 13) {
                $scope.onSendMessage();
            }
        };

        var openModal = function () {
            $modal.open({
                templateUrl: APP_URL + "chat/group/group.html",
                controller: 'GroupCtrl',
                animation: true,
                resolve: {
                    users: function () {
                        return angular.copy($scope.users);
                    }
                }
            }).result.then(function () {
                    $scope.getGroups();
                });
        };
        $scope.onCreateGroup = function () {
            openModal();
        };
    });

});