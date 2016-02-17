angular.module('Jiggie-Test').controller('TimelineCtrl', function ($rootScope, $scope, $modal, $timeout, $interval, SessionService) {

    $rootScope.waitInitialized(function () {
        var user = SessionService.get();
        $scope.user = user;
        $scope.feeds = [];

        $scope.refresh = function () {
            socket.emit('refreshFeed', user);
        };

        socket.on('feedUpdated', function (feeds) {
            $scope.feeds = feeds.data;
            $scope.$apply();
            console.log("FEEDS ", $scope.feeds);
        });

        $scope.getTimeline = function(){
            $scope.refresh();
        };

        $scope.displayDate = function(date){
            return moment(date).format('DD/MM/YYYY');
        };
        $scope.displayTime = function(date){
            return moment(date).format('HH:mm');
        };

        $scope.refresh();
        var intervalRefresh = $interval($scope.refresh, 60 * 1000);
        $scope.$on('$destroy', function () {
            $interval.cancel(intervalRefresh);
        });

    });

});