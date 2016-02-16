var APP_URL = '/web/app/';
var socket = io();

angular.module('Jiggie-Test', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate', 'ngResource']);

angular.module('Jiggie-Test').config(function($routeProvider) {

    $routeProvider.when('/user',{templateUrl: APP_URL + 'master/user/user.html'});
    $routeProvider.when('/chat',{templateUrl: APP_URL + 'chat/chat.html'});
    $routeProvider.when('/timeline',{templateUrl: APP_URL + 'timeline/timeline.html'});
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});

});

angular.module('Jiggie-Test').run(function($rootScope, $location, $timeout, AuthenticationService, UserService, SessionService, SocketService) {
    var applicationInitialized = false;
    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

    $rootScope.loginUrl = '/Web/login.html';
    var checkLoginStatus = function (callbackIfSuccess) {
        var jsonResult = AuthenticationService.IsLogin(function () {
            var isLoggedIn = jsonResult.data;
            if (isLoggedIn) {
                var jsonResultUser = UserService.GetCurrentUser(function (){
                    var user = jsonResultUser.data;
                    SessionService.set(user);
                    socket.emit('initialize', user);
                    applicationInitialized = true;
                });
            } else {
                //var json = AuthenticationService.GoToLoginPage();
                window.location = $rootScope.loginUrl + '#/';
                applicationInitialized = true;
            }
        });
    };
    checkLoginStatus();

    $rootScope.onLogout = function () {
        var sel = confirm('Are you sure you want to logout?');
        if(sel) {
            var json = AuthenticationService.Logout(function () {
                var data = json.data;
                if (data) {
                    SessionService.set(null);
                    window.location = $rootScope.loginUrl + '#/';
                }
            });
        }
    };

    $rootScope.waitInitialized = function (context) {
        if (applicationInitialized) {
            context();
        } else {
            $timeout(function () {
                $rootScope.waitInitialized(context);
            }, 100);
        }
    };

});
