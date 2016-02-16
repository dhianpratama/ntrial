angular.module('Jiggie-Test').controller('UserCtrl', function ($rootScope, $scope, $modal, UserService) {

    $rootScope.waitInitialized(function () {
        console.log("initialized")
        $scope.users = [];
        $scope.Fetch = function () {
            var json = UserService.GetAll(function () {
                var data = json.data;
                $scope.users = data;
            });
        }
        $scope.Fetch();

        var openModal = function (data) {
            $modal.open({
                templateUrl: APP_URL + "master/user/user-form/user-form.html",
                controller: 'UserFormController',
                animation: true,
                resolve: {
                    userData: function () {
                        return data;
                    }
                }
            }).result.then(function (result) {
                    $scope.Fetch();
                });
        };
        $scope.onCreateNew = function () {
            openModal(null);
        };
        $scope.onRowEdit = function (userData) {
            openModal(angular.copy(userData));
        };
        $scope.onRowDelete = function (userData) {
            var sel = confirm("Are you sure you want to delete user [" + userData.username + "] ?");
            if (sel) {
                var json = UserService.Delete({
                    _id: userData._id
                }, function () {
                    if (json.data.success) {
                        $scope.Fetch();
                    }
                });
            }
        };
    });

});