angular.module('Jiggie-Test')
    .controller('UserFormController', function ($scope, $http, $rootScope, $resource, $modalInstance, $timeout, userData, UserService) {

            $scope.user = userData;
            if ($scope.user == null) {
                $scope.user = {
                    displayName: null,
                    source: null
                };
            }
            $scope.onSave = function () {
                var json = UserService.Save({
                    userModel: $scope.user
                }, function () {
                    if (json.data.success) {
                        $modalInstance.close();
                    } else {
                        if (json.data.validations != null) {
                            toastr.success('Sign up succes. Please login.');
                            $scope.validations = json.data.validations;
                        }
                    }
                });
            };

            $scope.onCancel = function () {
                $modalInstance.close();
            };
        }
    );