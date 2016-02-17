var APP_URL = '/web/';
toastr.options = {
    closeButton: true,
    progressBar: false,
    showMethod: 'slideDown',
    timeOut: 2000,
    positionClass: 'toast-top-center',
};

angular.module('Jiggie-Test', ['ui.bootstrap', 'ui.utils', 'ngRoute', 'ngAnimate', 'ngResource']);

angular.module('Jiggie-Test').config(function ($routeProvider) {
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo: '/home'});

});

angular.module('Jiggie-Test').run(function ($rootScope, $location, AuthenticationService, UserService) {
    $rootScope.safeApply = function (fn) {
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
                var jsonResultUser = UserService.GetCurrentUser(function () {
                    var user = jsonResultUser.data;
                    if ($location.path() == null || $location.path() == '' || $location.path() == '/') {
                        window.location = "/Web/index.html#" + user.DefaultRoute;
                    }
                    else {
                        window.location = "/Web/index.html#" + $location.$$url;
                    }
                });
            }
        });
    };
    checkLoginStatus();

});

angular.module('Jiggie-Test')
    .controller('LoginCtrl',
    function LoginCtrl($rootScope, $scope, $resource, $location, $timeout, $modal, AuthenticationService, UserService, SessionService) {

        $scope.user = {
            username: null,
            password: null
        };

        $scope.onLogin = function () {
            var jsonLogin = AuthenticationService.Login({
                username: $scope.user.username,
                password: $scope.user.password
            }, function () {
                var data = jsonLogin.data;
                if (data.success) {
                    var user = data.dataResult;
                    if(user){
                        window.location = "/Web/index.html#"
                    };
                } else {
                    if (data.validations != null) {
                        angular.forEach(data.validations, function (v, i) {

                            //$rootScope.addInfo("error", v.message);
                        });
                    }
                }
            },function(err){
                if(err.status==401)
                    toastr.error('Invalid username / password');
            });
        };

        $scope.onLoginFacebook = function () {
            window.location = '/api/auth/facebook';
        };
        $scope.onLoginTwitter = function () {
            window.location = '/api/auth/twitter';
        };

        var openModal = function () {
            $modal.open({
                templateUrl: APP_URL + "sign-up-form.html",
                controller: 'SignUpFormCtrl',
                animation: true
            }).result.then(function (result) {

                });
        };

        $scope.onCreateNew = function () {
            openModal(null);
        };
    })

    .controller('SignUpFormCtrl',
    function SignUpFormCtrl($rootScope, $scope, $resource, $location, $timeout, $modalInstance, AuthenticationService, UserService, SessionService) {

        $scope.user = {
            username: null,
            password: null,
            displayName: null
        };

        $scope.onSignUp = function () {
            var json = AuthenticationService.SignUp({
                username: $scope.user.username,
                password: $scope.user.password,
                displayName: $scope.user.displayName
            }, function () {
                var data = json.data;
                if (data.success) {
                    toastr.success('Sign-up success. Please login');
                    $modalInstance.close();
                }
            });
        };

        $scope.onCancel = function(){
            $modalInstance.close();
        }
    });