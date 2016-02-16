angular.module('Jiggie-Test').controller('ChatCtrl', function ($rootScope, $scope, $modal, $timeout, SessionService, UserService, ChatRoomService) {

    $rootScope.waitInitialized(function () {
        console.log("CHAT CONTROLLER");

        var user = SessionService.get();

        $scope.users = [];
        $scope.getUsers = function () {
            var json = UserService.GetAllExceptMe(function () {
                $scope.users = json.data;
            });
        };
        $scope.getUsers();

        $scope.targetUser = null;

        $scope.chatRoom = null;
        var getChatHistories = function (targetUser, callback) {
            var json = ChatRoomService.GetChatRoom({
                targetUser: targetUser
            }, function () {
                $scope.chatRoom = json.data;

            });
        };
        $scope.onUserClick = function (user) {
            $scope.targetUser = user;
            getChatHistories(user);
        };

        $scope.model = {
            message: null
        };
        $scope.onSendMessage = function () {
            if ($scope.model.message != null && $scope.model.message != '') {
                var model = {
                    chatRoom: $scope.chatRoom,
                    user: user,
                    targetUser: JSON.parse(angular.toJson($scope.targetUser)),
                    message: $scope.model.message
                }
                socket.emit('message', model);
            }
            $scope.model.message = null;
        };


        socket.on('message', function (chatRoom) {
            $scope.chatRoom = chatRoom;
            $scope.$apply();
            //goToBottom();
        });

        $scope.displayDate = function(date){
            return moment(date).calendar();
        };

        var goToBottom =  function(){
            console.log("go to bottom");
            var id='';
            if($scope.chatRoom.messages!=null && $scope.chatRoom.messages.length>0) {
                id = '#post-' + ($scope.chatRoom.messages.length - 1)
                //jQuery(window).scrollTop(jQuery(id).offset().top);
            }

            var wait = function () {
                try{
                    jQuery(window).scrollTop(jQuery(id).offset().top);
                } catch(err){
                    $timeout(function () {
                        wait();
                    }, 100);
                }
            };
            wait();
        }

        $scope.buildModel = function(messages){
            var newListMessage = [];
            angular.forEach(messages, function(m,i){
                if(m.user.username===user.username)
                    m['isMe'] = true;

                newListMessage.push(m);
            });
            return newListMessage;
        }

        $scope.onKeyPress = function(event){
            if(event.charCode==13){
                $scope.onSendMessage();
            }
        }
    });

});