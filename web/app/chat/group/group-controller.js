angular.module('Jiggie-Test')
    .controller('GroupCtrl', function ($scope, $http, $rootScope, $resource, $modalInstance, $timeout, users, UserService, SessionService) {

        $scope.user = SessionService.get();
        if ($scope.user == null) {
            $scope.user = {};
        }

        $scope.users = users;

        $scope.group = {
            groupName: null
        };

        $scope.onCreateGroup = function () {
            if($scope.group.groupName==null || $scope.group.groupName=='' )
                alert("Please enter group name");

            var members = [];
            angular.forEach($scope.users, function (u, i) {
                if (u.selected)
                    members.push(u);
            });

            if (members.length == 0)
                alert("Please select users to join group");

            var model = {
                me: $scope.user,
                members: members,
                groupName: $scope.group.groupName
            };
            var plainModel = JSON.parse(angular.toJson(model));
            socket.emit('create group chat', plainModel);
            $modalInstance.close();
        };

        $scope.onCancel = function () {
            $modalInstance.close();
        };
    }
);