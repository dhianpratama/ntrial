angular.module('Jiggie-Test').controller('NavigationCtrl'
    ,function ($rootScope, $scope, $timeout, $location, $q, SessionService, AuthenticationService, ModuleGroupService) {

            $rootScope.waitInitialized(function () {
                $scope.moduleGroups = [];
                var jsonMg = ModuleGroupService.GetAllModuleGroups();

                $scope.refetchModuleGroups = function () {
                    ModuleGroupService.GetAllModuleGroups();
                };

                $q.all([jsonMg.$promise])['finally'](function () {
                    $scope.moduleGroups = jsonMg.data;
                });

                var user = SessionService.get();
                $scope.user = user;

                $scope.navigatePage = function (route) {
                    if (route != null && route != "")
                        $location.path(route);
                };

                $scope.hasAcl = function (aclKey) {
                    var result = false;
                    if (user != null && user.Acls != null) {
                        angular.forEach(user.Acls, function (acl, i) {
                            if (aclKey == acl) result = true;
                        });
                    }
                    return result;
                };
            });
        });
