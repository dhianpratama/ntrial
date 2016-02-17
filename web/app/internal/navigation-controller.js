/**
 * Created by Dhian on 2/15/2016.
 */
angular.module('Jiggie-Test').controller('NavigationCtrl'
    , function ($rootScope, $scope, $timeout, $location, $q, SessionService, AuthenticationService) {

        $rootScope.waitInitialized(function () {
            $scope.user = SessionService.get();
            console.log("USER", $scope.user);
            $scope.menus = [
                {
                    label: 'User',
                    route: '/user'
                },
                {
                    label: 'Messenger',
                    route: '/chat'
                }];

            var timeline = $scope.user.source=='facebook' ? '/timeline' : '/timeline-twitter';
            if($scope.user.source!='local'){
                $scope.menus.push({
                    label: 'Timeline',
                    route: timeline
                })
            }

            $scope.navigatePage = function (route) {
                if (route != null && route != "")
                    $location.path(route);
            };
        });
    });
