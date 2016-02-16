angular.module('Jiggie-Test').directive('metis', function($timeout) {
    return function ($scope) {
        if ($scope.$last == true) {
            $timeout(function () {
                $('#side-menu').metisMenu();
            }, 250)
        }
    };
});


