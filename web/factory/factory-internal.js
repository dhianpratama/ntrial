angular.module('Jiggie-Test')

    .service('SessionService', [function () {
        var session = null;
        var login = false;
        return {
            get: function () {
                return session;
            },
            set: function (data) {
                session = data;
            },
            isLogin: function () {
                return login;
            },
            setIsLogin: function (data) {
                login = data;
            }
        };
    }])

    .service('SocketService', [function () {
        var _socket = null;
        return {
            socket: function(){
                return _socket;
            },
            initialize: function () {
                _socket = io();
            }
        };
    }])

    .factory('ToastMessageService', ['$rootScope', '$timeout',
        function ($rootScope, $timeout) {
            var a = $rootScope;

            return {
                showInfo: function (type, message) {
                    $rootScope.clearAllInfo();
                    $rootScope.addInfo(type, message);
                    $timeout(function () {
                        $rootScope.clearAllInfo();
                    }, 3000);
                },
                showSaveMessage: function (name) {
                    $rootScope.clearAllInfo();
                    $rootScope.addInfo("success", name + " succesfully saved.");
                    $timeout(function () {
                        $rootScope.clearAllInfo();
                    }, 3000);
                },
                showDeleteMessage: function (name) {
                    $rootScope.clearAllInfo();
                    $rootScope.addInfo("success", name + " successfully deleted.");
                    $timeout(function () {
                        $rootScope.clearAllInfo();
                    }, 3000);
                }
            };

        }])


;
